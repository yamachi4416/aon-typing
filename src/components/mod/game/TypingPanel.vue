<template>
  <svg
    :class="{
      [$style.panel]: true,
      [$style['panel-mistake']]: flashTypingMistake,
      [$style['panel-capslock']]: keys.isCapsLock,
    }"
    viewBox="0 0 1000 470"
    width="1000"
    height="470"
    xmlns="http://www.w3.org/2000/svg"
  >
    <PartsLineGauge
      :class="$style['line-gauge']"
      :limit="typing.goalCharCount || typing.totalCharCount || 0"
      :used="typing.totalTypeCorrect"
    />
    <foreignObject :class="$style.typing" width="1000" height="470">
      <div>
        <div :class="$style['typing-display']">
          <div>
            <div :class="$style['typing-display-left']">
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
            <div :class="$style['typing-display-center']">
              <div
                :class="$style['typing-display-info1']"
                :data-word-count="wordInfo1.count"
                :data-word-type="wordInfo1.type"
              >
                <span v-text="infoState.info" />
              </div>
              <ModKbdDisplayWords
                v-if="!!infoState.word"
                width="100%"
                :class="$style['typing-display-info2']"
                :word="infoState"
                :char-mode="false"
              />
              <ModKbdDisplayWords
                width="100%"
                :class="$style['typing-display-words']"
                :word="current.wordState"
              />
            </div>
            <div :class="$style['typing-display-right']">
              <div :class="$style['close-circle']">
                <PartsCloseCircle tabindex="-1" @click="cancel" />
              </div>
            </div>
          </div>
        </div>
        <div :class="$style['typing-hands']">
          <ModKbdHandMap :hand-numbers="handNumbers.L" />
          <ModKbdHandMap :hand-numbers="handNumbers.R" />
        </div>
        <div :class="$style['typing-keyboard']">
          <ModKbdTypingKeyboard
            v-if="keys"
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
import { getKeyLayout } from '~~/libs/Keys'
import type { TypingGame } from '~~/libs/TypingGame'

const props = defineProps<{
  typing: Readonly<TypingGame>
}>()

const typingState = computed(() => props.typing.currentTypingState)
const problem = orDefaultComputed(() => props.typing.problem, {})
const setting = orDefaultComputed(() => problem.value.setting, {})
const current = orDefaultComputed(() => props.typing.current, {})
const infoState = orDefaultComputed(() => current.value.infoState, {})
const typeKey = orDefaultComputed(() => current.value.wordState?.current, '')

const keys = computed(() => {
  const isCapsLock = typingState.value.detail?.capsLock ?? false
  const layout = getKeyLayout(setting.value.keyLayout ?? 'NULL')
  return isCapsLock ? layout.getCapsLockKeys()! : layout
})

const handNumbers = computed(() => {
  const handNumber = keys.value.getHandIdx(typeKey.value)
  return {
    L: [handNumber, keys.value.isShiftRightKey(typeKey.value) ? 1 : 0],
    R: [handNumber - 5, keys.value.isShiftLeftKey(typeKey.value) ? 5 : 0],
  }
})

const { flash: flashTypingMistake } = useFlashing({
  watchSource: typingState,
  valueGetter: (source) => source.mistake,
  defaultValue: false,
  timeout: 120,
})

const wordInfo1 = computed(() => {
  const chars = infoState.value.info?.length || 0
  const count = [10, 20, 30, 40, 50, 100, 200, 300].find((c) => chars <= c) || 0
  const type = problem.value.type
  return { count, type }
})

onBeforeUnmount(() => props.typing.dispose())

function cancel() {
  props.typing.cancel()
}

function pauseToggle() {
  if (props.typing.isRunning) {
    props.typing.pause()
  } else if (props.typing.isPausing) {
    props.typing.resume()
  }
}

function orDefaultComputed<T>(
  source: () => T,
  defaultValue: Exclude<Partial<T>, undefined>,
) {
  return computed(() => source() ?? (defaultValue as Exclude<T, undefined>))
}
</script>

<style lang="scss" module>
@use 'sass:list';

.panel {
  pointer-events: none;

  --keyboard-capslock-stroke: transparent;
  --keyboard-capslock-fill: transparent;

  background: var(--background-60);
  border: 2px solid var(--color-3);
  border-radius: 10px;
  box-shadow: var(--shadow-color-lg) 3px 3px 9px;
}

.panel-mistake {
  --color-p: var(--input-error-message);
  --keyboard-highlight: var(--input-error-message);
}

.panel-capslock {
  --keyboard-capslock-stroke: var(--color-3);
  --keyboard-capslock-fill: var(--keyboard-highlight);
}

.line-gauge {
  transform: translate(-1px, -1px);
}

.typing {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;

  & > * {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 15px;
  }
}

.typing-display {
  width: 100%;

  & > * {
    display: flex;
    align-items: flex-start;
  }
}

.typing-display-left {
  width: 60px;
}

.typing-display-center {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100px;
  overflow: hidden;

  & > * {
    width: 100%;
  }
}

.typing-display-right {
  display: flex;
  justify-content: flex-end;
  width: 60px;
}

.typing-display-info1 {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  line-height: 1.2;
  color: var(--color-6);
  white-space: pre-wrap;

  & > * {
    white-space: pre-wrap;
  }

  &[data-word-type='english'] {
    font-size: 1.2em;
    line-height: 1.4;
  }

  $word-counts: 10, 20, 30, 40, 50, 100, 200, 300;

  @each $count in $word-counts {
    $index: list.index($word-counts, $count);
    $size-diff: ($index - 1) * 0.1em;

    &[data-word-count='#{$count}'] {
      font-size: 1.5em - $size-diff;

      &[data-word-type='english'] {
        font-size: 1.6em - $size-diff;
      }
    }
  }
}

.typing-display-info2 {
  font-size: 1.1em;
  letter-spacing: 0.1em;
}

.typing-display-words {
  font-size: 1.5em;
  letter-spacing: 0.15em;
}

.close-circle {
  width: 35px;
  height: 35px;
  margin-top: -5px;
  margin-right: -5px;
}

.typing-hands {
  display: flex;
  gap: 20px;
  width: 90%;
  height: 15px;

  & > * {
    width: 100%;
  }
}

.typing-keyboard {
  width: 98%;
}
</style>
