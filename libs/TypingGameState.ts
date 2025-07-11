import type { ProblemDetail } from '~~/types/problems'
import type { TypingEventDetail } from './EventManager'
import type { TypingGameSetting } from './TypingGameSetting'
import { TypingProblemQuestioner } from './TypingProblemQuestioner'

class TypingGameStateValue {
  tick = 0
  pausing = false
  canceled = false
  running = false
  timeLimit = 0
  timeUse = 0
  goalCharCount = 0
  totalTypeCount = 0
  totalTypeCorrect = 0
  totalTypeMiss = 0
  currentTypingState: {
    detail?: TypingEventDetail
    mistake: boolean
  } = { mistake: false }
}

export class TypingGameState extends TypingGameStateValue {
  private constructor(
    public readonly setting: TypingGameSetting,
    public problem?: TypingProblemQuestioner,
  ) {
    super()
    this.clear()
  }

  get current() {
    return this.problem?.current
  }

  get totalCharCount() {
    return this.problem?.totalCharCount
  }

  get isPausing() {
    return this.running && this.pausing
  }

  get isRunning() {
    return this.running && !this.pausing
  }

  clear() {
    Object.assign(this, new TypingGameStateValue())
    this.timeLimit = this.setting.timeLimit ?? 0
    this.goalCharCount = this.setting.goalCharCount ?? 0
  }

  reset() {
    this.clear()
    this.problem?.reset()
  }

  continue() {
    this.clear()
    this.problem?.continue()
  }

  init({ problem }: { problem: ProblemDetail }) {
    this.clear()
    this.problem = TypingProblemQuestioner.create(problem, this.setting)
  }

  static create(setting: TypingGameSetting): TypingGameState {
    return new TypingGameState(setting)
  }
}
