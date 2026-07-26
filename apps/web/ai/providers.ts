/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * providers.ts
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

import { anthropic } from '@ai-sdk/anthropic'
import { xai } from '@ai-sdk/xai'
import { customProvider } from 'ai'

/**
 * Forge is Anthropic-only: every chat model slot calls Claude directly via
 * ANTHROPIC_API_KEY, rather than routing through Azure OpenAI or OpenRouter
 * (neither of which have credentials configured for this deployment). Model
 * IDs use the alias form (e.g. 'claude-sonnet-5') rather than dated snapshots.
 */
export const myProvider = customProvider({
  languageModels: {
    // All model slots resolve to direct Anthropic calls for Forge.
    'chat-model-reasoning-azure': anthropic('claude-sonnet-5'),
    'chat-model-reasoning-azure-mini': anthropic('claude-sonnet-5'),
    'chat-model-reasoning-azure-nano': anthropic('claude-sonnet-5'),
    'chat-model-databricks-claude': anthropic('claude-sonnet-5'),
    'chat-model-reasoning-anthropic': anthropic('claude-sonnet-5'),
    'chat-model-reasoning-google': anthropic('claude-sonnet-5'),

    // XAI models (kept for compatibility)
    'chat-model-reasoning-xai': xai('grok-3-fast-beta'),
  },
  imageModels: {
    'small-model-xai': xai.image('grok-2-image'),
  },
})
