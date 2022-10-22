<template>
  <svg
    class="typing-game-panel"
    viewBox="0 0 1000 470"
    width="1000"
    height="470"
    xmlns="http://www.w3.org/2000/svg"
  >
    <PartsLineGauge
      class="line-gauge"
      :limit="typing.goalCharCount || typing.totalCharCount || 0"
      :used="typing.totalTypeCorrect"
    />
    <foreignObject class="typing-game" width="1000" height="470">
      <div class="wrapper">
        <div class="display-zone">
          <div class="display-zone-info">
            <div class="display-zone-info-left">
              <PartsTimeCircle
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
              <PartsTimeClock
                v-else
                :time="typing.timeUse"
                @click="pauseToggle"
              />
            </div>
            <div class="display-zone-info-center">
              <div class="display-words-info" :class="infoClass">
                <span class="display-words-info-text" v-text="infoState.info" />
              </div>
              <ModKbdDisplayWords
                v-if="!!infoState.word"
                width="100%"
                class="display-words-info2"
                :word="infoState"
                :char-mode="false"
              />
              <ModKbdDisplayWords
                width="100%"
                class="display-words-word"
                :word="current.wordState"
              />
            </div>
            <div class="display-zone-info-right">
              <div class="close-circle">
                <PartsCloseCircle tabindex="-1" @click="cancel" />
              </div>
            </div>
          </div>
        </div>
        <div class="hands">
          <ModKbdHandMap :hand-numbers="leftHands" />
          <ModKbdHandMap :hand-numbers="rightHands" />
        </div>
        <div class="keyboard-zone">
          <ModKbdTypingKeyboard
            :type-key="typeKey"
            :setting="setting"
            :keys="keys"
          />
        </div>
      </div>
    </foreignObject>
  </svg>
</template>

<script setup lang="ts">
import { JISKeys } from '~~/libs/JISKeys'
import { GameSetting, TypingGame } from '~~/libs/TypingGame'
import { TypingGameWordData } from '~~/libs/TypingGameWordData'
import { TypingGameWordInfoState } from '~~/libs/TypingGameWordStates'
import { TypingProblemQuestioner } from '~~/libs/TypingProblemQuestioner'

const props = defineProps<{
  typing: Readonly<TypingGame>;
}>()

const keys = new JISKeys()

const problem = computed(
  () => props.typing.problem ?? ({} as TypingProblemQuestioner)
)
const setting = computed(() => problem.value.setting ?? ({} as GameSetting))
const current = computed(
  () => props.typing.current ?? ({} as TypingGameWordData)
)
const infoState = computed(
  () => current.value.infoState ?? ({} as TypingGameWordInfoState)
)

const typeKey = computed(() => current.value.wordState?.current ?? '')
const handNumber = computed(() => keys.getHandIdx(typeKey.value))

const leftHands = computed(() => [
  handNumber.value,
  keys.isShiftRightKey(typeKey.value) ? 1 : 0
])

const rightHands = computed(() => [
  handNumber.value - 5,
  keys.isShiftLeftKey(typeKey.value) ? 5 : 0
])

const infoClass = computed(() => {
  const chars = infoState.value.info?.length || 0
  const n = [10, 20, 30, 40, 50, 100, 200, 300].find(c => chars <= c) || 0
  const type = problem.value.type ?? 'unknown'
  return { [`chars-${n}`]: true, [type]: true }
})

onBeforeUnmount(() => props.typing?.dispose())

function cancel () {
  props.typing.cancel()
}

function pauseToggle () {
  if (props.typing.isRunning) {
    props.typing.pause()
  } else if (props.typing.isPausing) {
    props.typing.resume()
  }
}
</script>

<style lang="scss" scoped>
.typing-game-panel {
  box-shadow: 3px 3px 9px rgba(0, 0, 0, 0.4);
  border: 2px solid #333;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
  // backdrop-filter: blur(20px);

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
      width: 98%;
    }

    .hands {
      height: 15px;
      width: 90%;
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
