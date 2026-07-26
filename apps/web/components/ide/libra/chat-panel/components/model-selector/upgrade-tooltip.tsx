// Forge internal — no plan upgrades, tooltip is a passthrough
import React from 'react'
import type { AIModel } from '@/configs/ai-models'

export function UpgradeTooltip({ children }: { children: React.ReactNode; model?: AIModel }) {
  return <>{children}</>
}
