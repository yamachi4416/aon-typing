import { GameSetting } from '~~/libs/TypingGameSetting'

export function useGameSetting() {
  const setting = useState(GameSetting.create)

  return {
    setting,
  }
}
