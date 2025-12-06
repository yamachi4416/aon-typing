import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ComponentProps } from 'vue-component-type-helpers'
import { DisplayWords, HandMap, Keyboard, LineGauge, TimeCircle, TimeClock, TypingControl } from '~/components/mod/game/TypingPlay/_internal'
import { TypingGameSetting } from '~~/libs/TypingGameSetting'
import { TypingGameState } from '~~/libs/TypingGameState'
import { TypingProblemQuestioner } from '~~/libs/TypingProblemQuestioner'
import type { ProblemType } from '~~/types/problems'

describe('TypingControl', () => {
  type Props = ComponentProps<typeof TypingControl>

  async function mountComponent(props?: Props) {
    return await mountSuspended(TypingControl, { props })
  }

  function createGameState(settings: Partial<TypingGameSetting>) {
    const setting = TypingGameSetting.create()
    Object.assign(setting, settings)
    return reactive(TypingGameState.create(setting))
  }

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('data-capslock', () => {
    it.each<{
      detail: TypingGameState['currentTypingState']['detail']
      expected: string
    }>([
      { detail: undefined, expected: 'false' },
      { detail: { capsLock: undefined }, expected: 'false' },
      { detail: { capsLock: false }, expected: 'false' },
      { detail: { capsLock: true }, expected: 'true' },
    ])('detail=$detail data-capslock=$expected', async ({ detail, expected }) => {
      const state = createGameState({})
      const component = await mountComponent({ state })
      state.currentTypingState = { mistake: false, detail }
      await nextTick()
      expect(component.attributes('data-capslock')).toBe(expected)
    })
  })

  describe('data-mistake', () => {
    it.each<{
      mistake: TypingGameState['currentTypingState']['mistake']
      expected: string
    }>([
      { mistake: true, expected: 'true' },
      { mistake: false, expected: 'false' },
    ])('mistake=$mistake data-mistake=$expected', async ({ mistake, expected }) => {
      const state = createGameState({})
      const component = await mountComponent({ state })
      state.currentTypingState = { mistake }
      await nextTick()
      expect(component.attributes('data-mistake')).toBe(expected)
    })

    it('一定時間経過でfalseに戻る', async () => {
      vi.useFakeTimers()
      const state = createGameState({})
      const component = await mountComponent({ state })

      state.currentTypingState = { mistake: true }
      await vi.advanceTimersToNextTimerAsync()
      expect(component.attributes('data-mistake')).toBe('true')

      await vi.advanceTimersByTimeAsync(200)
      expect(component.attributes('data-mistake')).toBe('false')
    })
  })

  describe('LineGauge', () => {
    it('exists', async () => {
      const state = createGameState({})
      const component = await mountComponent({ state })

      const line = component.findComponent(LineGauge)
      expect(line.exists()).toBe(true)
    })

    it.each<{
      input: {
        goalCharCount: number
        totalCharCount: number
        totalTypeCorrect: number
      }
      expected: {
        limit: number
        used: number
      }
    }>([
      {
        input: { goalCharCount: 1, totalCharCount: 2, totalTypeCorrect: 3 },
        expected: { limit: 1, used: 3 },
      },
      {
        input: { goalCharCount: 0, totalCharCount: 2, totalTypeCorrect: 4 },
        expected: { limit: 2, used: 4 },
      },
    ])('props(input=$input)=$expected', async ({ input, expected }) => {
      const state = createGameState({})
      vi.spyOn(state, 'goalCharCount', 'get').mockReturnValue(input.goalCharCount)
      vi.spyOn(state, 'totalCharCount', 'get').mockReturnValue(input.totalCharCount)
      vi.spyOn(state, 'totalTypeCorrect', 'get').mockReturnValue(input.totalTypeCorrect)
      const component = await mountComponent({ state })
      const line = component.findComponent(LineGauge)
      expect(line.props('limit')).toBe(expected.limit)
      expect(line.props('used')).toBe(expected.used)
    })
  })

  describe('TimeCircle', () => {
    it.each<{ timeLimit: number, expected: boolean }>([
      { timeLimit: 1, expected: true },
      { timeLimit: 0, expected: false },
    ])('timeLimit=$timeLimit exists=$expected', async ({ timeLimit, expected }) => {
      const state = createGameState({ timeLimit })
      const component = await mountComponent({ state })

      const timer = component.findComponent(TimeCircle)
      expect(timer.exists()).toBe(expected)
    })

    it('text', async () => {
      const state = createGameState({ timeLimit: 100_000 })
      state.timeUse = 50_001

      const component = await mountComponent({ state })
      const timer = component.findComponent(TimeCircle)

      expect(timer.text()).toBe('50')
    })

    it.each<{ isPausing: boolean, title: string }>([
      { isPausing: false, title: 'タイピングを一時停止する' },
      { isPausing: true, title: 'タイピングを再開する' },
    ])('クリックするとイベントが発行される(isPausing=$isPausing)', async ({ isPausing, title }) => {
      const onToggle = vi.fn()

      const state = createGameState({ timeLimit: 1 })
      vi.spyOn(state, 'isPausing', 'get').mockReturnValue(isPausing)

      const component = await mountComponent({ state, onToggle })
      const timer = component.findComponent(TimeCircle)
      await timer.find(`[title="${title}"]`).trigger('click')

      expect(onToggle).toBeCalledTimes(1)
    })
  })

  describe('TimeClock', () => {
    it.each<{ timeLimit: number, expected: boolean }>([
      { timeLimit: 1, expected: false },
      { timeLimit: 0, expected: true },
    ])('timeLimit=$timeLimit exists=$expected', async ({ timeLimit, expected }) => {
      const state = createGameState({ timeLimit })
      const component = await mountComponent({ state })

      const timer = component.findComponent(TimeClock)
      expect(timer.exists()).toBe(expected)
    })

    it('text', async () => {
      const state = createGameState({ timeLimit: 0 })
      state.timeUse = 5000

      const component = await mountComponent({ state })
      const timer = component.findComponent(TimeClock)

      expect(timer.text()).toBe('00:05')
    })

    it.each<{ isPausing: boolean, title: string }>([
      { isPausing: false, title: 'タイピングを一時停止する' },
      { isPausing: true, title: 'タイピングを再開する' },
    ])('クリックするとイベントが発行される(isPausing=$isPausing)', async ({ isPausing, title }) => {
      const onToggle = vi.fn()

      const state = createGameState({ timeLimit: 0 })
      vi.spyOn(state, 'isPausing', 'get').mockReturnValue(isPausing)

      const component = await mountComponent({ state, onToggle })
      const timer = component.findComponent(TimeClock)
      await timer.find(`[title="${title}"]`).trigger('click')

      expect(onToggle).toBeCalledTimes(1)
    })
  })

  describe('CloseCircle', () => {
    it('exists', async () => {
      const state = createGameState({})
      const component = await mountComponent({ state })
      const close = component.find('[title="タイピングを中止する"]')
      expect(close.exists()).toBe(true)
    })

    it('クリックするとイベントが発行される', async () => {
      const onCancel = vi.fn()
      const state = createGameState({})
      const component = await mountComponent({ state, onCancel })
      const close = component.find('[title="タイピングを中止する"]')
      await close.trigger('click')
      expect(onCancel).toBeCalledTimes(1)
    })
  })

  describe('DisplayWords', () => {
    it('exists', async () => {
      const state = createGameState({})
      const component = await mountComponent({ state })
      const display = component.findComponent(DisplayWords)
      expect(display.exists()).toBe(true)
    })

    it.each<ProblemType>(['english', 'japanese'])('problemType=%s', async (type) => {
      const state = createGameState({})
      state.problem = TypingProblemQuestioner.create({ id: '1', type, words: [] }, state.setting)
      const component = await mountComponent({ state })
      const display = component.findComponent(DisplayWords)
      expect(display.props('problemType')).toBe(type)
    })

    it('text', async () => {
      const state = createGameState({})
      state.problem = TypingProblemQuestioner.create({
        id: '1',
        type: 'english',
        words: [
          { word: '12345', info: 'info(1)/', info2: 'info2(1)/' },
          { word: '67890', info: 'info(2)/', info2: 'info2(2)/' },
        ],
      }, state.setting)

      const component = await mountComponent({ state })
      const display = component.findComponent(DisplayWords)

      state.currentWord?.wordState.next()
      await nextTick()
      expect(display.text()).toBe('info(1)/info2(1)/12345')

      state.nextWord()
      await nextTick()
      expect(display.text()).toBe('info(2)/info2(2)/67890')

      state.nextWord()
      await nextTick()
      expect(display.text()).toBe('')
    })
  })

  describe('HandMap', () => {
    it('exists', async () => {
      const state = createGameState({})
      const component = await mountComponent({ state })
      const handmap = component.findComponent(HandMap)
      expect(handmap.exists()).toBe(true)
    })

    describe('props', () => {
      it('keys', async () => {
        const state = createGameState({})
        const component = await mountComponent({ state })
        const handmap = component.findComponent(HandMap)
        expect(handmap.props('keys').isCapsLock).toBe(false)

        state.currentTypingState = { mistake: false, detail: { capsLock: true } }
        await nextTick()
        expect(handmap.props('keys').isCapsLock).toBe(true)
      })

      it('char', async () => {
        const state = createGameState({})
        state.problem = TypingProblemQuestioner.create({
          id: '1',
          type: 'english',
          words: [{ word: 'a', info: 'a' }],
        }, state.setting)
        const component = await mountComponent({ state })
        const handmap = component.findComponent(HandMap)
        expect(handmap.props('char')).toBe('')

        state.currentWord?.wordState.next()
        await nextTick()
        expect(handmap.props('char')).toBe('a')
      })
    })
  })

  describe('Keyboard', () => {
    it('exists', () => async () => {
      const state = createGameState({})
      const component = await mountComponent({ state })
      const keyboard = component.findComponent(Keyboard)
      expect(keyboard.exists()).toBe(true)
    })

    describe('props', () => {
      it('keys', async () => {
        const state = createGameState({})
        const component = await mountComponent({ state })
        const keyboard = component.findComponent(Keyboard)
        expect(keyboard.props('keys').isCapsLock).toBe(false)

        state.currentTypingState = { mistake: false, detail: { capsLock: true } }
        await nextTick()
        expect(keyboard.props('keys').isCapsLock).toBe(true)
      })

      it('char', async () => {
        const state = createGameState({})
        state.problem = TypingProblemQuestioner.create({
          id: '1',
          type: 'english',
          words: [{ word: 'a', info: 'a' }],
        }, state.setting)
        const component = await mountComponent({ state })
        const keyboard = component.findComponent(Keyboard)
        expect(keyboard.props('char')).toBe('')

        state.currentWord?.wordState.next()
        await nextTick()
        expect(keyboard.props('char')).toBe('a')
      })

      it.each<{ autoMode: Props['state']['setting']['autoMode'], expected: boolean }>([
        { autoMode: 0, expected: true },
        { autoMode: 1, expected: false },
      ])('autoMode=$autoMode clickable=$expected', async ({ autoMode, expected }) => {
        const state = createGameState({ autoMode })
        const component = await mountComponent({ state })
        const keyboard = component.findComponent(Keyboard)
        expect(keyboard.props('clickable')).toBe(expected)
      })
    })
  })
})
