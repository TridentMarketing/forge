/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * page.tsx
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

import { initAuth } from '@libra/auth/auth-server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Footer from '@/components/marketing/footer'
import Hero from '@/components/marketing/hero/index'
import Navbar from '@/components/marketing/nav'

export default async function Home() {
  // Forge is internal-only: the root route is the prompt-to-build entry
  // for signed-in users; everyone else goes to sign-in.
  let isAuthenticated = false
  try {
    const auth = await initAuth()
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList,
    })
    isAuthenticated = !!session?.user
  } catch {
    isAuthenticated = false
  }

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <main className='flex min-h-screen w-full flex-col bg-[var(--background-landing)] text-[var(--foreground-landing)]'>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className='flex-1'>
        <Hero />
      </div>
      <Footer />
    </main>
  )
}
