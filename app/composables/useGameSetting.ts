import { TypingGameSetting } from '~~/libs/TypingGameSetting'

export function useGameSetting() {
  const setting = useState(TypingGameSetting.create)

  return {
    setting,
  }
}
