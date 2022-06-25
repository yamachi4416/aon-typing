export function keyCodeToChar(code: number, shift = false) {
  if (code === 9) {
    return "\t";
  }

  if (code === 13) {
    return "\n";
  }

  if (code === 32) {
    return " ";
  }

  if (code >= 48 && code <= 57) {
    if (shift) {
      if (code === 48) {
        return "";
      }
      return "!\"#$%&'()"[code - 49];
    }
    return "0123456789"[code - 48];
  }

  if (code >= 65 && code <= 90) {
    if (shift) {
      return String.fromCharCode(code);
    }
    return String.fromCharCode(97 + code - 65);
  }

  if (code <= 96 && code <= 111) {
    return "0123456789*+-./"[code - 96];
  }

  if (code >= 186 && code <= 192) {
    if (shift) {
      return "*+<=>?`"[code - 186];
    }
    return ":;,-./@"[code - 186];
  }

  if (code >= 219 && code <= 222) {
    if (shift) {
      return "{|}~"[code - 219];
    }
    return "[\\]^"[code - 219];
  }

  if (code === 226) {
    if (shift) {
      return "_";
    }
    return "\\";
  }

  return "";
}

export abstract class Keys {
  abstract getLabelByIndex(idx: number, shift: boolean): string;
  abstract getKeyByIndex(idx: number, shift: boolean): string;
  abstract isShiftKey(key: string): boolean;
  abstract isShiftRightKey(key: string): boolean;
  abstract isShiftLeftKey(key: string): boolean;
  abstract getHandIdx(key: string): number;

  isTypeKeyByIndex(idx: number, typeKey: string, shift = false) {
    const label = this.getLabelByIndex(idx, shift);
    switch (label) {
      case "shiftL":
        return this.isShiftRightKey(typeKey);
      case "shiftR":
        return this.isShiftLeftKey(typeKey);
      default:
        return typeKey === this.getKeyByIndex(idx, shift);
    }
  }
}

export default {
  keyCodeToChar,
  Keys,
};
