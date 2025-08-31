import { routerSetup as _routerSetup } from '../../_utils'

export function routerSetup(targetPath: '' | 'menu' | 'play') {
  return _routerSetup((routes) => {
    const game = routes.find(
      ({ path, name }) => path === '/game' && name === undefined,
    )!

    const defaults: typeof game.children = [
      {
        path: '',
        name: 'game',
        component: { template: '/game/index' },
      },
      {
        path: 'menu',
        name: 'game-menu',
        component: { template: '/game/menu' },
      },
      {
        path: 'play',
        name: 'game-play',
        component: { template: '/game/play' },
      },
    ]

    return [
      { path: '/', name: 'index', component: { template: '/' } },
      {
        ...game,
        children: [
          game.children.find(({ path }) => path === targetPath)!,
          ...defaults.filter(({ path }) => path !== targetPath),
        ],
      },
    ]
  })
}
