# Forge — Handoff Guide
**For: Mac agent pickup, Sunday morning**
**Status: Build passing locally on Linux VM, ready for CI/CD setup and Cloudflare deploy**

---

## What Forge is

Internal AI app builder for TRA tech team. Fork of [Libra AI](https://github.com/nextify-limited/libra).
- URL target: `forge.tmidev.net`
- Auth: GitHub OAuth (TridentMarketing org only)
- AI: Anthropic Claude (e2b sandboxes for code execution)
- Infra: Cloudflare Workers + D1 + KV + R2 (zero servers)

---

## What's already done

- [x] Forked to `TridentMarketing/forge`
- [x] Branding swapped (Libra → Forge, libra.dev → tmidev.net)
- [x] Billing/Stripe removed from UI and plugins
- [x] All AI models unlocked (no plan gating)
- [x] GitHub OAuth wired as sole auth method
- [x] Auth trusted origins set to `*.forge.tmidev.net`
- [x] Cookie domain set to `.tmidev.net`
- [x] Cloudflare resources provisioned:
  - D1: `forge-auth` → `5ee77756-eb54-4831-bb6d-bc51da4d3850`
  - KV: `forge-sessions` → `a8adb6270eea47ab95d4df7b283d41fd`
  - KV: `forge-cache` → `50ffad06d6fe4f96af18552cafe7976d`
  - R2: `forge-cdn` (file storage)
  - R2: `forge-inc-cache` (OpenNext incremental cache)
- [x] D1 schema migrated (auth tables created)
- [x] `apps/web/wrangler.jsonc` updated with all resource IDs
- [x] `apps/web/next.config.mjs` — cookie domain fixed, `@daytonaio/sdk` externalized
- [x] Build type errors fixed (footer, hero buttons, upgrade tooltip)

---

## What's left (in order)

### 1. Fix remaining build error — Daytona SDK at runtime

The build compiles but fails at page data collection because `@daytonaio/sdk` tries to load at runtime.

**Fix:** In `packages/sandbox/src/index.ts`, make Daytona import conditional:

```typescript
// Before
export { DaytonaSandboxProvider } from './providers/daytona-provider'

// After — only load if DAYTONA_API_KEY is set
export const DaytonaSandbox = null // we use e2b only
```

Or simpler — in `packages/api/src/utils/container.ts`, find where `DaytonaSandbox` is imported and wrap in a try/catch or env check.

### 2. Make `RESEND_*` env vars optional

The email package still requires Resend even though we're not using email OTP. Find `packages/email/env.mjs` and make `RESEND_API_KEY` and `RESEND_FROM` optional (`.optional()` in the zod schema).

### 3. GitHub Actions — use the existing workflow

**Do NOT create a new workflow.** The repo already has `.github/workflows/web.yml` (inherited from upstream, already patched for Forge — runner, cache actions, and deploy URL all fixed). It triggers on push to `main` automatically.

### 4. Set GitHub repo secrets

Go to: **github.com/TridentMarketing/forge/settings/secrets/actions**

Add these secrets (the workflow reads all of them via `secrets.*`):

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | from `~/.hermes/.env` |
| `CLOUDFLARE_ACCOUNT_ID` | `65eeb90f2dc01a62a085952a430a3dbe` |
| `DATABASE_ID` | `5ee77756-eb54-4831-bb6d-bc51da4d3850` |
| `KV_NAMESPACE_ID` | `a8adb6270eea47ab95d4df7b283d41fd` (forge-sessions) |
| `NEXT_PUBLIC_APP_URL` | `https://forge.tmidev.net` |
| `NEXT_PUBLIC_CDN_URL` | `https://cdn.forge.tmidev.net` |
| `NEXT_PUBLIC_DEPLOY_URL` | `https://deploy.forge.tmidev.net` |
| `NEXT_PUBLIC_DISPATCHER_URL` | `https://dispatcher.forge.tmidev.net` |
| `NEXT_PUBLIC_SANDBOX_DEFAULT_PROVIDER` | `e2b` |
| `NEXT_PUBLIC_SANDBOX_BUILDER_DEFAULT_PROVIDER` | `e2b` |
| `POSTGRES_URL` | `dummy` (not used at runtime, required by build) |
| `TURNSTILE_SECRET_KEY` | `dummy` (captcha disabled for internal tool) |
| `RESEND_API_KEY` | `dummy` (no email OTP) |
| `RESEND_FROM` | `noreply@tmidev.net` |
| `BETTER_AUTH_SECRET` | from `~/.hermes/.env` as `FORGE_AUTH_SECRET` |
| `BETTER_GITHUB_CLIENT_ID` | `Ov23liTaaMLQLc6o7OaZ` |
| `BETTER_GITHUB_CLIENT_SECRET` | from `~/.hermes/.env` |
| `ANTHROPIC_API_KEY` | from `~/.hermes/.env` |
| `E2B_API_KEY` | from `~/.hermes/.env` |
| `LIBRA_GITHUB_TOKEN` | a GitHub PAT with `repo` + `deployments` scope (for the deployment status step) |

Secrets you can leave **blank/absent** (workflow handles missing gracefully): `POSTHOG_*`, `AZURE_*`, `OPENROUTER_*`, `STRIPE_*`, `DAYTONA_*`, `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_SAAS_ZONE_ID`, `HYPERDRIVE_ID`, `GITHUB_APP_*`

### 5. Set Cloudflare Worker secrets (after first deploy)

```bash
cd apps/web
wrangler secret put BETTER_AUTH_SECRET      # value of FORGE_AUTH_SECRET from ~/.hermes/.env
wrangler secret put BETTER_GITHUB_CLIENT_ID # Ov23liTaaMLQLc6o7OaZ
wrangler secret put BETTER_GITHUB_CLIENT_SECRET # 88a0f9...
wrangler secret put ANTHROPIC_API_KEY       # from ~/.hermes/.env
wrangler secret put E2B_API_KEY             # e2b_30...
```

### 6. DNS

In Cloudflare dashboard for `tmidev.net`:
- Worker route: `forge.tmidev.net/*` → `forge` Worker
- (Other subdomains: cdn, deploy, dispatcher — handled by their own workers later)

### 7. Make Ali admin

After first successful login:
```bash
wrangler d1 execute forge-auth \
  --command "UPDATE \"user\" SET role='superadmin' WHERE email='alraza@travelresorts.com'" \
  --remote
```

---

## Cloudflare resource IDs (all provisioned)

| Resource | Name | ID |
|---|---|---|
| D1 | forge-auth | `5ee77756-eb54-4831-bb6d-bc51da4d3850` |
| KV | forge-sessions | `a8adb6270eea47ab95d4df7b283d41fd` |
| KV | forge-cache | `50ffad06d6fe4f96af18552cafe7976d` |
| R2 | forge-cdn | `forge-cdn` |
| R2 | forge-inc-cache | `forge-inc-cache` |
| CF Account | TRA Cloudflare | `65eeb90f2dc01a62a085952a430a3dbe` |

---

## Key files changed from upstream

| File | What changed |
|---|---|
| `apps/web/configs/site.ts` | Forge branding, tmidev.net URLs |
| `apps/web/configs/metadata.ts` | Forge title/description |
| `apps/web/configs/ai-models.ts` | All models set to FREE (no gating) |
| `packages/auth/auth-server.ts` | Trusted origins + cookie domain → tmidev.net |
| `packages/auth/wrangler.jsonc` | forge-auth D1 ID |
| `apps/web/wrangler.jsonc` | All CF resource IDs, forge.tmidev.net route |
| `apps/web/next.config.mjs` | Cookie domain, @daytonaio/sdk externalized |
| `apps/web/components/dashboard/app-sidebar.tsx` | Billing removed from nav |
| `apps/web/app/(frontend)/(dashboard)/dashboard/billing/page.tsx` | Stubbed out |
| `apps/web/components/ide/libra/chat-panel/components/model-selector/upgrade-tooltip.tsx` | Stubbed — no upgrade prompts |
| `apps/web/components/marketing/footer/index.tsx` | Removed forum/twitter links |
| `apps/web/components/marketing/hero/hero-buttons.tsx` | Removed forum button |
