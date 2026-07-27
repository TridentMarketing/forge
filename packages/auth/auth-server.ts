/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * auth-server.ts
 * Copyright (C) 2025 Nextify Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { withCloudflare } from '@libra/better-auth-cloudflare'
// Declare global KV binding
import { stripe } from '@libra/better-auth-stripe'
import { log, isDevelopment } from '@libra/common'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { betterAuth, type Session } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, bearer, emailOTP, organization } from 'better-auth/plugins'
import { emailHarmony } from 'better-auth-harmony'
import { getAuthDb } from './db'
import { env as envs } from './env.mjs'
import { getActiveOrganization, plugins } from './plugins'
import { getAdminUserIds } from './env.mjs'

// Runtime auth builder using Cloudflare D1 and KV
async function authBuilder() {
  const dbInstance = await getAuthDb()
  const { env } = await getCloudflareContext({ async: true })
  return betterAuth(
    withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        d1: {
          db: dbInstance,
          options: {
            // usePlural: true,
            // debugLogs: true,
          },
        },
        // Use global KV binding in Cloudflare Workers
        // @ts-ignore
        kv: env.KV,
      },
      {
        databaseHooks: {
          session: {
            create: {
              before: async (session: Session) => {
                try {
                  const organization = await getActiveOrganization(session.userId)

                  log.auth('info', 'Session created successfully', {
                    userId: session.userId,
                    organizationId: organization.id,
                    operation: 'session_create',
                  })

                  return {
                    data: {
                      ...session,
                      activeOrganizationId: organization.id,
                    },
                  }
                } catch (error) {
                  log.auth(
                    'error',
                    'Failed to create session',
                    {
                      userId: session.userId,
                      operation: 'session_create',
                    },
                    error as Error
                  )
                  throw error
                }
              },
            },
          },
        },
        socialProviders: {
          github: {
            clientId: envs.BETTER_GITHUB_CLIENT_ID as string,
            clientSecret: envs.BETTER_GITHUB_CLIENT_SECRET as string,
            // Request org read access alongside the defaults (read:user,
            // user:email) so we can verify org membership below. A plain
            // GitHub OAuth App (unlike a GitHub App) has no way to restrict
            // sign-in to an org on GitHub's side — it must be enforced here.
            scope: envs.GITHUB_ALLOWED_ORG ? ['read:user', 'user:email', 'read:org'] : undefined,
            // better-auth's getUserInfo type signature doesn't reflect that
            // returning null is valid runtime behavior (it treats null as
            // "lookup/authorization failed" and rejects the sign-in) — cast
            // to satisfy the declared type while keeping the null-return
            // authorization gate intact.
            getUserInfo: (envs.GITHUB_ALLOWED_ORG
              ? async (token: { accessToken?: string }) => {
                  const headers = {
                    'User-Agent': 'better-auth',
                    authorization: `Bearer ${token.accessToken}`,
                  }

                  const profileRes = await fetch('https://api.github.com/user', { headers })
                  if (!profileRes.ok) return null
                  const profile = await profileRes.json() as {
                    id: number
                    login: string
                    name: string | null
                    email: string | null
                    avatar_url: string
                  }

                  // Enforce org membership before doing anything else — returning
                  // null here makes better-auth reject the sign-in entirely.
                  const membershipRes = await fetch(
                    `https://api.github.com/orgs/${envs.GITHUB_ALLOWED_ORG}/members/${profile.login}`,
                    { headers }
                  )
                  // GitHub returns 204 if the user is a member, 404 if not (or if
                  // the requester lacks visibility — acceptable fail-closed
                  // behavior for an internal tool).
                  if (membershipRes.status !== 204) {
                    log.auth('warn', 'Rejected sign-in: not a member of required GitHub org', {
                      githubLogin: profile.login,
                      requiredOrg: envs.GITHUB_ALLOWED_ORG,
                      operation: 'github_org_check',
                    })
                    return null
                  }

                  const emailsRes = await fetch('https://api.github.com/user/emails', { headers })
                  const emails = emailsRes.ok
                    ? (await emailsRes.json() as Array<{ email: string; primary: boolean; verified: boolean }>)
                    : []

                  const email = profile.email || (emails.find((e) => e.primary) ?? emails[0])?.email
                  const emailVerified = emails.find((e) => e.email === email)?.verified ?? false

                  if (!email) return null

                  return {
                    user: {
                      id: String(profile.id),
                      name: profile.name || profile.login,
                      email,
                      image: profile.avatar_url,
                      emailVerified,
                    },
                    data: profile,
                  }
                }
              : undefined) as unknown as undefined,
          },
        },
        // Enable cross-subdomain cookies for libra.dev and subdomains
        ...(isDevelopment() ? {} : {
          advanced: {
            crossSubDomainCookies: {
              enabled: true,
              domain: '.tmidev.net',
            },
          },
          // Configure trusted origins for cross-subdomain authentication
          trustedOrigins: [
            'https://forge.tmidev.net',
            'https://cdn.forge.tmidev.net',
            'https://deploy.forge.tmidev.net',
            'https://dispatcher.forge.tmidev.net',
            'https://auth.forge.tmidev.net',
            // Development origins
            'http://localhost:3000',
            'http://localhost:3004',
            'http://localhost:3008',
            'http://localhost:3007',
          ],
        }),
        plugins: plugins ,
      }
    )
  )
}

let authInstance: Awaited<ReturnType<typeof authBuilder>> | null = null

// Initialize and get the shared auth instance
export async function initAuth() {
  if (!authInstance) {
    try {
      authInstance = await authBuilder()
    } catch (error) {
      log.auth(
        'error',
        'Failed to initialize auth instance',
        {
          operation: 'auth_init',
        },
        error as Error
      )
      throw error
    }
  }
  return authInstance
}

/* ======================================================================= */
/* Configuration for Schema Generation                                     */
/* Need to use this to generate schema                                     */
/* ======================================================================= */
export const auth = betterAuth({
  ...withCloudflare(
    {
      autoDetectIpAddress: true,
      geolocationTracking: true,
    },
    {
      // No runtime options needed for schema generation
      socialProviders: {
        github: {
          clientId: envs.BETTER_GITHUB_CLIENT_ID as string,
          clientSecret: envs.BETTER_GITHUB_CLIENT_SECRET as string,
        },
      },
      // Enable cross-subdomain cookies for libra.dev and subdomains
      ...(isDevelopment() ? {} : {
        advanced: {
          crossSubDomainCookies: {
            enabled: true,
            domain: '.tmidev.net',
          },
        },
      }),
      plugins: [
        admin({
          defaultRole: 'user',
          adminRoles: ['admin', 'superadmin'],
          adminUserIds: getAdminUserIds(), // Configured via ADMIN_USER_IDS environment variable
        }),
        organization(),
        emailOTP({
          async sendVerificationOTP() {},
        }),
        stripe({
          // stub stripe client for schema generation
          stripeClient: {} as any,
          stripeWebhookSecret: '',
          subscription: { enabled: true, plans: [] },
        }),
        emailHarmony(),
        bearer(),
      ],
    }
  ),
  database: drizzleAdapter(process.env['DATABASE'] as any, {
    provider: 'sqlite',
  }),
})
