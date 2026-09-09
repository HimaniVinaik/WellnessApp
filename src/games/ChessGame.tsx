import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess, Move, PieceSymbol, Square } from 'chess.js'
import { useAppData } from '../context/AppDataContext'
import { chooseComputerMove, Difficulty, findHint } from '../lib/chessAI'
import Icon from '../components/Icon'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']
const GLYPHS: Record<PieceSymbol, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }

function squareAt(row: number, col: number): Square {
  return (FILES[col] + RANKS[row]) as Square
}

type Phase = 'setup' | 'playing' | 'done'

export default function ChessGame({ onExit }: { onExit: () => void }) {
  const { logGameScore } = useAppData()
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w')
  const [phase, setPhase] = useState<Phase>('setup')
  const [, setVersion] = useState(0)
  const [selected, setSelected] = useState<Square | null>(null)
  const [legalTargets, setLegalTargets] = useState<Square[]>([])
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null)
  const [hint, setHint] = useState<{ from: Square; to: Square } | null>(null)
  const [thinking, setThinking] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [resultLogged, setResultLogged] = useState(false)

  const chessRef = useRef(new Chess())
  const aiTimeoutRef = useRef<number | null>(null)

  const rerender = () => setVersion((v) => v + 1)

  useEffect(
    () => () => {
      if (aiTimeoutRef.current) window.clearTimeout(aiTimeoutRef.current)
    },
    []
  )

  function updateStatus() {
    const chess = chessRef.current
    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'Black' : 'White'
      setStatusText(`Checkmate — ${winner} wins`)
    } else if (chess.isStalemate()) {
      setStatusText('Stalemate — draw')
    } else if (chess.isDraw()) {
      setStatusText('Draw')
    } else if (chess.isCheck()) {
      setStatusText(`${chess.turn() === 'w' ? 'White' : 'Black'} is in check`)
    } else {
      setStatusText('')
    }
  }

  function maybeFinishGame() {
    const chess = chessRef.current
    if (!chess.isGameOver()) return false
    setPhase('done')
    if (!resultLogged) {
      setResultLogged(true)
      const scoreByDifficulty = { easy: 60, medium: 100, hard: 150 }[difficulty]
      let outcome = 'Draw'
      let score = 20
      if (chess.isCheckmate()) {
        const winnerColor = chess.turn() === 'w' ? 'b' : 'w'
        if (winnerColor === playerColor) {
          outcome = 'Win'
          score = scoreByDifficulty
        } else {
          outcome = 'Loss'
          score = 0
        }
      }
      logGameScore('chess', score, `${outcome} vs computer (${difficulty})`)
    }
    return true
  }

  function scheduleComputerMove() {
    const chess = chessRef.current
    if (chess.isGameOver() || chess.turn() === playerColor) return
    setThinking(true)
    aiTimeoutRef.current = window.setTimeout(() => {
      const move = chooseComputerMove(chess, difficulty)
      if (move) {
        chess.move(move)
        setLastMove({ from: move.from, to: move.to })
      }
      setThinking(false)
      updateStatus()
      rerender()
      maybeFinishGame()
    }, 260)
  }

  function start() {
    if (aiTimeoutRef.current) window.clearTimeout(aiTimeoutRef.current)
    chessRef.current = new Chess()
    setSelected(null)
    setLegalTargets([])
    setLastMove(null)
    setHint(null)
    setThinking(false)
    setStatusText('')
    setResultLogged(false)
    setPhase('playing')
    rerender()
    if (playerColor === 'b') scheduleComputerMove()
  }

  function exitGame() {
    if (aiTimeoutRef.current) window.clearTimeout(aiTimeoutRef.current)
    onExit()
  }

  function resign() {
    if (resultLogged) return
    setResultLogged(true)
    logGameScore('chess', 0, `Resigned vs computer (${difficulty})`)
    setPhase('done')
    setStatusText('You resigned')
  }

  function selectSquare(sq: Square) {
    const chess = chessRef.current
    if (phase !== 'playing' || thinking || chess.turn() !== playerColor) return
    const piece = chess.get(sq)

    if (selected && legalTargets.includes(sq)) {
      const moved = chess.move({ from: selected, to: sq, promotion: 'q' })
      if (moved) {
        setLastMove({ from: moved.from, to: moved.to })
        setSelected(null)
        setLegalTargets([])
        setHint(null)
        updateStatus()
        rerender()
        if (!maybeFinishGame()) scheduleComputerMove()
      }
      return
    }

    if (piece && piece.color === playerColor) {
      setSelected(sq)
      setLegalTargets(chess.moves({ square: sq, verbose: true }).map((m: Move) => m.to))
    } else {
      setSelected(null)
      setLegalTargets([])
    }
  }

  function requestHint() {
    const chess = chessRef.current
    if (phase !== 'playing' || thinking || chess.turn() !== playerColor) return
    const move = findHint(chess)
    if (move) setHint({ from: move.from, to: move.to })
  }

  const rowOrder = playerColor === 'b' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]
  const colOrder = playerColor === 'b' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]

  const kingInCheckSquare = useMemo(() => {
    const chess = chessRef.current
    if (!chess.isCheck()) return null
    const turn = chess.turn()
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = chess.get(squareAt(r, c))
        if (p && p.type === 'k' && p.color === turn) return squareAt(r, c)
      }
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusText])

  if (phase === 'setup') {
    return (
      <div className="stage">
        <h2 style={{ marginTop: 0 }}>Chess</h2>
        <p className="hint">Play a full game of chess against the computer. Use the hint button any time you're stuck.</p>
        <div className="section-title">Difficulty</div>
        <div className="row" style={{ marginBottom: 18 }}>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              className={`duration-chip ${difficulty === d ? 'active' : ''}`}
              onClick={() => setDifficulty(d)}
              type="button"
              style={{ textTransform: 'capitalize' }}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="section-title">Play as</div>
        <div className="row" style={{ marginBottom: 18 }}>
          <button className={`duration-chip ${playerColor === 'w' ? 'active' : ''}`} onClick={() => setPlayerColor('w')}>
            White
          </button>
          <button className={`duration-chip ${playerColor === 'b' ? 'active' : ''}`} onClick={() => setPlayerColor('b')}>
            Black
          </button>
        </div>
        <button className="btn btn-primary btn-block" onClick={start}>
          Start game
        </button>
        <button className="btn btn-ghost btn-block" onClick={onExit}>
          Back to games
        </button>
      </div>
    )
  }

  const chess = chessRef.current

  return (
    <div className="stage">
      <div className="game-toolbar">
        <button className="game-toolbar-btn" onClick={exitGame}>
          <Icon name="arrowLeft" size={15} strokeWidth={2} />
          Back
        </button>
        <button className="game-toolbar-btn" onClick={start}>
          <Icon name="rotate" size={15} strokeWidth={2} />
          Restart
        </button>
      </div>

      <div className="row-between" style={{ marginBottom: 6 }}>
        <span className="pill" style={{ textTransform: 'capitalize' }}>
          {difficulty}
        </span>
        <span className="hint" style={{ margin: 0 }}>
          {thinking ? 'Computer thinking…' : phase === 'done' ? 'Game over' : chess.turn() === playerColor ? 'Your move' : "Computer's move"}
        </span>
      </div>

      <div className="chess-board-wrap">
        <div className="chess-board">
          {rowOrder.map((r) => (
            <div className="chess-row" key={r}>
              {colOrder.map((c) => {
                const sq = squareAt(r, c)
                const piece = chess.get(sq)
                const isDark = (r + c) % 2 === 1
                const isSelected = selected === sq
                const isLegal = legalTargets.includes(sq)
                const isLastMove = lastMove && (lastMove.from === sq || lastMove.to === sq)
                const isHint = hint && (hint.from === sq || hint.to === sq)
                const isCheckSquare = kingInCheckSquare === sq
                const showFileLabel = playerColor === 'b' ? r === 0 : r === 7
                const showRankLabel = playerColor === 'b' ? c === 7 : c === 0

                return (
                  <div
                    key={sq}
                    className={[
                      'chess-square',
                      isDark ? 'dark' : '',
                      isSelected ? 'selected' : '',
                      isLastMove ? 'last-move' : '',
                      isCheckSquare ? 'in-check' : '',
                      isHint ? 'hint' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => selectSquare(sq)}
                  >
                    {piece && (
                      <span className={`chess-piece ${piece.color === 'w' ? 'white' : 'black'}`}>{GLYPHS[piece.type]}</span>
                    )}
                    {isLegal && (piece ? <span className="legal-ring" /> : <span className="legal-dot" />)}
                    {(showFileLabel || showRankLabel) && (
                      <span className="coord">
                        {showFileLabel ? FILES[c] : ''}
                        {showRankLabel ? RANKS[r] : ''}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="chess-status-bar">{statusText}</div>
      </div>

      {phase === 'playing' && (
        <div className="row" style={{ marginTop: 4 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={requestHint} disabled={thinking || chess.turn() !== playerColor}>
            Hint
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={resign}>
            Resign
          </button>
        </div>
      )}

      {phase === 'done' && (
        <>
          <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={start}>
            Play again
          </button>
          <button className="btn btn-ghost btn-block" onClick={onExit}>
            Back to games
          </button>
        </>
      )}
    </div>
  )
}
