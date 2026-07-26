/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * hero-header.tsx
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

import * as m from '@/paraglide/messages'

interface HeroHeaderProps {
  title?: string
  description?: string
}

/**
 * Hero header — Forge prompt-entry heading
 */
export const HeroHeader = ({ title, description }: HeroHeaderProps) => {
  return (
    <>
      <h1 className='animate-appear font-serif relative z-10 text-4xl leading-tight text-balance sm:text-5xl md:text-6xl sm:leading-tight md:leading-tight'>
        {title || m['hero.title']()}
      </h1>
      <p className='text-md animate-appear text-muted-foreground relative z-10 max-w-full sm:max-w-[600px] md:max-w-[700px] px-2 sm:px-0 text-balance opacity-0 delay-100 sm:text-lg'>
        {description || m['hero.subtitle']()}
      </p>
    </>
  )
}
