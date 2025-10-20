export type Player = 'X' | 'O'
export type Cell = Player | null
export type Board = Cell[]

export interface Scores {
  X: number
  O: number
  draws: number
}

export interface GameState {
  board: Board
  currentPlayer: Player
  gameOver: boolean
  winner: Player | 'draw' | null
  winningLine: number[] | null
  opponentMode: 'human' | 'ai'
  scores: Scores
}

export interface AuditEntry {
  userLabel: 'Player X' | 'Player O' | 'System'
  actionType: 'MOVE' | 'NEW_GAME' | 'RESET_SCORES' | 'TOGGLE_OPPONENT' | 'ERROR'
  payload?: Record<string, unknown>
  beforeState?: Partial<GameState>
  afterState?: Partial<GameState>
  timestamp: string
}
