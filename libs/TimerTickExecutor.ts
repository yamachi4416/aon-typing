export abstract class TimerTickExecutor {
  abstract defer(
    callback: (value?: unknown) => unknown,
    timeout: number,
  ): number
  abstract cancel(id: number): void

  static default(): TimerTickExecutor {
    return new TimerTickExecutorImpl()
  }
}

class TimerTickExecutorImpl implements TimerTickExecutor {
  defer(callback: (value?: unknown) => unknown, timeout: number): number {
    return Number(setTimeout(callback, timeout))
  }

  cancel(id: number) {
    clearTimeout(id)
  }
}
