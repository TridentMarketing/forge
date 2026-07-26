/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * LoginForm.tsx
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

'use client'

import { Button } from '@libra/ui/components/button'
import Image from 'next/image'
import * as m from '@/paraglide/messages'
import { useAuthForm } from './hooks/useAuthForm'

/**
 * Sign-in card — Forge is internal-only and uses GitHub OAuth exclusively.
 */
export default function LoginForm() {
  const { isGitHubLoading, errorMessage, handleGitHubLogin } = useAuthForm()

  return (
    <div className='flex justify-center items-center min-h-screen bg-background-landing p-4 sm:p-6 lg:p-8'>
      <div className='w-full max-w-sm sm:max-w-md'>
        <div className='rounded-lg border border-border bg-card text-card-foreground shadow-xl'>
          <div className='flex flex-col items-center gap-4 px-6 pt-8 pb-2 text-center'>
            <Image
              src='/tra-lockup.webp'
              alt='Travel Resorts of America'
              width={320}
              height={87}
              priority
              className='w-64 sm:w-72 h-auto'
            />
            <h1 className='font-serif text-3xl text-primary'>Forge</h1>
            <p className='text-sm text-muted-foreground'>{m['auth.email_form.subtitle']()}</p>
          </div>

          <div className='flex flex-col gap-3 p-6'>
            <Button
              variant='default'
              size='lg'
              type='button'
              onClick={handleGitHubLogin}
              disabled={isGitHubLoading}
              className='w-full flex items-center justify-center gap-2.5 font-medium'
            >
              {isGitHubLoading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent' />
                  <span className='text-sm'>{m['auth.email_form.connecting']()}</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    className='h-4 w-4 fill-current'
                    aria-hidden='true'
                  >
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                  </svg>
                  <span className='text-sm font-medium'>
                    {m['auth.email_form.github_button']()}
                  </span>
                </>
              )}
            </Button>

            {errorMessage && (
              <div
                className='p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md'
                role='alert'
                aria-live='assertive'
              >
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
