import { keyCodeToChar } from "~/libs/Keys";
import { TypingGameInfo } from "~/libs/TypingGameInfo";
import { TypingGamerEnglish } from "~/libs/TypingGamerEnglish";
import { TypingGamerJapanese } from "~/libs/TypingGamerJapanese";
import { TypingGameWordData } from "./TypingGameWordData";
import { TypingProblemQuestioner } from "./TypingProblemQuestioner";

type TypingGamer = TypingGamerEnglish | TypingGamerJapanese;

type TypingEventDetail = {
  keyCode?: number;
  shiftKey?: boolean;
  char?: string;
};

type TypingEvent = CustomEvent<TypingEventDetail>;

export class GameSetting {
  timeLimit: number = 0;
  autoMode: number = 0;
  randomMode: boolean = false;
  goalCharCount: number = 0;
  problemId: string = "";

  clear() {
    this.timeLimit = 0;
    this.autoMode = 0;
    this.randomMode = false;
    this.goalCharCount = 0;
    this.problemId = "";
  }
}

export class TypingGame {
  problem: TypingProblemQuestioner = null;
  tick = 0;
  pausing = false;
  canceled = false;
  running = false;
  timeLimit = 0;
  timeUse = 0;
  goalCharCount = 0;
  totalTypeCount = 0;
  totalTypeCorrect = 0;
  totalTypeMiss = 0;

  private eventManager: EventManager;

  private _stop: () => void = null;

  constructor() {
    this.eventManager = new EventManager();
    this._initData();
  }

  private _initData() {
    this.problem = null;
    this.tick = 0;
    this.pausing = false;
    this.canceled = false;
    this.running = false;
    this.timeLimit = 0;
    this.timeUse = 0;
    this.goalCharCount = 0;
    this.totalTypeCount = 0;
    this.totalTypeCorrect = 0;
    this.totalTypeMiss = 0;
  }

  init({
    problem = null,
    setting = null,
  }: {
    problem?: TypingProblemQuestioner;
    setting?: GameSetting;
  }) {
    this._initData();
    this.problem = problem;
    this.timeLimit = setting?.timeLimit || 0;
    this.timeUse = 0;
    this.goalCharCount = setting?.goalCharCount || 0;
    this._stop = null;
  }

  get current() {
    return this.problem?.current;
  }

  get totalCharCount() {
    return this.problem?.totalCharCount;
  }

  private _typing({ gamer }: { gamer: TypingGamer }): EventListener {
    gamer.init(this.current);

    return (event: TypingEvent) => {
      if (this.pausing) {
        return;
      }

      const detail = event.detail;
      const char =
        detail.char || keyCodeToChar(detail.keyCode, detail.shiftKey);
      const word = this.current;

      if (char) {
        this.totalTypeCount++;
        if (gamer.expect(char, word)) {
          this.totalTypeCorrect++;
        } else {
          this.totalTypeMiss++;
        }

        if (this.goalCharCount > 0) {
          if (this.totalTypeCorrect >= this.goalCharCount && this._stop) {
            this._stop();
            return;
          }
        }

        if (word.success) {
          word.endTime = this.tick;
          this.problem?.nextWord();

          if (this.current) {
            this.current.startTime = word.endTime;
            gamer.init(this.current);
          } else if (this._stop) {
            this._stop();
          }
        }
      }
    };
  }

  private _keydown(): EventListener {
    return (e: KeyboardEvent) => {
      e.preventDefault();
      const { keyCode, shiftKey } = e;
      const detail = { keyCode, shiftKey, char: null };
      const event = new CustomEvent("c:typing", { detail });
      window.dispatchEvent(event);
    };
  }

  private _visibleChange(ticks: { stop: () => void; start: () => void }[]) {
    return () => {
      if (document.hidden) {
        ticks.forEach((t) => t.stop());
      } else {
        ticks.forEach((t) => t.start());
      }
    };
  }

  private _tickTimer(timeLimit: number) {
    const tick = () => {
      if (timeLimit > 0 && this.timeUse >= timeLimit) {
        this.cancel();
      } else if (this.isRunning) {
        this.tick += 10;
        this.timeUse += 10;
      }
    };

    return {
      id: null as number,
      start() {
        this.stop();
        this.id = startIntervalTimer(tick, 10);
      },
      stop() {
        if (this.id !== null) {
          stopIntervalTimer(this.id);
          this.id = null;
        }
      },
    };
  }

