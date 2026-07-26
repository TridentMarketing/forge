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

import { Button, type ButtonProps } from '@libra/ui/components/button'
import { Navbar as NavbarComponent, NavbarLeft, NavbarRight } from '@libra/ui/components/navbar'
import { cn } from '@libra/ui/lib/utils'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/components/common/logo/LogoImage'
import * as m from '@/paraglide/messages'

interface NavbarActionProps {
  text: string
  href: string
  variant?: ButtonProps['variant']
  icon?: ReactNode
  iconRight?: ReactNode
  isButton?: boolean
}

interface NavbarProps {
  name?: string
  homeUrl?: string
  actions?: NavbarActionProps[]
  className?: string
  isAuthenticated?: boolean
}

export default function Navbar({
  name = 'Forge',
  homeUrl = '/',
  actions,
  className,
  isAuthenticated = false,
}: NavbarProps) {
  const defaultActions: NavbarActionProps[] = isAuthenticated
    ? [
        {
          text: m['nav.dashboard'](),
          href: '/dashboard',
          isButton: true,
          variant: 'default' as const,
        },
      ]
    : [{ text: m['nav.login'](), href: '/login', isButton: false }]

  const finalActions = actions || defaultActions
  return (
    <header className={cn('sticky top-0 z-50 -mb-4 px-4 pb-4', className)}>
      <div className='fade-bottom bg-[var(--background-landing)]/15 absolute left-0 h-24 w-full backdrop-blur-lg' />
      <div className='max-w-container relative mx-auto'>
        <NavbarComponent>
          <NavbarLeft>
            <Link href={homeUrl}>
              <div className='flex items-center gap-2 justify-center rounded-xl'>
                <Logo />
                <span className='font-serif text-xl font-semibold text-primary'>{name}</span>
              </div>
            </Link>
          </NavbarLeft>
          <NavbarRight>
            {finalActions.map((action, index) =>
              action.isButton ? (
                <Button key={index} variant={action.variant || 'default'} asChild>
                  <Link href={action.href}>
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </Link>
                </Button>
              ) : (
                <Link key={index} href={action.href} className='text-sm'>
                  {action.text}
                </Link>
              )
            )}
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  )
}
