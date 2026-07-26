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

'use client'

import { Section } from '@libra/ui/components/section'
import { cn } from '@libra/ui/lib/utils'
import { AppDescriptionForm } from './app-description-form'
import { HeroHeader } from './hero-header'
import type { HeroProps } from './types'

/**
 * Prompt-to-build entry — the core of the Forge home page
 */
export default function Hero({ title, description, className }: HeroProps) {
  return (
    <Section className={cn('overflow-hidden pb-0 sm:pb-0 md:pb-0', className)}>
      <div className='max-w-container mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16'>
        <div className='flex flex-col items-center gap-3 text-center sm:gap-4 md:gap-5'>
          <HeroHeader title={title} description={description} />
          <AppDescriptionForm />
        </div>
      </div>
    </Section>
  )
}
