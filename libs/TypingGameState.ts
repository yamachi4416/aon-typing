import type { ProblemDetail } from '~~/types/problems'
import type { TypingEventDetail } from './EventManager'
import type { TypingGameSetting } from './TypingGameSetting'
import { TypingProblemQuestioner } from './TypingProblemQuestioner'

class TypingGameStateValue {
  tick = 0
  pausing = false
  canceled = false
  running = false
  timeUse = 0
  totalTypeCount = 0
  totalTypeCorrect = 0
  totalTypeMiss = 0
  currentTypingState: {
    detail?: TypingEventDetail
    mistake: boolean
  } = { mistake: false }
}

export class TypingGameState extends TypingGameStateValue {
  public readonly goalCharCount: number
  public readonly timeLimit: number

  private constructor(
    public readonly setting: Readonly<TypingGameSetting>,
    public problem?: TypingProblemQuestioner,
  ) {
    super()
    this.clear()
    this.timeLimit = setting.timeLimit
    this.goalCharCount = setting.goalCharCount
  }

  get current() {
    return this.problem?.current
  }

  get totalCharCount() {
    return this.problem?.totalCharCount ?? 0
  }

  get isGoalReached() {
    return this.goalCharCount > 0 && this.totalTypeCorrect >= this.goalCharCount
  }

  get isPausing() {
    return this.running && this.pausing
  }

  get isRunning() {
    return this.running && !this.pausing
  }

  clear() {
    Object.assign(this, new TypingGameStateValue())
  }

  reset() {
    this.clear()
    this.problem?.reset()
  }

  continue() {
    this.clear()
    this.problem?.continue()
  }

  init({ problem }: { problem: Readonly<ProblemDetail> }) {
    this.clear()
    this.problem = TypingProblemQuestioner.create(problem, this.setting)
  }

  static create(setting: TypingGameSetting): TypingGameState {
    return new TypingGameState(setting)
  }
}
