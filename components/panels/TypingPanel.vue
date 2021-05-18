<template>
  <svg
    class="typing-game-panel"
    viewBox="-1 -1 1001 463"
    xmlns="http://www.w3.org/2000/svg"
  >
    <foreignObject class="typing-game">
      <div class="wrapper">
        <div class="display-zone">
          <div class="display-zone-info">
            <div class="display-zone-info-left">
              <time-circle
                v-if="typing.timeLimit > 0"
                :total-time="typing.timeLimit"
                :time="typing.timeUse"
                :text="
                  ~~(typing.timeUse / 1000) || '0.' + ~~(typing.timeUse / 100)
                "
                @click="pauseToggle"
              />
            </div>
            <div class="display-zone-info-center">
              <disp-words-info
                class="display-words"
                :word="current.infoState"
              />
            </div>
            <div class="display-zone-info-right">
              <close-circle class="close-circle" @click="cancel" />
            </div>
          </div>
          <div class="display-zone-words">
            <display-words
              width="100%"
              class="display-words"
              :word="current.wordState"
            />
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
import DispWordsInfo from '../modules/keyboard/DispWordsInfo.vue'
import DisplayWords from '../modules/keyboard/DisplayWords.vue'
import HandMap from '../modules/keyboard/HandMap.vue'
import CloseCircle from '../parts/CloseCircle.vue'
import TypingKeyboard from '../modules/keyboard/TypingKeyboard.vue'
import JISKeys from '~/libs/JISKeys'

export default {
  components: {
    TimeCircle,
    DispWordsInfo,
    DisplayWords,
    HandMap,
    CloseCircle,
    TypingKeyboard,
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

  .typing-game {
    height: 100%;
    max-height: 100%;
    width: 100%;
    overflow: hidden;

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 15px;
      height: 100%;
    }

    .display-zone {
      width: 100%;

      &-info {
        display: flex;
        gap: 10px;
        align-items: flex-start;

        &-left,
        &-right {
          width: 60px;
          position: relative;
        }

        &-center {
          flex: 1;
          .display-words {
            width: 100%;
          }
        }

        &-right {
          .close-circle {
            padding-top: 10px;
            right: -5px;
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
      width: 85%;
      display: flex;
      gap: 20px;

      & > * {
        width: 100%;
      }
    }
  }
}
</style>
