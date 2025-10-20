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
const props = defineProps<{
  board: Array<'X' | 'O' | null>,
  disabled?: boolean,
  winningLine?: number[] | null
}>()

const emit = defineEmits<{
  'cell-click': [index: number]
}>()

// PUBLIC_INTERFACE
function onClickCell(index: number) {
  /** Handle safe cell click emitting only when allowed. */
  if (props.disabled) return
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
        win: props.winningLine && props.winningLine.includes(idx)
      }"
      @click="onClickCell(idx)"
      :aria-label="`Cell ${idx + 1}`"
    >
      <span :style="{ color: value === 'X' ? '#2563EB' : value === 'O' ? '#F59E0B' : 'inherit' }">
        {{ value ?? '' }}
      </span>
    </button>
  </div>
</template>
