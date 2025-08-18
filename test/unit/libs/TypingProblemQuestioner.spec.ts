import { TypingProblemQuestioner } from '~~/libs/TypingProblemQuestioner'
import type { ProblemDetailWord } from '~~/types/problems'

describe('TypingProblemQuestioner', () => {
  type Args = Parameters<typeof TypingProblemQuestioner.create>

  const create = (problem: Partial<Args[0]>, setting?: Partial<Args[1]>) =>
    TypingProblemQuestioner.create(
      {
        id: 'id',
        type: 'japanese',
        words: [],
        ...problem,
      },
      { problemOrder: 'first', ...setting },
    )
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('create', () => {
    it('初期値（wordsなし）', () => {
      const problem = create(
        {
          id: 'id',
          type: 'japanese',
          words: [],
        },
        { problemOrder: 'first' },
      )

      expect(problem.words).toEqual([])
      expect(problem.endWords).toEqual([])
      expect(problem.totalCharCount).toBe(0)
      expect(problem.id).toBe('id')
      expect(problem.type).toBe('japanese')
      expect(problem.hasNext).toBe(false)
      expect(problem.current).toBeUndefined()
    })
  })

  it('初期値（wordsあり）', () => {
    const problem = create({
      words: [
        { info2: 'あいうえお', word: 'aiueo', info: 'アイウエオ' },
        { info2: 'かきくけこ', word: 'kakikukeko', info: 'カキクケコ' },
        { info2: 'さしすせそ', word: 'sasisuseso', info: 'サシスセソ' },
      ],
    })

    expect(problem.words).toHaveLength(3)
    expect(problem.endWords).toEqual([])
    expect(problem.totalCharCount).toBe(25)
    expect(problem.hasNext).toBe(true)
    expect(problem.current).toBeTruthy()
    expect(problem.current?.wordState.word).toBe('aiueo')
    expect(problem.current?.infoState.word).toBe('あいうえお')
    expect(problem.current?.infoState.info).toBe('アイウエオ')
  })

  it('nextWord', () => {
    const problem = create({
      words: [
        { info2: 'あいうえお', word: 'aiueo', info: 'アイウエオ' },
        { info2: 'かきくけこ', word: 'kakikukeko', info: 'カキクケコ' },
        { info2: 'さしすせそ', word: 'sasisuseso', info: 'サシスセソ' },
      ],
    })

    expect(problem.hasNext).toBe(true)
    expect(problem.current?.wordState.word).toBe('aiueo')
    expect(problem.endWords.at(-1)?.wordState.word).toBeUndefined()

    problem.nextWord()
    expect(problem.hasNext).toBe(true)
    expect(problem.current?.wordState.word).toBe('kakikukeko')
    expect(problem.endWords.at(-1)?.wordState.word).toBe('aiueo')

    problem.nextWord()
    expect(problem.hasNext).toBe(true)
    expect(problem.current?.wordState.word).toBe('sasisuseso')
    expect(problem.endWords.at(-1)?.wordState.word).toBe('kakikukeko')

    problem.nextWord()
    expect(problem.hasNext).toBe(false)
    expect(problem.current?.wordState.word).toBeUndefined()
    expect(problem.endWords.at(-1)?.wordState.word).toBe('sasisuseso')
  })

  it('init', () => {
    const problem = create({
      words: [
        { info2: 'あいうえお', word: 'aiueo', info: 'アイウエオ' },
        { info2: 'かきくけこ', word: 'kakikukeko', info: 'カキクケコ' },
        { info2: 'さしすせそ', word: 'sasisuseso', info: 'サシスセソ' },
      ],
    })

    const init = structuredClone(problem)

    problem.nextWord()
    problem.current!.startTime = 1
    problem.current!.endTime = 10
    problem.current!.count = 20

    problem.init()

    expect(problem).toEqual(init)
  })

  it('reset', () => {
    const problem = create({
      words: [
        { info2: 'あいうえお', word: 'aiueo', info: 'アイウエオ' },
        { info2: 'かきくけこ', word: 'kakikukeko', info: 'カキクケコ' },
        { info2: 'さしすせそ', word: 'sasisuseso', info: 'サシスセソ' },
      ],
    })

    const init = structuredClone(problem)

    problem.nextWord()
    problem.current!.startTime = 1
    problem.current!.endTime = 10
    problem.current!.count = 20

    problem.reset()

    expect(problem).toEqual(init)
  })

  it('continue', () => {
    const problem = create({
      words: [
        { info2: 'あいうえお', word: 'aiueo', info: 'アイウエオ' },
        { info2: 'かきくけこ', word: 'kakikukeko', info: 'カキクケコ' },
        { info2: 'さしすせそ', word: 'sasisuseso', info: 'サシスセソ' },
      ],
    })

    problem.nextWord()
    problem.current!.startTime = 1
    problem.current!.endTime = 10
    problem.current!.count = 20

    problem.continue()

    expect(problem.endWords).toEqual([])
    expect(problem.words).toMatchObject([
      { startTime: 0, endTime: 0, count: 0 },
      { startTime: 0, endTime: 0, count: 0 },
    ])
  })

  describe('problemOrder', () => {
    const words: ReadonlyArray<ProblemDetailWord> = [
      { info2: 'あいうえお', word: 'aiueo', info: 'アイウエオ' },
      { info2: 'かきくけこ', word: 'kakikukeko', info: 'カキクケコ' },
      { info2: 'さしすせそ', word: 'sasisuseso', info: 'サシスセソ' },
    ]

    it('first', () => {
      const problem = create({ words }, { problemOrder: 'first' })

      expect(problem.words.map(({ wordState: { word } }) => word)).toEqual([
        'aiueo',
        'kakikukeko',
        'sasisuseso',
      ])
    })

    it('last', () => {
      const problem = create({ words }, { problemOrder: 'last' })

      expect(problem.words.map(({ wordState: { word } }) => word)).toEqual([
        'sasisuseso',
        'kakikukeko',
        'aiueo',
      ])
    })

    it('random', async () => {
      const util = await import('~~/libs/Util')
      const shuffle = vi
        .spyOn(util, 'shuffle')
        .mockImplementation((arr) => [arr[0], arr[2], arr[1]])

      const problem = create({ words }, { problemOrder: 'random' })

      expect(problem.words.map(({ wordState: { word } }) => word)).toEqual([
        'aiueo',
        'sasisuseso',
        'kakikukeko',
      ])
      expect(shuffle).toBeCalledTimes(1)
    })
  })
})