  private _autoTyping({
    words,
    autoMode,
  }: {
    words: TypingGameWordData[];
    autoMode: number;
  }) {
    if (!autoMode) {
      return {
        start() {},
        stop() {},
      };
    }

    let id = null;
    const xs = Array.from(
      words.reduce((a, w) => a + w.wordState.remaining, "")
    );
    const tick = () => {
      if (!this.isRunning) {
        return;
      }

      const char = xs.shift();
      if (char) {
        const detail = { char };
        const event = new CustomEvent("c:typing", { detail });
        window.dispatchEvent(event);
      } else {
        stopIntervalTimer(id);
      }
    };

    return {
      start() {
        this.stop();
        id = startIntervalTimer(tick, autoMode);
      },
      stop() {
        if (id !== null) {
          stopIntervalTimer(id);
          id = null;
        }
      },
    };
  }

  start({
    problem,
    setting,
  }: {
    problem: TypingProblemQuestioner;
    setting: GameSetting;
  }): Promise<TypingGameInfo> {
    this.cancel();

    const { words, type } = problem ?? {};
    const { timeLimit, autoMode } = setting;
    this.init({ problem, setting });

    let gamer = null as TypingGamer;
    if (type === "english") {
      gamer = new TypingGamerEnglish();
    } else if (type === "japanese") {
      gamer = new TypingGamerJapanese();
    }

    return new Promise((resolve) => {
      const keydown = autoMode ? () => {} : this._keydown();
      const typing = this._typing({ gamer });
      const ticks = [
        this._tickTimer(timeLimit),
        this._autoTyping({ words, autoMode }),
      ];

      const visibilitychange = this._visibleChange(ticks);

      this._stop = () => {
        this._stop = null;
        this.running = false;

        if (this.current && !this.current.endTime) {
          this.current.endTime = this.tick;
        }

        ticks.forEach((t) => t.stop());

        this.eventManager.removeAllEventHandler();

        resolve(this.info());
      };

      this.eventManager.addEventHandler("keydown", keydown);
      this.eventManager.addEventHandler("c:typing", typing);
      this.eventManager.addEventHandler(
        "visibilitychange",
        visibilitychange,
        document
      );

      ticks.forEach((t) => t.start());
      this.running = true;
    });
  }

  cancel() {
    if (this._stop) {
      this.canceled = true;
      this._stop();
    }
    this.eventManager.removeAllEventHandler();
    stopAllIntervalTimer();
    return this.info();
  }

  pause() {
    if (this.isRunning) {
      this.pausing = true;
      return true;
    }
    return false;
  }

  resume() {
    if (this.isPausing) {
      this.pausing = false;
      return true;
    }
    return false;
  }

  get isPausing() {
    return this.running && this.pausing;
  }

  get isRunning() {
    return this.running && !this.pausing;
  }

  info() {
    return new TypingGameInfo(this);
  }

  dispose() {
    this.eventManager.removeAllEventHandler();
    stopAllIntervalTimer();
  }
}

class EventManager {
  private listeners: {
    eventName: string;
    handler: EventListener;
    target: Document | Element | Window;
    active: boolean;
  }[] = [];

  addEventHandler(
    eventName: string,
    handler: EventListener,
    target?: Document | Element | Window
  ) {
    target = target || window;
    target.addEventListener(eventName, handler);
    this.listeners.push({
      eventName,
      handler,
      target,
      active: true,
    });
  }

  removeEventHandler(
    eventName: string,
    handler: EventListener,
    target?: Document | Element | Window
  ) {
    target = target || window;

    const targets = this.listeners.filter((it) => {
      it.active =
        it.eventName !== eventName ||
        it.handler !== handler ||
        it.target !== target;
      return !it.active;
    });

    this.listeners = this.listeners.filter((it) => it.active);

    targets.forEach((it) => {
      it.target.removeEventListener(it.eventName, it.handler);
    });
  }

  removeAllEventHandler() {
    const targets = [...this.listeners];
    this.listeners = [];
    targets.forEach((it) => {
      it.target.removeEventListener(it.eventName, it.handler);
    });
  }
}

let intervalTimerIds: Record<number, number> = Object.create(null);
function startIntervalTimer(func: () => void, interval: number) {
  let id: number;
  let time = new Date().getTime() + interval;
  const fn = () => {
    func();
    intervalTimerIds[id] = window.setTimeout(
      fn,
      Math.max((time += interval) - new Date().getTime(), 0)
    );
  };
  id = window.setTimeout(fn, interval);
  intervalTimerIds[id] = id;
  return id;
}

function stopIntervalTimer(id: number) {
  const timerId = intervalTimerIds[id];
  delete intervalTimerIds[id];
  if (timerId) {
    window.clearInterval(timerId);
  }
}

function stopAllIntervalTimer() {
  const ids = Object.values(intervalTimerIds);
  intervalTimerIds = Object.create(null);
  ids.forEach((id) => window.clearInterval(id));
}
