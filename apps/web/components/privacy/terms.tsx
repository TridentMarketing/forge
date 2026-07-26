/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * terms.tsx
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
 * Internal-use notice for Forge.
 */
export default function TermsPage() {
  return (
    <main className='mx-auto max-w-2xl px-4 py-16'>
      <h1 className='font-serif text-3xl text-primary mb-2'>Internal use</h1>
      <p className='text-sm text-muted-foreground mb-8'>
        Forge is an internal tool operated by Travel Resorts of America. Access is limited to TRA
        employees and contractors with a company GitHub account.
      </p>

      <div className='space-y-6 text-sm leading-relaxed'>
        <section>
          <h2 className='font-semibold mb-1'>Ownership</h2>
          <p>
            Projects, prompts, and generated code created in Forge are TRA work product and belong
            to Travel Resorts of America.
          </p>
        </section>

        <section>
          <h2 className='font-semibold mb-1'>Acceptable use</h2>
          <p>
            Use Forge for TRA work. Company IT and security policies apply here the same as in any
            other internal system.
          </p>
        </section>

        <section>
          <h2 className='font-semibold mb-1'>Availability</h2>
          <p>
            Forge is provided as-is by the TRA tech team. It may change or be unavailable without
            notice; report problems to{' '}
            <Link href='mailto:tech@travelresorts.com' className='text-primary underline'>
              tech@travelresorts.com
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className='font-semibold mb-1'>Open source</h2>
          <p>
            Forge is built on the AGPL-3.0-licensed Libra project by Nextify Limited. Source
            attribution is preserved in the codebase.
          </p>
        </section>
      </div>
    </main>
  )
}
