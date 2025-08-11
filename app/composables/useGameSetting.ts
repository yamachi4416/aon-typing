import { TypingGameSetting } from '~~/libs/TypingGameSetting'

export function useGameSetting() {
  const setting = useState(TypingGameSetting.create)

  function resetSetting() {
    setting.value = TypingGameSetting.create()
  }

  return {
    setting,
    resetSetting,
  }
}
