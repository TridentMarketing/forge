/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * privacy.tsx
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

import Link from 'next/link'

/**
 * Internal data-handling notice for Forge.
 */
export default function PrivacyPage() {
  return (
    <main className='mx-auto max-w-2xl px-4 py-16'>
      <h1 className='font-serif text-3xl text-primary mb-2'>Data handling</h1>
      <p className='text-sm text-muted-foreground mb-8'>
        Forge is an internal tool operated by Travel Resorts of America for its employees and
        contractors.
      </p>

      <div className='space-y-6 text-sm leading-relaxed'>
        <section>
          <h2 className='font-semibold mb-1'>What is stored</h2>
          <p>
            Forge stores your name, work email, and GitHub identity from sign-in, plus the projects,
            prompts, and files you create in the tool. Prompts and project files are sent to
            third-party AI providers to generate code.
          </p>
        </section>

        <section>
          <h2 className='font-semibold mb-1'>Usage telemetry</h2>
          <p>
            Basic product usage is collected to understand how the tool is used and to debug
            problems. It is visible only to the TRA tech team.
          </p>
        </section>

        <section>
          <h2 className='font-semibold mb-1'>Company data</h2>
          <p>
            Treat Forge like any other internal system: don't paste secrets, credentials, or
            regulated customer data into prompts or project files.
          </p>
        </section>

        <section>
          <h2 className='font-semibold mb-1'>Questions</h2>
          <p>
            Contact{' '}
            <Link href='mailto:tech@travelresorts.com' className='text-primary underline'>
              tech@travelresorts.com
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
