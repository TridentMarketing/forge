/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * providers/daytona-provider.ts
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

// Daytona is disabled — TRA (Forge) uses e2b exclusively. This stub keeps the
// factory's provider registry type-safe without pulling in `@daytonaio/sdk`,
// which is not configured and would otherwise be bundled/loaded at runtime.

import { BaseSandboxProvider, type ISandbox } from '../interfaces/sandbox-provider'
import type {
  ProviderConfig,
  SandboxCleanupResult,
  SandboxConfig,
  SandboxConnectOptions,
  SandboxInfo,
  SandboxTerminationOptions,
} from '../types'

const DISABLED_MESSAGE = 'Daytona is not configured for this deployment — use e2b instead'

export class DaytonaSandbox implements ISandbox {
  readonly id = 'daytona-disabled'
  readonly providerType = 'daytona'

  getInfo(): Promise<SandboxInfo> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  executeCommand(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  writeFile(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  writeFiles(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  readFile(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  listFiles(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  deleteFile(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  fileExists(): Promise<boolean> {
    return Promise.resolve(false)
  }
  getFileInfo(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  setEnvironmentVariables(): Promise<void> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  getEnvironmentVariables(): Promise<Record<string, string>> {
    return Promise.resolve({})
  }
  terminate(): Promise<SandboxCleanupResult> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  keepAlive(): Promise<void> {
    return Promise.resolve()
  }
  getHost(): string {
    throw new Error(DISABLED_MESSAGE)
  }
  getPreviewInfo(): Promise<never> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  getNativeInstance(): null {
    return null
  }
}

export class DaytonaSandboxProvider extends BaseSandboxProvider {
  readonly providerType = 'daytona'

  protected doInitialize(_config: ProviderConfig): Promise<void> {
    return Promise.resolve()
  }
  create(_config: SandboxConfig): Promise<ISandbox> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  connect(_sandboxId: string, _options?: SandboxConnectOptions): Promise<ISandbox> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  resume(_sandboxId: string, _options?: SandboxConnectOptions): Promise<ISandbox> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  list(): Promise<SandboxInfo[]> {
    return Promise.resolve([])
  }
  terminate(
    _sandboxId: string,
    _options?: SandboxTerminationOptions
  ): Promise<SandboxCleanupResult> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  getInfo(_sandboxId: string): Promise<SandboxInfo> {
    return Promise.reject(new Error(DISABLED_MESSAGE))
  }
  isAvailable(): Promise<boolean> {
    return Promise.resolve(false)
  }
}
