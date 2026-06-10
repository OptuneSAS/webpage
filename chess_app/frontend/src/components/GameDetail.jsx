import './GameDetail.css';

export default function GameDetail({ game, onReplay }) {
  const dateStr = game.date
    ? new Date(game.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  const resultClass =
    game.result === '1-0' ? 'result-white' :
    game.result === '0-1' ? 'result-black' :
    game.result === '1/2-1/2' ? 'result-draw' : '';

  return (
    <div className="game-detail">
      <div className="detail-card">
        <div className="detail-top">
          <div className="detail-players">
            <div className="detail-player white-detail">
              <span className="detail-piece">♔</span>
              <div>
                <span className="detail-label">White</span>
                <span className="detail-name">{game.white}</span>
              </div>
            </div>
            <div className="detail-vs">
              <span className={`detail-result ${resultClass}`}>{game.result}</span>
            </div>
            <div className="detail-player black-detail">
              <span className="detail-piece">♚</span>
              <div>
                <span className="detail-label">Black</span>
                <span className="detail-name">{game.black}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <span className="meta-label">Date</span>
            <span className="meta-value">{dateStr}</span>
          </div>
          {game.event && (
            <div className="detail-meta-item">
              <span className="meta-label">Event</span>
              <span className="meta-value">{game.event}</span>
            </div>
          )}
          {game.eco && (
            <div className="detail-meta-item">
              <span className="meta-label">ECO</span>
              <span className="meta-value">{game.eco}</span>
            </div>
          )}
          <div className="detail-meta-item">
            <span className="meta-label">Moves</span>
            <span className="meta-value">{game.num_moves}</span>
          </div>
        </div>

        {game.round_info && (
          <div className="detail-round">
            <span className="meta-label">Round</span>
            <span className="meta-value">{game.round_info}</span>
          </div>
        )}

        <div className="detail-actions">
          <button className="btn btn-primary" onClick={onReplay}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Replay Game
          </button>
        </div>
      </div>

      {/* Move list */}
      <div className="move-list-card">
        <h3 className="move-list-title">Move List</h3>
        <div className="move-list-grid">
          {(() => {
            const rows = [];
            for (let i = 0; i < game.moves.length; i += 2) {
              const moveNum = Math.floor(i / 2) + 1;
              rows.push(
                <div className="move-row" key={i}>
                  <span className="move-number">{moveNum}.</span>
                  <span className="move-san">{game.moves[i]}</span>
                  <span className="move-san">{game.moves[i + 1] || ''}</span>
                </div>
              );
            }
            return rows;
          })()}
        </div>
      </div>
    </div>
  );
}
