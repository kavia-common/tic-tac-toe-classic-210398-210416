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
  <div class="board-grid">
    <button
      v-for="(value, idx) in props.board"
      :key="idx"
      class="board-cell"
      :class="{
        disabled: props.disabled || value !== null,
        // Guarded: only highlight when winningSet contains the index
        win: winningSet.has(idx)
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
