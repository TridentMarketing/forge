/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * fonts.ts
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

import { EB_Garamond, Inter } from 'next/font/google'

export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans-app',
  display: 'swap',
})

// Brand serif — reserved for the Forge wordmark, login, and large empty states
export const serif = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif-brand',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})
