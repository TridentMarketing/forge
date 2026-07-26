/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * usage-display.tsx
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

import { Card, CardContent } from '@libra/ui/components/card'
import { Progress } from '@libra/ui/components/progress'
import { cn } from '@libra/ui/lib/utils'
import { AlertTriangle } from 'lucide-react'
import * as m from '@/paraglide/messages'
import type { ExtendedUserData, UsageInfo } from './utils'

interface UsageDisplayProps {
  usageInfo: UsageInfo
  userData: ExtendedUserData
  usageData: any
  isUsageLoading: boolean
  onUpgrade?: () => void
}

export function UsageDisplay({ usageInfo, isUsageLoading }: UsageDisplayProps) {
  return (
    <div className='p-4'>
      <Card className='border-0 shadow-none glass-2'>
        <CardContent className='p-4 space-y-3'>
          {/* AI usage status */}
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-foreground'>
              {m['common.user_menu.ai_usage']()}
            </span>
            <div className='text-right'>
              <div
                className={cn(
                  'text-sm font-semibold',
                  usageInfo.usagePercentage > 90 ? 'text-destructive' : 'text-primary'
                )}
              >
                {isUsageLoading
                  ? m['common.user_menu.loading']()
                  : `${usageInfo.currentUsage}/${usageInfo.totalLimit}`}
              </div>
              <div className='text-xs text-muted-foreground'>
                {m['common.user_menu.remaining']({ count: usageInfo.remainingUsage || 0 })}
              </div>
            </div>
          </div>

          <Progress
            value={usageInfo.usagePercentage}
            className={cn(
              'h-2',
              usageInfo.usagePercentage > 90
                ? '[&>div]:bg-destructive'
                : usageInfo.usagePercentage > 75
                  ? '[&>div]:bg-brand'
                  : '[&>div]:bg-primary'
            )}
          />

          {/* Usage status alerts */}
          {usageInfo.usagePercentage > 90 && (
            <div className='flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20'>
              <AlertTriangle className='h-3 w-3 text-destructive shrink-0' />
              <span className='text-xs text-destructive font-medium'>
                {m['userButton.usageDisplay.usageAlmostExhausted']()}
              </span>
            </div>
          )}
          {usageInfo.usagePercentage > 75 && usageInfo.usagePercentage <= 90 && (
            <div className='flex items-center gap-2 p-3 rounded-md bg-brand/10 border border-brand/20'>
              <AlertTriangle className='h-3 w-3 text-brand-foreground shrink-0' />
              <span className='text-xs text-brand-foreground font-medium'>
                {m['userButton.usageDisplay.usageHigh']()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
