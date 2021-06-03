<template>
  <svg
    class="typing-game-panel"
    viewBox="-1 -1 1001 463"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line-gauge
      class="line-gauge"
      :limit="typing.goalCharCount || typing.totalCharCount || 0"
      :used="typing.totalTypeCorrect"
    />
    <foreignObject class="typing-game" width="1001" height="463">
      <div class="wrapper">
        <div class="display-zone">
          <div class="display-zone-info">
            <div class="display-zone-info-left">
              <time-circle
                v-if="typing.timeLimit > 0"
                :total-time="typing.timeLimit"
                :time="typing.timeUse"
                :text="
                  typing.timeLimit - typing.timeUse
                    ? ~~((typing.timeLimit - typing.timeUse) / 1000 + 1)
                    : 'END'
                "
                @click="pauseToggle"
              />
              <time-clock v-else :time="typing.timeUse" @click="pauseToggle" />
            </div>
            <div class="display-zone-info-center">
              <div class="display-words-info" :class="infoClass">
                <span
                  class="display-words-info-text"
                  v-text="current.infoState.info"
                />
              </div>
              <display-words
                v-if="!!current.infoState.word"
                width="100%"
                class="display-words-info2"
                :word="current.infoState"
              />
              <display-words
                width="100%"
                class="display-words-word"
                :word="current.wordState"
              />
            </div>
            <div class="display-zone-info-right">
              <div class="close-circle">
                <close-circle tabindex="-1" @click="cancel" />
              </div>
            </div>
          </div>
        </div>
        <div class="hands">
          <hand-map :hand-numbers="leftHands" />
          <hand-map :hand-numbers="rightHands" />
        </div>
        <div class="keyboard-zone">
          <typing-keyboard
            :type-key="typeKey"
            :setting="setting"
            :keys="keys"
          />
        </div>
      </div>
    </foreignObject>
  </svg>
</template>

<script>
import TimeCircle from '../parts/TimeCircle.vue'
import DisplayWords from '../modules/keyboard/DisplayWords.vue'
import HandMap from '../modules/keyboard/HandMap.vue'
import CloseCircle from '../parts/CloseCircle.vue'
import TypingKeyboard from '../modules/keyboard/TypingKeyboard.vue'
import TimeClock from '../parts/TimeClock.vue'
import LineGauge from '../parts/LineGauge.vue'
import JISKeys from '~/libs/JISKeys'

export default {
  components: {
    TimeCircle,
    DisplayWords,
    HandMap,
    CloseCircle,
    TypingKeyboard,
    TimeClock,
    LineGauge,
  },
  props: {
    typing: {
      type: Object,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
  },
  computed: {
    infoClass() {
      const chars = this.current?.infoState?.info?.length || 0
      const n = [10, 20, 30, 40, 50, 100, 200, 300].find((c) => chars <= c) || 0
      const type = this.typing.problem?.type || 'unknown'
      return { [`chars-${n}`]: true, [type]: true }
    },
    keys() {
      return JISKeys
    },
    current() {
      return (
        this.typing.current || {
          infoState: {},
          wordState: {},
        }
      )
    },
    typeKey() {
      return this.current.wordState.current || ''
    },
    handNumber() {
      return this.keys.getHandIdx(this.typeKey)
    },
    leftHands() {
      return [this.handNumber, this.keys.isShiftRightKey(this.typeKey) ? 1 : 0]
    },
    rightHands() {
      return [
        this.handNumber - 5,
        this.keys.isShiftLeftKey(this.typeKey) ? 5 : 0,
      ]
    },
  },
  beforeDestroy() {
    this.typing.dispose()
  },
  methods: {
    cancel() {
      this.typing.cancel()
    },
    pauseToggle() {
      if (this.typing.isRunning) {
        this.typing.pause()
      } else if (this.typing.isPausing) {
        this.typing.resume()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.typing-game-panel {
  box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.4);
  border: 2px solid #333;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);

  .line-gauge {
    transform: translate(-1px, -1px);
  }

  .typing-game {
    height: 100%;
    max-height: 100%;
    width: 100%;
    overflow: hidden;

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;
      height: 100%;
      width: 100%;
    }

    .display-zone {
      width: 100%;

      &-info {
        display: flex;
        align-items: flex-start;

        &-left,
        &-right {
          width: 60px;
        }

        &-right {
          display: flex;
          justify-content: flex-end;
          .close-circle {
            width: 35px;
            height: 35px;
            margin-top: -5px;
            margin-right: -5px;
          }
        }

        &-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 100px;

          & > * {
            width: 100%;
          }

          .display-words-info {
            flex: 1;
            font-size: 1em;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.2;

            &-text {
              white-space: pre-wrap;
            }

            &.english {
              font-size: 1.2em;
              line-height: 1.4;
            }

            &.chars-10 {
              font-size: 1.5em;
              &.english {
                font-size: 1.6em;
              }
            }
            &.chars-20 {
              font-size: 1.4em;
              &.english {
                font-size: 1.5em;
              }
            }
            &.chars-30 {
              font-size: 1.3em;
              &.english {
                font-size: 1.4em;
              }
            }
            &.chars-40 {
              font-size: 1.2em;
              &.english {
                font-size: 1.3em;
              }
            }
            &.chars-50 {
              font-size: 1.1em;
              &.english {
                font-size: 1.2em;
              }
            }
            &.chars-200 {
              font-size: 0.9em;
              &.english {
                font-size: 1em;
              }
            }
            &.chars-300 {
              font-size: 0.8em;
              &.english {
                font-size: 0.9em;
              }
            }
          }

          .display-words-info2 {
            font-size: 1.1em;
            letter-spacing: 0.1em;
          }

          .display-words-word {
            font-size: 1.5em;
            letter-spacing: 0.15em;
          }
        }
      }

      &-words {
        width: 90%;
        margin: 0 auto;

        .display-words {
          width: 100%;
        }
      }
    }

    .words-count {
      display: flex;
      margin: 0;
      color: #666;
      font-size: 14px;
      white-space: nowrap;

      &-types-count {
        width: 3em;
        text-align: right;
      }
    }

    .keyboard-zone {
      width: 90%;
    }

    .hands {
      height: 15px;
      width: 85%;
      display: flex;
      row-gap: 20px;
      column-gap: 20px;
      & > * {
        width: 100%;
      }
    }
  }
}
</style>
