export abstract class TimeProvider {
  abstract now(): number

  static default(): TimeProvider {
    return Date
  }
}
