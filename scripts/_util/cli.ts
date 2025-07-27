import {
  defineCommand as _defineCommand,
  runMain as _runMain,
  type Resolvable,
} from 'citty'
import fs from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'
import { isFunction } from '~~/libs/Util'

async function applyCommandConfig(args: string[], insertPos: number) {
  const index = args.indexOf('--config')
  if (index === -1) return

  const [_, file] = args.splice(index, 2)
  if (!file) return

  const configArgs = Object.entries(
    JSON.parse(await fs.readFile(file, { flag: 'r', encoding: 'utf8' })),
  ).map(([key, value]) => `--${key}=${value}`)

  args.splice(insertPos, 0, ...configArgs)
}

async function resolveValue<T>(value: Resolvable<T>): Promise<T> {
  return isFunction(value) ? value() : value
}

export const defineCommand: typeof _defineCommand = (command) =>
  _defineCommand({
    ...command,
    async args() {
      const args = await resolveValue(command.args!)
      return {
        ...args,
        config: {
          type: 'string',
          description: 'specific config file',
          required: false,
        },
      }
    },
    async subCommands() {
      const subCommands = await resolveValue(command.subCommands)
      if (!subCommands) return {}
      const keys = new Map(
        Object.keys(subCommands).map((key) => [key.toLowerCase(), key]),
      )
      return new Proxy(subCommands, {
        get(target, prop: string) {
          const key = keys.get(prop.replaceAll('-', '').toLowerCase())
          return key ? target[key] : undefined
        },
      })
    },
  })

export const runMain: typeof _runMain = async (cmd, opts = {}) => {
  const rawArgs = opts.rawArgs || process.argv.slice(2)
  await applyCommandConfig(rawArgs, cmd.subCommands ? 1 : 0)
  return await _runMain(cmd, { ...opts, rawArgs })
}

export async function prompt(message: string) {
  const readline = createInterface(process.stdin, process.stdout)
  try {
    return await readline.question(message)
  } finally {
    readline.close()
  }
}

export async function confirm(
  message: string,
  maxAttempts: number = Number.MAX_VALUE,
  defaultValue: boolean = false,
) {
  for (let i = 0; i < maxAttempts; i++) {
    const input = await prompt(message)
    const answer = input.trim().toLowerCase()
    if (answer === 'y') return true
    if (answer === 'n') return false
  }
  return defaultValue
}
