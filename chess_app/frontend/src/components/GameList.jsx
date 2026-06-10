import './GameList.css';

function GameCard({ game, onSelect, onReplay, onDelete }) {
  const dateStr = game.date
    ? new Date(game.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown date';

  const resultClass =
    game.result === '1-0' ? 'result-white' :
    game.result === '0-1' ? 'result-black' :
    game.result === '1/2-1/2' ? 'result-draw' : '';

  return (
    <div className="game-card" onClick={() => onSelect(game.id)}>
      <div className="game-card-header">
        <span className="game-result-badge">
          <span className={`result-dot ${resultClass}`} />
          {game.result}
        </span>
        <span className="game-event">{game.event || 'Casual Game'}</span>
      </div>

      <div className="game-players">
        <div className="player-row white-player">
          <span className="player-piece">♔</span>
          <span className="player-name">{game.white}</span>
        </div>
        <div className="vs-divider">vs</div>
        <div className="player-row black-player">
          <span className="player-piece">♚</span>
          <span className="player-name">{game.black}</span>
        </div>
      </div>

      <div className="game-card-footer">
        <div className="game-meta">
          <span className="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            {game.num_moves} moves
          </span>
          <span className="meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {dateStr}
          </span>
        </div>

        <div className="game-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-ghost btn-sm" onClick={() => onReplay(game.id)} title="Replay game">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Replay
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(game.id)} title="Delete game">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GameList({ games, onSelect, onReplay, onDelete, onRefresh }) {
  if (games.length === 0) {
    return (
      <div className="game-list-empty">
        <div className="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3L5 7l2 5-3 3 1 3 3 2 4-2 4 2 3-3 1-4-3-4-1-3-4-3-3 1z"/>
            <path d="M9 9l1-1 1 1-1 1-1-1z"/>
          </svg>
        </div>
        <h3>No games yet</h3>
        <p>Import a PGN file to get started with game analysis.</p>
      </div>
    );
  }

  return (
    <div className="game-list">
      <div className="game-list-header">
        <h2 className="section-title">Your Games</h2>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh} title="Refresh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onSelect={onSelect}
            onReplay={onReplay}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
