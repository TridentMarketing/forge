/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * AuthForm.tsx
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

import { ThemeSwitcher } from '@/components/common/theme-switcher'
import LoginForm from './LoginForm'

/**
 * Authentication page — single centered sign-in card
 */
export default function AuthForm() {
  return (
    <div className='w-full min-h-screen relative'>
      {/* Theme switcher positioned in top-right corner */}
      <div className='absolute top-3 right-3 sm:top-4 sm:right-4 z-50'>
        <ThemeSwitcher />
      </div>

      <LoginForm />
    </div>
  )
}
