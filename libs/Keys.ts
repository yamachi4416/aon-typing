export abstract class Keys {
  abstract get name(): string
  abstract getLabelByIndex(idx: number, shift: boolean): string
  abstract getKeyByIndex(idx: number, shift: boolean): string
  abstract isShiftKey(key: string): boolean
  abstract isShiftRightKey(key: string): boolean
  abstract isShiftLeftKey(key: string): boolean
  abstract getHandIdx(key: string): number

  isTypeKeyByIndex(idx: number, typeKey: string, shift = false) {
    const label = this.getLabelByIndex(idx, shift)
    switch (label) {
      case 'shiftL':
        return this.isShiftRightKey(typeKey)
      case 'shiftR':
        return this.isShiftLeftKey(typeKey)
      default:
        return typeKey === this.getKeyByIndex(idx, shift)
    }
  }

  static nullKeys() {
    return NullKeys
  }
}

const NullKeys: Readonly<Keys> = {
  name: 'Null',
  isTypeKeyByIndex: () => false,
  getLabelByIndex: () => '',
  getKeyByIndex: () => '',
  isShiftKey: () => false,
  isShiftRightKey: () => false,
  isShiftLeftKey: () => false,
  getHandIdx: () => -1,
}

export default {
  Keys,
}
