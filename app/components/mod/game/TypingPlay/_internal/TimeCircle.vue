<template>
  <svg
    viewBox="-31 -31 62 62"
    xmlns="http://www.w3.org/2000/svg"
    :class="$style.svg"
  >
    <g>
      <path :class="$style.used" :d="usedPath" />
      <path :class="$style.remain" :d="remainPath" />
      <circle
        :class="$style.center"
        :title
        cy="0"
        cx="0"
        r="20"
        @click="$emit('click')"
      />
      <text
        :class="$style.text"
        text-anchor="middle"
        dominant-baseline="central"
        x="0"
        y="0"
        v-text="dispText"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
defineEmits<{
  click: []
}>()

const {
  time,
  timeLimit,
} = defineProps<{
  time: number
  timeLimit: number
  title?: string
}>()

const dispText = computed(() =>
  timeLimit - time > 0
    ? String(Math.trunc((timeLimit - time) / 1000 + 1))
    : 'END',
)

const usedPath = computed(() => {
  const deg1 = 0
  const deg2 = (360 * time) / timeLimit
  return donut({ r: 30, cr: 20, mv: 0, fx: 10 }, { deg1, deg2 })
})

const remainPath = computed(() => {
  const deg1 = (360 * time) / timeLimit
  const deg2 = 360
  return donut({ r: 30, cr: 20, mv: 0, fx: 10 }, { deg1, deg2 })
})

function donut100({ r, cr, mv }: { r: number, cr: number, mv: number }) {
  return [
    `M0,${-cr - mv}`,
    `A${cr},${cr} 0 0 1 0,${cr + mv}`,
    `A${cr},${cr} 0 1 1 0,${-cr - mv}`,
    `M0,${-r - mv}`,
    `A${r},${r} 0 0 0 0,${r + mv}`,
    `A${r},${r} 0 1 0 0,${-r - mv}`,
    'Z',
  ].join(' ')
}

function donut(
  { r, cr, mv, fx }: { r: number, cr: number, mv: number, fx: number },
  { deg1, deg2 }: { deg1: number, deg2: number },
) {
  const round = (i: number) =>
    Math.round(i * Math.pow(10, fx)) / Math.pow(10, fx)
  if (round(deg2 - deg1) === 360) {
    return donut100({ r, cr, mv })
  }
  const deg0 = deg2 - deg1
  const rad0 = ((deg1 + deg0 * 0.5 - 90) * Math.PI) / 180
  const rad1 = ((deg1 - 90) * Math.PI) / 180
  const rad2 = ((deg2 - 90) * Math.PI) / 180
  const r0 = cr + (deg0 / 180) * mv
  const r1 = r + (deg0 / 180) * mv
  const ox = round(Math.cos(rad0) * mv)
  const oy = round(Math.sin(rad0) * mv)
  const x0 = round(Math.cos(rad1) * r0 + ox)
  const y0 = round(Math.sin(rad1) * r0 + oy)
  const x1 = round(Math.cos(rad1) * r1 + ox)
  const y1 = round(Math.sin(rad1) * r1 + oy)
  const x2 = round(Math.cos(rad2) * r1 + ox)
  const y2 = round(Math.sin(rad2) * r1 + oy)
  const x3 = round(Math.cos(rad2) * r0 + ox)
  const y3 = round(Math.sin(rad2) * r0 + oy)
  const f = deg0 > 180 ? 1 : 0
  return [
    `M${x0},${y0}`,
    `L${x1},${y1}`,
    `A${r1},${r1} 0 ${f} 1 ${x2},${y2}`,
    `L${x3},${y3}`,
    `A${r0},${r0} 0 ${f} 0 ${x0},${y0}`,
    'Z',
  ].join(' ')
}
</script>

<style lang="scss" module>
.svg {
  user-select: none;
}

.used {
  fill: var(--color-p);
}

.remain {
  fill: var(--color-e);
}

.center {
  pointer-events: visible;
  cursor: pointer;
  fill: transparent;
}

.text {
  pointer-events: none;
  fill: var(--color-3);
}
</style>
