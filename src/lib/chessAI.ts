import { Chess, Move, PieceSymbol } from 'chess.js'

export type Difficulty = 'easy' | 'medium' | 'hard'

const DIFFICULTY_SETTINGS: Record<Difficulty, { depth: number; timeBudgetMs: number; randomness: number }> = {
  easy: { depth: 1, timeBudgetMs: 400, randomness: 0.45 },
  medium: { depth: 2, timeBudgetMs: 800, randomness: 0 },
  hard: { depth: 3, timeBudgetMs: 1400, randomness: 0 },
}

const PIECE_VALUES: Record<PieceSymbol, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 }

/** Material + light positional heuristics — enough to play sensible, not
 * grandmaster, chess. Positive favors white, negative favors black. */
function evaluate(chess: Chess): number {
  if (chess.isCheckmate()) return chess.turn() === 'w' ? -100000 : 100000
  if (chess.isDraw() || chess.isStalemate()) return 0

  let score = 0
  const board = chess.board()
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = board[r][c]
      if (!sq) continue
      let value = PIECE_VALUES[sq.type]
      const centerDist = Math.abs(3.5 - r) + Math.abs(3.5 - c)
      value += (3.5 - centerDist) * 3
      if (sq.type === 'p') {
        const advance = sq.color === 'w' ? 7 - r : r
        value += advance * 6
      }
      score += sq.color === 'w' ? value : -value
    }
  }
  return score
}

function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => (b.captured ? PIECE_VALUES[b.captured] : 0) - (a.captured ? PIECE_VALUES[a.captured] : 0))
}

function minimax(chess: Chess, depth: number, alpha: number, beta: number, maximizing: boolean, deadline: number): number {
  if (Date.now() > deadline || depth === 0 || chess.isGameOver()) return evaluate(chess)

  const moves = orderMoves(chess.moves({ verbose: true }))
  if (maximizing) {
    let best = -Infinity
    for (const m of moves) {
      chess.move(m)
      best = Math.max(best, minimax(chess, depth - 1, alpha, beta, false, deadline))
      chess.undo()
      alpha = Math.max(alpha, best)
      if (beta <= alpha || Date.now() > deadline) break
    }
    return best
  }
  let best = Infinity
  for (const m of moves) {
    chess.move(m)
    best = Math.min(best, minimax(chess, depth - 1, alpha, beta, true, deadline))
    chess.undo()
    beta = Math.min(beta, best)
    if (beta <= alpha || Date.now() > deadline) break
  }
  return best
}

/** Searches for the strongest move available for the side to move. */
export function findBestMove(chess: Chess, depth: number, timeBudgetMs: number): Move | null {
  const moves = orderMoves(chess.moves({ verbose: true }))
  if (moves.length === 0) return null

  const maximizing = chess.turn() === 'w'
  const deadline = Date.now() + timeBudgetMs
  let best: Move = moves[0]
  let bestScore = maximizing ? -Infinity : Infinity

  for (const m of moves) {
    chess.move(m)
    const val = minimax(chess, depth - 1, -Infinity, Infinity, !maximizing, deadline)
    chess.undo()
    if (maximizing ? val > bestScore : val < bestScore) {
      bestScore = val
      best = m
    }
    if (Date.now() > deadline) break
  }
  return best
}

/** Picks the computer's move for the given difficulty — weaker levels search
 * shallower and occasionally play a random legal move instead of the best one. */
export function chooseComputerMove(chess: Chess, difficulty: Difficulty): Move | null {
  const settings = DIFFICULTY_SETTINGS[difficulty]
  const moves = chess.moves({ verbose: true })
  if (moves.length === 0) return null

  if (settings.randomness > 0 && Math.random() < settings.randomness) {
    return moves[Math.floor(Math.random() * moves.length)]
  }
  return findBestMove(chess, settings.depth, settings.timeBudgetMs) ?? moves[0]
}

/** A quick, fixed-strength suggestion for the human player's hint button. */
export function findHint(chess: Chess): Move | null {
  return findBestMove(chess, 2, 700)
}
