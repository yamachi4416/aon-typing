import { afterEach } from 'node:test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TimerManager } from '~~/libs/TimerManager'
import { TypingGame } from '~~/libs/TypingGame'
import { TypingGameSetting } from '~~/libs/TypingGameSetting'
import { TypingGameState } from '~~/libs/TypingGameState'
import type { ProblemDetail } from '~~/types/problems'

describe('TypingGame', () => {
  const toProblem = (problem?: Partial<ProblemDetail>) =>
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

  const dispatchKeydownEvent = (
    key: string,
    options: Omit<KeyboardEventInit, 'key'> = {},
  ) => window.dispatchEvent(new KeyboardEvent('keydown', { key, ...options }))

  beforeEach(() => {
    vi.resetAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('問題が設定されていない', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    const info = await game.start()

    expect(info).toBeUndefined()
  })

  it('currentWordが設定されていない', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    const problem = toProblem({ words: [{ word: '12345' }] })

    state.init({ problem })

    const promise = game.start()

    state.nextWord()
    await vi.advanceTimersByTimeAsync(1000)
    dispatchKeydownEvent('1')
    await vi.advanceTimersToNextTimerAsync()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(1000)
    expect(info?.totalTypeCount).toBe(0)
  })

  it('最後までタイピング', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    const problem = toProblem({
      words: [{ word: '12345' }, { word: '67890' }],
    })

    state.init({ problem })

    const promise = game.start()

    for (const key of [...'12345', ...'67890']) {
      await vi.advanceTimersByTimeAsync(1000)
      dispatchKeydownEvent(key)
    }
    await vi.advanceTimersToNextTimerAsync()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(10000)
    expect(info?.totalTypeCount).toBe(10)
  })

  it('最後までタイピング（ミスあり）', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    const problem = toProblem({
      words: [{ word: '12345' }, { word: '67890' }],
    })

    state.init({ problem })

    const promise = game.start()

    for (const key of [...'12345', ...['0', 'Enter', 'Tab'], ...'67890']) {
      await vi.advanceTimersByTimeAsync(1000)
      dispatchKeydownEvent(key)
    }
    await vi.advanceTimersToNextTimerAsync()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(13000)
    expect(info?.totalTypeCount).toBe(13)
  })

  it('キーを押しっぱなしはカウントされない', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    const problem = toProblem({ words: [{ word: '123' }] })

    state.init({ problem })

    const promise = game.start()

    await vi.advanceTimersByTimeAsync(1000)
    dispatchKeydownEvent('1')

    await vi.advanceTimersByTimeAsync(1000)
    dispatchKeydownEvent('1', { repeat: true })

    await vi.advanceTimersByTimeAsync(1000)
    dispatchKeydownEvent('2')

    await vi.advanceTimersByTimeAsync(1000)
    dispatchKeydownEvent('3')

    await vi.advanceTimersToNextTimerAsync()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(4000)
    expect(info?.totalTypeCount).toBe(3)
  })

  it("'CapsLock', 'Shift', '' はカウントされない", async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    const problem = toProblem({ words: [{ word: '1' }] })

    state.init({ problem })

    const promise = game.start()

    for (const key of ['CapsLock', 'Shift', '', '1']) {
      await vi.advanceTimersByTimeAsync(1000)
      dispatchKeydownEvent(key)
    }
    await vi.advanceTimersToNextTimerAsync()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(4000)
    expect(info?.totalTypeCount).toBe(1)
  })

  it('目標タイプ数を設定してタイピング', async () => {
    const setting = TypingGameSetting.create()
    setting.goalCharCount = 10
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    state.init({ problem: toProblem({ words: [{ word: '1'.repeat(100) }] }) })

    const promise = game.start()

    for (const key of [...'1'.repeat(20)]) {
      await vi.advanceTimersByTimeAsync(1000)
      dispatchKeydownEvent(key)
    }
    await vi.advanceTimersToNextTimerAsync()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(10000)
    expect(info?.totalTypeCount).toBe(10)
  })

  it('制限時間を設定してタイピング', async () => {
    const setting = TypingGameSetting.create()
    setting.timeLimit = 10000
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    state.init({ problem: toProblem({ words: [{ word: '1'.repeat(100) }] }) })

    const promise = game.start()

    for (const key of [...'1'.repeat(20)]) {
      await vi.advanceTimersByTimeAsync(1000)
      dispatchKeydownEvent(key)
    }
    await vi.advanceTimersToNextTimerAsync()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(10000)
    expect(info?.totalTypeCount).toBe(10)
  })

  it('一時停止と再開ができる（toggle）', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    state.init({ problem: toProblem({ words: [{ word: '1'.repeat(20) }] }) })

    const typing = async () => {
      for (const key of [...'1'.repeat(10)]) {
        await vi.advanceTimersByTimeAsync(1000)
        dispatchKeydownEvent(key)
      }
    }

    const promise = game.start()

    await typing()
    game.toggle()

    await typing()
    game.toggle()

    await typing()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(20000)
    expect(info?.totalTypeCount).toBe(20)
  })

  it('一時停止と再開は効果がない場合がfalse', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    state.init({ problem: toProblem({ words: [{ word: '1'.repeat(20) }] }) })

    const typing = async () => {
      for (const key of [...'1'.repeat(10)]) {
        await vi.advanceTimersByTimeAsync(1000)
        dispatchKeydownEvent(key)
      }
    }

    const promise = game.start()

    await typing()
    expect(game.pause()).toBe(true)
    expect(game.pause()).toBe(false)

    await typing()
    expect(game.resume()).toBe(true)
    expect(game.resume()).toBe(false)

    await typing()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(20000)
    expect(info?.totalTypeCount).toBe(20)
  })

  it('disposeすると処理が終了しタイマーとイベントが解除される', async () => {
    const setting = TypingGameSetting.create()
    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    state.init({ problem: toProblem({ words: [{ word: '1'.repeat(20) }] }) })

    const typing = async () => {
      for (const key of [...'1'.repeat(10)]) {
        await vi.advanceTimersByTimeAsync(1000)
        dispatchKeydownEvent(key)
      }
    }

    const promise = game.start()

    await typing()
    game.dispose()
    await typing()

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(10000)
    expect(info?.totalTypeCount).toBe(10)
  })

  it('オートモード', async () => {
    const setting = TypingGameSetting.create()
    setting.autoMode = 10

    const state = TypingGameState.create(setting)
    const timerManager = TimerManager.create(10)
    const game = TypingGame.create({ state, setting, timerManager })

    state.init({ problem: toProblem({ words: [{ word: '1'.repeat(10) }] }) })

    const promise = game.start()

    await vi.advanceTimersByTimeAsync(100)

    const info = await promise
    expect(info).toBeDefined()
    expect(info?.time).toBe(100)
    expect(info?.totalTypeCount).toBe(10)
  })
})
