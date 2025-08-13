import { describe, expect, it, vi } from 'vitest'
import { TypingGameSetting } from '~~/libs/TypingGameSetting'
import { TypingGameState } from '~~/libs/TypingGameState'
import type { ProblemDetail } from '~~/types/problems'

describe('TypingGameState', () => {
  const defaultProblem = (problem?: Partial<ProblemDetail>) =>
    ({
      id: 'id',
      title: 'title',
      type: 'japanese',
      words: [],
      tags: [],
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      ...problem,
    }) satisfies ProblemDetail

  const editState = (state: TypingGameState) => {
    state.tick = 1
    state.pausing = true
    state.canceled = true
    state.running = true
    state.timeUse = 2
    state.totalTypeCount = 3
    state.totalTypeCorrect = 4
    state.totalTypeMiss = 5
    state.currentTypingState = { detail: {}, mistake: true }
  }

  it('初期値が設定される', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)

    expect(state.setting).toBe(setting)
    expect(state.tick).toBe(0)
    expect(state.pausing).toBe(false)
    expect(state.canceled).toBe(false)
    expect(state.running).toBe(false)
    expect(state.timeLimit).toBe(0)
    expect(state.timeUse).toBe(0)
    expect(state.remainingTime).toBe(0)
    expect(state.goalCharCount).toBe(0)
    expect(state.totalTypeCount).toBe(0)
    expect(state.totalTypeCorrect).toBe(0)
    expect(state.totalTypeMiss).toBe(0)
    expect(state.currentTypingState).toEqual({ mistake: false })
    expect(state.problem).toBeUndefined()
    expect(state.currentWord).toBeUndefined()
    expect(state.totalCharCount).toBe(0)
    expect(state.hasNext).toBe(false)
  })

  it('settingの値で初期値が設定される', () => {
    const setting = TypingGameSetting.create()
    setting.timeLimit = 100
    setting.goalCharCount = 1000
    const state = TypingGameState.create(setting)

    expect(state.timeLimit).toBe(100)
    expect(state.goalCharCount).toBe(1000)
  })

  it('initで問題を設定できる', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const problem = defaultProblem({
      words: [{ word: 'aa', info: 'aa' }],
    })

    state.init({ problem })

    expect(state.problem).toBeTruthy()
    expect(state.problem?.id).toBe(problem.id)
    expect(state.totalCharCount).toBe(2)
    expect(state.currentWord).toBeTruthy()
    expect(state.hasNext).toBe(true)
  })

  it.each([
    [1, 0, 1],
    [2, 1, 1],
    [0, 1, 0],
  ])(
    'remainingTime (timeLimit=%d, timeUse=%d) => %d',
    (timeLimit, timeUse, expected) => {
      const setting = TypingGameSetting.create()
      setting.timeLimit = timeLimit
      const state = TypingGameState.create(setting)
      state.timeUse = timeUse
      expect(state.remainingTime).toBe(expected)
    },
  )

  it.each([
    [0, 0, false],
    [0, 1, false],
    [1, 0, false],
    [10, 1, false],
    [10, 2, false],
    [10, 9, false],
    [10, 10, true],
    [10, 11, true],
  ])(
    'isGoalReached (goalCharCount=%s, totalTypeCorrect=%s) => %s',
    (goalCharCount, totalTypeCorrect, expected) => {
      const setting = TypingGameSetting.create()
      setting.goalCharCount = goalCharCount
      const state = TypingGameState.create(setting)

      state.totalTypeCorrect = totalTypeCorrect

      expect(state.isGoalReached).toBe(expected)
    },
  )

  it.each([
    [false, false, false],
    [false, true, false],
    [true, false, false],
    [true, true, true],
  ])(
    'isPausing (running=%s, pausing=%s) => %s',
    (running, pausing, expected) => {
      const setting = TypingGameSetting.create()
      const state = TypingGameState.create(setting)

      state.running = running
      state.pausing = pausing

      expect(state.isPausing).toBe(expected)
    },
  )

  it.each([
    [false, false, false],
    [false, true, false],
    [true, true, false],
    [true, false, true],
  ])(
    'isRunning (running=%s, pausing=%s) => %s',
    (running, pausing, expected) => {
      const setting = TypingGameSetting.create()
      const state = TypingGameState.create(setting)

      state.running = running
      state.pausing = pausing

      expect(state.isRunning).toBe(expected)
    },
  )

  it('clearを実行すると状態が初期値にリセットされる', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)

    const initValue = { ...state }

    editState(state)
    expect(state).not.toEqual(initValue)

    state.clear()

    expect(state).toEqual(initValue)
  })

  it('resetを実行すると状態が初期値にリセットされる', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)

    const initValue = { ...state }

    editState(state)
    expect(state).not.toEqual(initValue)

    state.reset()

    expect(state).toEqual(initValue)
  })

  it('hasNextは問題のhasNextと同じ', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)

    state.init({ problem: defaultProblem() })

    const mock = vi.spyOn(state.problem!, 'hasNext', 'get')

    mock.mockReturnValue(false)
    expect(state.hasNext).toBe(false)

    mock.mockReturnValue(true)
    expect(state.hasNext).toBe(true)
  })

  it('resetを実行すると問題もresetされる', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)

    state.init({ problem: defaultProblem() })

    const fn = vi.spyOn(state.problem!, 'reset')

    state.reset()

    expect(fn).toBeCalledTimes(1)
  })

  it('continueを実行すると状態が初期値にリセットされる', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)

    const initValue = { ...state }

    editState(state)
    expect(state).not.toEqual(initValue)

    state.continue()

    expect(state).toEqual(initValue)
  })

  it('continueを実行すると問題もcontinueされる', () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)

    state.init({ problem: defaultProblem() })

    const fn = vi.spyOn(state.problem!, 'continue')

    state.continue()

    expect(fn).toBeCalledTimes(1)
  })
})
