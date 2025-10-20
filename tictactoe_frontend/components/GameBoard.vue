<!--
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-002
User Story: Render an interactive 3x3 board with hover and disabled states.
Acceptance Criteria: Responsive grid, ignore clicks when disabled or occupied.
GxP Impact: NO - UI; includes validation within handlers.
Risk Level: LOW
Validation Protocol: VP-TTT-001
============================================================================
-->
<script setup lang="ts">
import type { Cell } from '@/types/game'
import { computed } from 'vue'

/**
 * Strictly type props with safe defaults and guard winningLine usage.
 * - board: required 9-length array of 'X' | 'O' | null
 * - disabled: optional boolean
 * - winningLine: optional number[] | null, coerced to [] for DOM class logic
 *
 * Layout:
 * - Uses Tailwind utilities: grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-sm aspect-square
 * - Each cell uses aspect-square to remain square and flex center for content.
 * - A CSS fallback (.board-grid/.board-cell) exists in assets/tailwind.css for environments without Tailwind utilities.
 *
 * Note: Avoid any JSON.stringify() or implicit stringification of reactive objects.
 * The template renders only primitive cell marks ('X' | 'O' | ''), ensuring hydration safety.
 */
const props = withDefaults(defineProps<{
  board: Array<Cell>,
  disabled?: boolean,
  winningLine?: number[] | null
}>(), {
  disabled: false,
  winningLine: null,
})

const emit = defineEmits<{
  'cell-click': [index: number]
}>()

/**
 * Prepare a Set for O(1) membership checks and to avoid calling includes on non-array.
 * When winningLine is null/undefined or not an array, treat as empty.
 */
const winningSet = computed<Set<number>>(() => {
  return Array.isArray(props.winningLine) ? new Set(props.winningLine) : new Set()
})

/**
 * Returns the primitive mark for display, guaranteeing no reactive/stringify usage.
 * This narrows any unexpected values to '' for safe rendering.
 */
function displayMark(cell: Cell): '' | 'X' | 'O' {
  return cell === 'X' || cell === 'O' ? cell : ''
}

// PUBLIC_INTERFACE
function onClickCell(index: number) {
  /** Handle safe cell click emitting only when allowed. */
  if (props.disabled) return
  if (!Array.isArray(props.board) || index < 0 || index >= props.board.length) return
  if (props.board[index] !== null) return
  emit('cell-click', index)
}
</script>

<template>
  <!-- Board container enforces a strict 3x3 grid, square overall, with uniform gaps -->
  <div
    class="grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-sm aspect-square mx-auto"
    role="grid"
    aria-label="Tic Tac Toe Board"
  >
    <button
      v-for="(value, idx) in props.board"
      :key="idx"
      role="gridcell"
      class="aspect-square flex items-center justify-center text-3xl font-semibold border rounded-lg cursor-pointer select-none shadow-sm bg-gradient-to-br from-blue-500/10 to-gray-50"
      :class="{
        'opacity-60 cursor-not-allowed': props.disabled || value !== null,
        'outline outline-2 outline-offset-0': winningSet.has(idx),
        'outline-[#F59E0B] shadow-[0_0_0_3px_rgba(245,158,11,0.2)]': winningSet.has(idx)
      }"
      @click="onClickCell(idx)"
      :aria-label="`Cell ${idx + 1}`"
    >
      <span :style="{ color: value === 'X' ? '#2563EB' : value === 'O' ? '#F59E0B' : 'inherit' }">
        {{ displayMark(value) }}
      </span>
    </button>
  </div>
</template>
