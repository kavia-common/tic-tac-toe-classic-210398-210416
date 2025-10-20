<!--
============================================================================
REQUIREMENT TRACEABILITY
============================================================================
Requirement ID: REQ-TTT-001
User Story: As a user I want to play Tic-Tac-Toe vs human or AI with scores.
Acceptance Criteria: 3x3 board; H2H and AI modes; scoreboard; controls; audit panel.
GxP Impact: NO - Demo only; includes scaffolding for audit concepts.
Risk Level: LOW
Validation Protocol: VP-TTT-001 (unit tests for core logic)
============================================================================
-->
<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import ControlsBar from '@/components/ControlsBar.vue'
import AuditPanel from '@/components/AuditPanel.vue'
import { useTicTacToe } from '@/composables/useTicTacToe'
import { useAuditTrail } from '@/composables/useAuditTrail'

// init composables
const audit = useAuditTrail()
const game = useTicTacToe(audit)

const showAudit = ref(false)

const onCellClick = (index: number) => {
  game.makeMove(index)
}

const onNewGame = () => {
  game.newGame()
}

const onResetScores = () => {
  game.resetScores()
}

const onToggleOpponent = () => {
  game.toggleOpponent()
}
</script>

<template>
  <div class="grid lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2">
      <div class="panel mb-4">
        <div class="panel-header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Current Player:</span>
            <span class="badge" :style="{ backgroundColor: game.currentPlayer === 'X' ? '#2563EB' : '#F59E0B', color: 'white' }">
              {{ game.currentPlayer }}
            </span>
          </div>
          <div v-if="game.gameOver" class="result-banner">
            <span v-if="game.winner === 'draw'" class="text-gray-700">Draw game</span>
            <span v-else class="text-gray-700">Winner: <strong>{{ game.winner }}</strong></span>
          </div>
        </div>
        <div class="panel-body">
          <GameBoard
            :board="game.board"
            :disabled="game.gameOver"
            :winning-line="game.winningLine"
            @cell-click="onCellClick"
          />
        </div>
      </div>

      <ControlsBar
        :opponent-mode="game.opponentMode"
        @new-game="onNewGame"
        @reset-scores="onResetScores"
        @toggle-opponent="onToggleOpponent"
        @toggle-audit="showAudit = !showAudit"
        :audit-open="showAudit"
      />

      <transition name="collapse">
        <AuditPanel v-if="showAudit" class="mt-4" :entries="audit.entries" />
      </transition>
    </div>

    <div class="lg:col-span-1">
      <ScoreBoard
        class="w-full"
        :x-wins="game.scores.X"
        :o-wins="game.scores.O"
        :draws="game.scores.draws"
      />
      <div class="mt-4 card p-4 text-sm text-gray-600">
        <p class="font-semibold mb-2">How to play</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>Click a cell to place your mark.</li>
          <li>Toggle Opponent to play vs AI.</li>
          <li>New Game keeps scores; Reset Scores clears them.</li>
          <li>Open Audit Trail to view session events.</li>
        </ul>
      </div>
    </div>
  </div>
</template>
