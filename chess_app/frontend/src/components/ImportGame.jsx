import { useState, useRef } from 'react';
import { chessApi } from '../services/api.js';
import './ImportGame.css';

const SAMPLE_PGN = `[Event "Casual Game"]
[Site "Online"]
[Date "2024.01.15"]
[Round "1"]
[White "Magnus Carlsen"]
[Black "Hikaru Nakamura"]
[Result "1-0"]
[ECO "C42"]

1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 d5 6. Bd3 Bd6 7. O-O O-O
8. c4 c6 9. Re1 Bf5 10. Qb3 Qd7 11. cxd5 cxd5 12. Nc3 Nxc3 13. bxc3 b6
14. Bf4 Bxf4 15. Qxb6 axb6 16. Bxf5 Qc7 17. Rab1 Qxc3 18. Bxh7+ Kxh7
19. Rb3 Qa5 20. Rh3+ Kg8 21. Rh8+ Kxh8 22. Re3 Rg8 23. Rh3+ Kg8 24. Rh8+ Kxh8
25. Re3 Rg8 26. Rh3+ Kg8 27. Rh8+`;

export default function ImportGame({ onGameCreated, addToast }) {
  const [pgn, setPgn] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pgn.trim()) {
      addToast('Please enter PGN text.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await chessApi.createGame(pgn);
      setPgn('');
      onGameCreated();
    } catch (err) {
      addToast(`Import failed: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const loadSample = () => {
    setPgn(SAMPLE_PGN);
    addToast('Sample PGN loaded!', 'info');
  };

  const clearPgn = () => {
    setPgn('');
    textareaRef.current?.focus();
  };

  return (
    <div className="import-game">
      <div className="import-card">
        <div className="import-header">
          <h2 className="section-title">Import PGN</h2>
          <p className="import-subtitle">
            Paste your Portable Game Notation text below to analyze a chess game.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="import-form">
          <div className="pgn-input-wrapper">
            <textarea
              ref={textareaRef}
              className="pgn-textarea"
              placeholder="Paste PGN here...&#10;&#10;Example:&#10;1. e4 e5 2. Nf3 Nc6..."
              value={pgn}
              onChange={(e) => setPgn(e.target.value)}
              rows={12}
              spellCheck={false}
            />
            {pgn && (
              <button
                type="button"
                className="pgn-clear"
                onClick={clearPgn}
                title="Clear PGN"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          <div className="import-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !pgn.trim()}
            >
              {submitting ? (
                <>
                  <div className="spinner-sm" />
                  Importing...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Import Game
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadSample}
            >
              Load Sample
            </button>
          </div>
        </form>

        {pgn && (
          <div className="pgn-preview">
            <h4 className="preview-title">Character Count</h4>
            <div className="preview-stats">
              <div className="stat-badge">
                <span className="stat-value">{pgn.length}</span>
                <span className="stat-label">chars</span>
              </div>
              <div className="stat-badge">
                <span className="stat-value">{pgn.split(/\d+\.\s*/).length - 1}</span>
                <span className="stat-label">moves (est)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
