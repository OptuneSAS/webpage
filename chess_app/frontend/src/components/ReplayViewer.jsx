import { useState, useEffect, useCallback } from 'react';
import { chessApi } from '../services/api.js';
import StockfishPanel from './StockfishPanel.jsx';
import AICommentaryPanel from './AICommentaryPanel.jsx';
import { GameProvider, useGame } from '../hooks/GameContext.jsx';
import './ReplayViewer.css';

const PIECE_SYMBOLS = {
  w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' },
  b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' }
};

export default function ReplayViewer({ game }) {
  return (
    <GameProvider game={game} initialMoves={game?.moves || []}>
      <ReplayViewerInner game={game} />
    </GameProvider>
  );
}

function ReplayViewerInner({ game }) {
  const {
    moves,
    currentMoveIndex,
    fen,
    navigateTo,
    stockfishResult,
    stockfishLoading,
  } = useGame();

  const [replayData, setReplayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const loadReplay = async () => {
      try {
        setLoading(true);
        const data = await chessApi.getReplay(game.id);
        if (active) {
          setReplayData(data);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadReplay();
    return () => { active = false; };
  }, [game.id]);

  const handlePrev = useCallback(() => {
    navigateTo(currentMoveIndex - 1);
  }, [navigateTo, currentMoveIndex]);

  const handleNext = useCallback(() => {
    navigateTo(currentMoveIndex + 1);
  }, [navigateTo, currentMoveIndex]);

  const handleFirst = useCallback(() => {
    navigateTo(-1);
  }, [navigateTo]);

  const handleLast = useCallback(() => {
    navigateTo(moves.length - 1);
  }, [navigateTo, moves]);

  // Keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  if (loading) {
    return (
      <div className="replay-loading">
        <div className="spinner" />
        <p>Loading replay timeline...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-banner">Failed to load replay: {error}</div>;
  }

  const replayMoves = replayData?.moves || [];
  const board = parseFen(fen);

  // Highlight last move squares
  let highlightFrom = null;
  let highlightTo = null;
  const currentReplayIdx = currentMoveIndex;
  if (currentReplayIdx >= 0 && replayMoves[currentReplayIdx]) {
    const uci = replayMoves[currentReplayIdx].uci;
    if (uci && uci.length >= 4) {
      highlightFrom = squareToIndices(uci.slice(0, 2));
      highlightTo = squareToIndices(uci.slice(2, 4));
    }
  }

  // Eval bar from Stockfish
  const evalScore = stockfishResult?.evaluation;
  const scoreCp = stockfishResult?.score_cp;
  const evalNorm = evalScore?.type === 'mate'
    ? (evalScore.value > 0 ? 1 : -1)
    : Math.max(-1, Math.min(1, (scoreCp || 0) / 1000));

  return (
    <div className="replay-viewer">
      {/* Header */}
      <div className="replay-header">
        <div className="replay-players-banner">
          <span className="player white-name">
            <span className="piece-dot w-dot"></span>
            {game.white || 'White'}
          </span>
          <span className="vs-tag">VS</span>
          <span className="player black-name">
            <span className="piece-dot b-dot"></span>
            {game.black || 'Black'}
          </span>
        </div>
        <div className="replay-meta-summary">
          <span className="meta-badge result-badge">{replayData?.result || '*'}</span>
          {game.event && <span className="meta-info">Event: {game.event}</span>}
          {game.date && <span className="meta-info">Date: {game.date}</span>}
        </div>
      </div>

      <div className="replay-layout">
        {/* Left: Board + Controls */}
        <div className="board-and-controls">
          {/* Board with Evaluation Bar */}
          <div className="board-with-eval">
            {/* Evaluation Bar Side */}
            <div className="replay-eval-bar">
              <div className="replay-eval-bg">
                <div
                  className="replay-eval-fill"
                  style={{ height: `${((1 - evalNorm) / 2) * 100}%` }}
                />
              </div>
              <div className="replay-eval-score">
                {stockfishResult ? (
                  <span className={`replay-eval-val ${stockfishLoading ? 'loading-pulse' : ''}`}>
                    {evalScore?.type === 'mate'
                      ? `M${Math.abs(evalScore.value)}`
                      : (scoreCp !== null ? `${(scoreCp / 100).toFixed(1)}` : '—')}
                  </span>
                ) : (
                  <span className="replay-eval-val muted">—</span>
                )}
              </div>
            </div>

            {/* Board */}
            <div className="board-container">
              <div className="chess-board-wrapper">
                <div className="coords-ranks">
                  {[8,7,6,5,4,3,2,1].map((r) => <span key={r}>{r}</span>)}
                </div>
                <div className="chess-board">
                  {board.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isDark = (rIdx + cIdx) % 2 === 1;
                      const isHighlighted =
                        (highlightFrom && highlightFrom.row === rIdx && highlightFrom.col === cIdx) ||
                        (highlightTo && highlightTo.row === rIdx && highlightTo.col === cIdx);
                      const isLastMoveFrom = highlightFrom && highlightFrom.row === rIdx && highlightFrom.col === cIdx;
                      const isLastMoveTo = highlightTo && highlightTo.row === rIdx && highlightTo.col === cIdx;
                      
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`board-square ${isDark ? 'square-dark' : 'square-light'} ${
                            isHighlighted ? 'square-highlight' : ''
                          } ${isLastMoveFrom ? 'square-from' : ''} ${isLastMoveTo ? 'square-to' : ''}`}
                        >
                          {cell && (
                            <span className={`chess-piece piece-${cell.color}`}>
                              {PIECE_SYMBOLS[cell.color][cell.type]}
                            </span>
                          )}
                          {isLastMoveTo && <div className="move-dot" />}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="coords-files">
                  {['a','b','c','d','e','f','g','h'].map((f) => <span key={f}>{f}</span>)}
                </div>
              </div>

              {/* Navigation */}
              <div className="replay-controls">
                <button className="btn btn-secondary btn-ctrl" onClick={handleFirst} disabled={currentMoveIndex < 0}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="19 20 9 12 19 4 19 20"/><line y1="4" x2="5" y2="20" x1="5"/>
                  </svg>
                </button>
                <button className="btn btn-secondary btn-ctrl" onClick={handlePrev} disabled={currentMoveIndex < 0}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <span className="control-indicator">
                  <strong>{currentMoveIndex + 1}</strong> / {replayMoves.length}
                </span>
                <button className="btn btn-secondary btn-ctrl" onClick={handleNext} disabled={currentMoveIndex >= replayMoves.length - 1}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <button className="btn btn-secondary btn-ctrl" onClick={handleLast} disabled={currentMoveIndex >= replayMoves.length - 1}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
                  </svg>
                </button>
              </div>
              <div className="hint-text">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4"/><path d="M12 17h.01"/>
                </svg>
                Tip: Use Left/Right Arrow keys to navigate
              </div>
            </div>
          </div>

          {/* Analysis panels below board */}
          <div className="replay-analysis-panels">
            <StockfishPanel />
            <AICommentaryPanel />
          </div>
        </div>

        {/* Right: Moves List */}
        <div className="moves-panel">
          <h3 className="panel-title">Move History</h3>
          <div className="moves-scroll-container">
            <div className="moves-list">
              <div
                className={`move-row-item ${currentMoveIndex === -1 ? 'active-move-row' : ''}`}
                onClick={() => navigateTo(-1)}
              >
                <span className="move-num-col">0.</span>
                <span className="move-text-col">Starting Position</span>
              </div>
              {chunkMoves(replayMoves).map((chunk, index) => {
                const whiteMoveIdx = index * 2;
                const blackMoveIdx = index * 2 + 1;
                return (
                  <div key={index} className="moves-chunk-row">
                    <span className="move-num-col">{index + 1}.</span>
                    <span
                      className={`move-text-col move-click ${currentMoveIndex === whiteMoveIdx ? 'active-move-row' : ''}`}
                      onClick={() => navigateTo(whiteMoveIdx)}
                    >
                      {chunk.white.san}
                    </span>
                    {chunk.black ? (
                      <span
                        className={`move-text-col move-click ${currentMoveIndex === blackMoveIdx ? 'active-move-row' : ''}`}
                        onClick={() => navigateTo(blackMoveIdx)}
                      >
                        {chunk.black.san}
                      </span>
                    ) : (
                      <span className="move-text-col empty-move">—</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function parseFen(fen) {
  const [position] = fen.split(' ');
  const rows = position.split('/');
  const board = [];
  for (let r = 0; r < 8; r++) {
    const row = [];
    const fenRow = rows[r];
    for (let c = 0; c < fenRow.length; c++) {
      const char = fenRow[c];
      if (isNaN(char)) {
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const type = char.toLowerCase();
        row.push({ type, color });
      } else {
        const emptyCount = parseInt(char, 10);
        for (let e = 0; e < emptyCount; e++) row.push(null);
      }
    }
    board.push(row);
  }
  return board;
}

function squareToIndices(square) {
  if (!square || square.length < 2) return null;
  const col = square.charCodeAt(0) - 97;
  const row = 8 - parseInt(square[1], 10);
  return { row, col };
}

function chunkMoves(moves) {
  const chunks = [];
  for (let i = 0; i < moves.length; i += 2) {
    chunks.push({
      white: moves[i],
      black: moves[i + 1] || null,
    });
  }
  return chunks;
}
