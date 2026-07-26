/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * index.tsx
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

import { cn } from '@libra/ui/lib/utils'
import { Logo } from '@/components/common/logo/LogoImage'
import { Footer, FooterBottom } from '@/components/ui/footer'
import { siteConfig } from '@/configs/site'
import * as m from '@/paraglide/messages'

interface FooterLink {
  text: string
  href: string
  id: string
}

interface FooterProps {
  name?: string
  copyright?: string
  policies?: FooterLink[]
  className?: string
}

export default function FooterSection({
  name = 'Forge',
  copyright = m['footer.copyright'](),
  policies = [
    { id: 'privacy', text: m['footer.privacy'](), href: '/privacy' },
    { id: 'terms', text: m['footer.terms'](), href: '/terms' },
  ],
  className,
}: FooterProps) {
  return (
    <footer className={cn('w-full px-4 sm:px-6 lg:px-8', className)}>
      <div className='max-w-container mx-auto'>
        <Footer>
          <FooterBottom>
            <div className='flex items-center gap-2'>
              <Logo />
              <span className='font-serif font-semibold'>{name}</span>
              <span className='text-muted-foreground'>{copyright}</span>
            </div>
            <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
              <a href={siteConfig.links.github}>GitHub</a>
              <a href={siteConfig.links.email}>{m['footer.contact']()}</a>
              {policies.map((policy) => (
                <a key={policy.id} href={policy.href}>
                  {policy.text}
                </a>
              ))}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  )
}
