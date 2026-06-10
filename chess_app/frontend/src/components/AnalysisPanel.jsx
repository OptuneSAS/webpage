import { useState } from 'react';
import { GameProvider, useGame } from '../hooks/GameContext.jsx';
import StockfishPanel from './StockfishPanel.jsx';
import AICommentaryPanel from './AICommentaryPanel.jsx';
import './AnalysisPanel.css';

export default function AnalysisPanel({ game }) {
  return (
    <GameProvider game={game} initialMoves={game?.moves || []}>
      <AnalysisPanelInner />
    </GameProvider>
  );
}

function AnalysisPanelInner() {
  const {
    moves,
    currentMoveIndex,
    fen,
    navigateTo,
  } = useGame();

  const [viewMode, setViewMode] = useState('analysis'); // 'analysis' | 'commentary'

  return (
    <div className="analysis-panel">
      {/* View Mode Tabs */}
      <div className="analysis-tabs">
        <button
          className={`tab-btn ${viewMode === 'analysis' ? 'tab-active' : ''}`}
          onClick={() => setViewMode('analysis')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Engine Analysis
        </button>
        <button
          className={`tab-btn ${viewMode === 'commentary' ? 'tab-active' : ''}`}
          onClick={() => setViewMode('commentary')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          AI Commentary
        </button>
      </div>

      {/* Move Navigator Card */}
      <div className="analysis-card">
        <h3 className="analysis-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Move Navigator
        </h3>
        <p className="analysis-subtitle">
          Step through moves, then analyse with Stockfish or get AI-powered insights.
        </p>

        {/* Navigation Controls */}
        <div className="move-navigator">
          <div className="nav-controls">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigateTo(0)}
              disabled={currentMoveIndex === 0}
              title="Start"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="19 20 9 12 19 4 19 20"/><line y1="4" x2="5" y2="20" x1="5"/>
              </svg>
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigateTo(currentMoveIndex - 1)}
              disabled={currentMoveIndex <= 0}
              title="Previous move"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <span className="move-counter">
              <span className="move-counter-num">{Math.max(0, currentMoveIndex)}</span>
              <span className="move-counter-div">/</span>
              <span className="move-counter-total">{moves.length}</span>
              <span className="move-counter-label">moves</span>
            </span>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigateTo(currentMoveIndex + 1)}
              disabled={currentMoveIndex >= moves.length}
              title="Next move"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigateTo(moves.length)}
              disabled={currentMoveIndex >= moves.length}
              title="End"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
              </svg>
            </button>
          </div>

          <div className="nav-move-info">
            {currentMoveIndex > 0 ? (
              <span className="current-san">
                <span className="move-num">{Math.ceil(currentMoveIndex / 2)}.</span>
                {moves[currentMoveIndex - 1]}
              </span>
            ) : (
              <span className="current-san starting">Starting position</span>
            )}
          </div>
        </div>

        {/* Quick Move Chips */}
        <div className="move-chips">
          {moves.slice(0, 24).map((move, i) => (
            <button
              key={i}
              className={`chip ${i + 1 === currentMoveIndex ? 'chip-active' : ''}`}
              onClick={() => navigateTo(i + 1)}
            >
              {i % 2 === 0 && <span className="chip-num">{Math.floor(i / 2) + 1}.</span>}
              {move}
            </button>
          ))}
          {moves.length > 24 && (
            <span className="chip-more">+{moves.length - 24} more</span>
          )}
        </div>

        {/* FEN Display */}
        <div className="fen-display">
          <span className="fen-label">FEN</span>
          <code className="fen-text">{fen}</code>
        </div>
      </div>

      {/* Stockfish Deep Analysis Panel */}
      {viewMode === 'analysis' && <StockfishPanel />}

      {/* AI Commentary Panel */}
      {viewMode === 'commentary' && <AICommentaryPanel />}
    </div>
  );
}
