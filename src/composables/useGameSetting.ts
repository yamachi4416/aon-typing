import type { GameSetting } from '../../libs/TypingGame'

export function useGameSetting() {
  const setting = useState(
    (): GameSetting => ({
      autoMode: 0,
      goalCharCount: 0,
      problemId: '',
      problemOrder: 'first',
      timeLimit: 0,
      keyLayout: 'JIS',
    }),
  )

  return {
    setting,
  }
}
