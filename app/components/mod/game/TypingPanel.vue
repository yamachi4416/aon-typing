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
      :limit="state.goalCharCount || state.totalCharCount || 0"
      :used="state.totalTypeCorrect"
    />
    <foreignObject :class="$style.typing" width="1000" height="470">
      <div>
        <div :class="$style['typing-display']">
          <div>
            <div :class="$style['typing-display-left']">
              <PartsTimeCircle
                v-if="state.timeLimit > 0"
                :total-time="state.timeLimit"
                :time="state.timeUse"
                :text="remainingTime || 'END'"
                @click="emit('toggle')"
              />
              <PartsTimeClock
                v-else
                :time="state.timeUse"
                @click="emit('toggle')"
              />
            </div>
            <div :class="$style['typing-display-center']">
              <div
                :class="$style['typing-display-info1']"
                :data-type="problem?.type"
                :data-scale="infoScale"
              >
                <span v-text="infoState?.info" />
              </div>
              <ModKbdDisplayWords
                v-if="infoState?.word"
                width="100%"
                :class="$style['typing-display-info2']"
                :word="infoState"
              />
              <ModKbdDisplayWords
                width="100%"
                :class="$style['typing-display-words']"
                :word="current?.wordState"
              />
            </div>
            <div :class="$style['typing-display-right']">
              <div :class="$style['close-circle']">
                <PartsCloseCircle tabindex="-1" @click="emit('cancel')" />
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
import type { TypingGameState } from '~~/libs/TypingGameState'

const props = defineProps<{
  state: Readonly<TypingGameState>
}>()

const emit = defineEmits<{
  (e: 'toggle' | 'cancel' | 'dispose'): unknown
}>()

const typingState = computed(() => props.state.currentTypingState)
const problem = computed(() => props.state.problem)
const setting = computed(() => props.state.setting)
const current = computed(() => props.state.currentWord)
const infoState = computed(() => current.value?.infoState)
const typeKey = computed(() => current.value?.wordState.current ?? '')

const keys = computed(() => {
  const isCapsLock = typingState.value.detail?.capsLock ?? false
  const layout = getKeyLayout(setting.value.keyLayout ?? 'NULL')
  return isCapsLock ? layout.getCapsLockKeys()! : layout
})

const remainingTime = computed(() =>
  props.state.timeLimit - props.state.timeUse
    ? Math.trunc((props.state.timeLimit - props.state.timeUse) / 1000 + 1)
    : 0,
)

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

const infoScale = computed(() => {
  const chars = Array.from(infoState.value?.info ?? []).length
  return [10, 20, 30, 40, 50, 100, 200, 300].find((c) => chars <= c) || 0
})

onBeforeUnmount(() => emit('dispose'))
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

  &[data-type='english'] {
    font-size: 1.2em;
    line-height: 1.4;
  }

  $scales: 10, 20, 30, 40, 50, 100, 200, 300;

  @each $scale in $scales {
    $index: list.index($scales, $scale);
    $diff: ($index - 1) * 0.1em;

    &[data-scale='#{$scale}'] {
      font-size: 1.5em - $diff;

      &[data-type='english'] {
        font-size: 1.6em - $diff;
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
