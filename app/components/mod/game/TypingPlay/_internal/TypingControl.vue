<template>
  <svg
    :class="$style.panel"
    viewBox="0 0 1000 470"
    width="1000"
    height="470"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="タイピング"
    :data-mistake="flashTypingMistake"
    :data-capslock="capsLock"
  >
    <LineGauge
      :class="$style['line-gauge']"
      :limit="state.goalCharCount || state.totalCharCount"
      :used="state.totalTypeCorrect"
    />
    <foreignObject :class="$style.typing" width="1000" height="470">
      <div>
        <div :class="$style['typing-display']">
          <div :class="$style['typing-display-left']">
            <TimeCircle
              v-if="state.timeLimit > 0"
              :time="state.timeUse"
              :time-limit="state.timeLimit"
              :title="toggleTitle"
              @click="emit('toggle')"
            />
            <TimeClock
              v-else
              :time="state.timeUse"
              :title="toggleTitle"
              @click="emit('toggle')"
            />
          </div>
          <DisplayWords
            :class="$style['typing-display-center']"
            :problem-type="state.problem?.type"
            :info-state="state.currentWord?.infoState"
            :word-state="state.currentWord?.wordState"
          />
          <div :class="$style['typing-display-right']">
            <PartsCloseCircle
              :class="$style['close-circle']"
              tabindex="-1"
              title="タイピングを中止する"
              @click="emit('cancel')"
            />
          </div>
        </div>
        <HandMap :keys :char />
        <Keyboard
          :class="$style['typing-keyboard']"
          :keys
          :char
          :clickable="state.setting.autoMode === 0"
        />
      </div>
    </foreignObject>
  </svg>
</template>

<script setup lang="ts">
import { getKeyLayout } from '~~/libs/Keys'
import type { TypingGameState } from '~~/libs/TypingGameState'
import { DisplayWords, HandMap, Keyboard, LineGauge, TimeCircle, TimeClock } from '.'

const { state } = defineProps<{
  state: Readonly<TypingGameState>
}>()

const emit = defineEmits<{
  toggle: []
  cancel: []
}>()

const char = computed(
  () => state.currentWord?.wordState.current,
)

const capsLock = computed(
  () => state.currentTypingState.detail?.capsLock ?? false,
)

const keys = computed(
  () => getKeyLayout(state.setting.keyLayout, capsLock.value),
)

const toggleTitle = computed(
  () => state.isPausing ? 'タイピングを再開する' : 'タイピングを一時停止する',
)

const { flash: flashTypingMistake } = useFlashing({
  watchSource: () => state.currentTypingState,
  valueGetter: (source) => source.mistake,
  defaultValue: false,
  timeout: 120,
})
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

  &[data-mistake='true'] {
    --color-p: var(--input-error-message);
    --keyboard-highlight: var(--input-error-message);
  }

  &[data-capslock='true'] {
    --keyboard-capslock-stroke: var(--color-3);
    --keyboard-capslock-fill: var(--keyboard-highlight);
  }
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
  display: flex;
  align-items: flex-start;
  width: 100%;
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

.close-circle {
  width: 35px;
  height: 35px;
  margin-top: -5px;
  margin-right: -5px;
}

.typing-keyboard {
  width: 98%;
}
</style>
