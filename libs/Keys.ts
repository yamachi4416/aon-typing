// prettier-ignore
const _KeyValues = [
'zh', 'ctrl', 'bs', 'cap', 'shiftL', 'shiftR', ' ', '\t', '\\', '\n',
'1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '^',
'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '@', '[',
'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':', ']',
'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
'!', '"', '#', '$', '%', '&', '\'', '(', ')', '', '=', '~', '|',
'Q', 'W', 'E', 'R', 'T', 'Y', 'U',  'I', 'O', 'P', '`', '{',
'A', 'S', 'D', 'F', 'G', 'H', 'J',  'K', 'L', '+', '*', '}',
'Z', 'X', 'C', 'V', 'B', 'N', 'M',  '<', '>', '?', '_'
] as const

type KeyValue = (typeof _KeyValues)[number]

export type Key = Readonly<[KeyValue, KeyValue]>

export type KeyLayoutName = 'NULL' | 'JIS' | 'US'

export interface Keys {
  get name(): KeyLayoutName
  get isCapsLock(): boolean
  isShiftKey(key: string): boolean
  isShiftRightKey(key: string): boolean
  isShiftLeftKey(key: string): boolean
  getHandIdx(key: string): number
  getKeys(): Readonly<Key[][]>
  getCapsLockKeys(): Keys | null
}

export function defineKeys({
  name,
  normalKeys,
  shiftKeys,
  isCapsLock,
}: {
  name: KeyLayoutName
  normalKeys: Readonly<KeyValue[][]>
  shiftKeys: Readonly<KeyValue[][]>
  isCapsLock?: boolean
}): Readonly<Keys> {
  const normalLeftKeys = normalKeys.slice(0, 4).map((line) => line.slice(1, 6))
  const shiftLeftKeys = shiftKeys.slice(0, 4).map((line) => line.slice(1, 6))
  const normalRightKeys = normalKeys.slice(0, 4).map((line) => line.slice(6))
  const shiftRightKeys = shiftKeys.slice(0, 4).map((line) => line.slice(6))

  const handMap = new Map<string, number>([
    ...[...normalLeftKeys, ...shiftLeftKeys].flatMap((keys) =>
      keys.map<[string, number]>((key, i) => [key, Math.min(i, 3) + 1]),
    ),
    ...[...normalRightKeys, ...shiftRightKeys].flatMap((keys) =>
      keys.map<[string, number]>((key, i) => [
        key,
        (i < 2 ? 1 : Math.min(i, 4)) + 6,
      ]),
    ),
  ])

  const isCharKey = (key: KeyValue) => key.trim().length === 1

  const shiftKeySet = new Set<string>(shiftKeys.flat().filter(isCharKey))
  const shiftLeftKeySet = new Set<string>(
    shiftLeftKeys.flat().filter(isCharKey),
  )
  const shiftRightKeySet = new Set<string>(
    shiftRightKeys.flat().filter(isCharKey),
  )

  const capsLockKeys = isCapsLock
    ? null
    : defineKeys({
        name,
        normalKeys: normalKeys.map((lines) =>
          lines.map((c) => {
            return c.length === 1 && c >= 'a' && c <= 'z'
              ? (c.toUpperCase() as KeyValue)
              : c
          }),
        ),
        shiftKeys: shiftKeys.map((lines) =>
          lines.map((c) => {
            return c.length === 1 && c >= 'A' && c <= 'Z'
              ? (c.toLocaleLowerCase() as KeyValue)
              : c
          }),
        ),
        isCapsLock: true,
      })

  return {
    get name() {
      return name
    },
    get isCapsLock() {
      return isCapsLock ?? false
    },
    isShiftKey(key: string): boolean {
      return shiftKeySet.has(key)
    },
    isShiftLeftKey(key: string): boolean {
      return shiftLeftKeySet.has(key)
    },
    isShiftRightKey(key: string): boolean {
      return shiftRightKeySet.has(key)
    },
    getHandIdx(key: string): number {
      return handMap.get(key) || 0
    },
    getKeys(): Readonly<Key[][]> {
      return normalKeys.map((keys, i) =>
        keys.map((k, j) => [k, shiftKeys[i][j]]),
      )
    },
    getCapsLockKeys() {
      return capsLockKeys
    },
  }
}

const NullKeys = defineKeys({
  name: 'NULL',
  normalKeys: [],
  shiftKeys: [],
})

const JISKeys = defineKeys({
  name: 'JIS',
  // prettier-ignore
  normalKeys: [
    ['zh',     '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '^', '\\', 'bs'],
    ['\t',     'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '@', '[', '\n'],
    ['cap',    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':', ']'],
    ['shiftL', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\', 'shiftR'],
    [' ']
  ],
  // prettier-ignore
  shiftKeys: [
    ['zh',     '!', '"', '#', '$', '%', '&', '\'', '(', ')', '', '=', '~', '|', 'bs'],
    ['\t',     'Q', 'W', 'E', 'R', 'T', 'Y', 'U',  'I', 'O', 'P', '`', '{', '\n'],
    ['cap',    'A', 'S', 'D', 'F', 'G', 'H', 'J',  'K', 'L', '+', '*', '}'],
    ['shiftL', 'Z', 'X', 'C', 'V', 'B', 'N', 'M',  '<', '>', '?', '_', 'shiftR'],
    [' ']
  ],
})

export function getKeyLayout(name: KeyLayoutName) {
  switch (name) {
    case 'NULL':
      return NullKeys
    case 'JIS':
      return JISKeys
  }
  throw new Error(`${name} keyboard is not support yet`)
}
