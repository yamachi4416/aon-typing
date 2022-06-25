import { Keys } from "~/libs/Keys";

// prettier-ignore
const normalKeys = [
  '', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '^', '\\', '',
  '\t', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '@', '[', '\n',
  '', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':', ']',
  '', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\', '',
  ' '
]
// prettier-ignore
const shiftKeys = [
  '', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '', '=', '~', '|', '',
  '\t', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '`', '{', '\n',
  '', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '+', '*', '}',
  '', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '_', '',
  ''
]
// prettier-ignore
const shiftLeftKeys = [
  '!', '"', '#', '$', '%',
  'Q', 'W', 'E', 'R', 'T',
  'A', 'S', 'D', 'F', 'G',
  'Z', 'X', 'C', 'V', 'B'
]
// prettier-ignore
const shiftRightKeys = [
  '&', '\'', '(', ')', '', '=', '~', '|',
  'Y', 'U', 'I', 'O', 'P', '`', '{',
  'H', 'J', 'K', 'L', '+', '*', '}',
  'N', 'M', '<', '>', '?', '_'
]
// prettier-ignore
const handMap: Record<string, number> = {
  ...[
    ['1', '2', '3', '4', '5'],
    ['q', 'w', 'e', 'r', 't'],
    ['a', 's', 'd', 'f', 'g'],
    ['z', 'x', 'c', 'v', 'b'],
    ['!', '"', '#', '$', '%'],
    ['Q', 'W', 'E', 'R', 'T'],
    ['A', 'S', 'D', 'F', 'G'],
    ['Z', 'X', 'C', 'V', 'B']
  ].reduce((a, line) => line.reduce((a, k, i) => {
    if (k) {
      return { ...a, [k]: Math.min(i, 3) + 1 }
    }
    return a
  }, a), {}),
  ...[
    ['6', '7', '8', '9', '0', '-', '^', '\\'],
    ['y', 'u', 'i', 'o', 'p', '@', '['],
    ['h', 'j', 'k', 'l', ';', ':', ']'],
    ['n', 'm', ',', '.', '/', '\\'],
    ['&', '\'', '(', ')', '', '=', '~', '|'],
    ['Y', 'U', 'I', 'O', 'P', '`', '{'],
    ['H', 'J', 'K', 'L', '+', '*', '}'],
    ['N', 'M', '<', '>', '?', '_']
  ].reduce((a, line) => line.reduce((a, k, i) => {
    if (k) {
      return { ...a, [k]: (i < 2 ? 1 : Math.min(i, 4)) + 6 }
    }
    return a
  }, a), {}),
  ' ': 6
}

const shiftKeySet = new Set(shiftKeys);
const shiftLeftKeySet = new Set(shiftLeftKeys);
const shiftRightKeySet = new Set(shiftRightKeys);

export class JISKeys extends Keys {
  getLabelByIndex(idx: number, shift: boolean): string {
    switch (idx) {
      case 0:
        return "";
      case 14:
        return "back\nspace";
      case 15:
        return "tab";
      case 28:
        return "enter";
      case 29:
        return "caps lock";
      case 42:
        return "shiftL";
      case 54:
        return "shiftR";
      case 55:
        return "space";
      default:
        return this.getKeyByIndex(idx, shift);
    }
  }

  getKeyByIndex(idx: number, shift: boolean): string {
    if (shift) {
      return shiftKeys[idx];
    }
    return normalKeys[idx];
  }

  isShiftKey(key: string): boolean {
    return shiftKeySet.has(key);
  }

  isShiftLeftKey(key: string): boolean {
    return shiftLeftKeySet.has(key);
  }

  isShiftRightKey(key: string): boolean {
    return shiftRightKeySet.has(key);
  }

  getHandIdx(key: string): number {
    return handMap[key] || 0;
  }
}
