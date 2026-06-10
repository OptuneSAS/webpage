import './Header.css';

export default function Header({ onHome, onImport, view }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <button className="header-logo" onClick={onHome} title="Home">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3L5 7l2 5-3 3 1 3 3 2 4-2 4 2 3-3 1-4-3-4-1-3-4-3-3 1z"/>
              <path d="M9 9l1-1 1 1-1 1-1-1z"/>
            </svg>
            <span className="logo-text">Chess Analyzer</span>
          </button>

          <nav className="header-nav">
            {view !== 'list' && (
              <button className="btn btn-ghost btn-sm" onClick={onHome}>
                <span>&larr;</span> Games
              </button>
            )}
          </nav>
        </div>

        <div className="header-right">
          <button className="btn btn-primary btn-sm" onClick={onImport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import PGN
          </button>
        </div>
      </div>
    </header>
  );
}
