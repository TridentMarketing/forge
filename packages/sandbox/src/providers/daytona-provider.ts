// Daytona disabled — TRA uses e2b only
export class DaytonaSandboxProvider {
  async initialize() { return this }
  async create() { throw new Error('Daytona not configured — use e2b') }
  async delete() { throw new Error('Daytona not configured — use e2b') }
  async list() { return [] }
  async get() { return null }
  async stop() {}
  async start() {}
}
export class DaytonaSandbox {
  async create() { throw new Error('Daytona not configured — use e2b') }
  async exec() { throw new Error('Daytona not configured — use e2b') }
  async close() {}
}
