import { navigator } from '~/plugins/Navigator'

export function useNavigator () {
  return readonly(navigator)
}
