import type { KeyLayoutName } from './Keys'

export abstract class GameSetting {
  abstract timeLimit: number
  abstract autoMode: number
  abstract problemOrder: 'first' | 'last' | 'random'
  abstract goalCharCount: number
  abstract problemId: string
  abstract keyLayout: KeyLayoutName

  static create(): GameSetting {
    return {
      autoMode: 0,
      goalCharCount: 0,
      problemId: '',
      problemOrder: 'first',
      timeLimit: 0,
      keyLayout: 'JIS',
    }
  }
}
