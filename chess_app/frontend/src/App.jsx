import { useState, useEffect, useCallback } from 'react';
import { chessApi } from './services/api.js';
import Header from './components/Header.jsx';
import GameList from './components/GameList.jsx';
import GameDetail from './components/GameDetail.jsx';
import ImportGame from './components/ImportGame.jsx';
import AnalysisPanel from './components/AnalysisPanel.jsx';
import ReplayViewer from './components/ReplayViewer.jsx';
import Toast from './components/Toast.jsx';
import './App.css';

export default function App() {
  const [view, setView] = useState('list'); // list | detail | import | replay
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chessApi.listGames();
      setGames(data);
    } catch (err) {
      setError(err.message);
      addToast(`Failed to load games: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGames();
  }, [fetchGames]);

  const handleGameCreated = useCallback(() => {
    setView('list');
    fetchGames();
    addToast('Game imported successfully!', 'success');
  }, [fetchGames, addToast]);

  const handleSelectGame = useCallback(async (gameId) => {
    setLoading(true);
    setError(null);
    try {
      const game = await chessApi.getGame(gameId);
      setSelectedGame(game);
      setView('detail');
    } catch (err) {
      setError(err.message);
      addToast(`Failed to load game: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const handleReplay = useCallback(async (gameId) => {
    setLoading(true);
    setError(null);
    try {
      const game = await chessApi.getGame(gameId);
      setSelectedGame(game);
      setView('replay');
    } catch (err) {
      setError(err.message);
      addToast(`Failed to load replay: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const handleDeleteGame = useCallback(async (gameId) => {
    try {
      await chessApi.deleteGame(gameId);
      fetchGames();
      addToast('Game deleted.', 'info');
      if (selectedGame?.id === gameId) {
        setSelectedGame(null);
        setView('list');
      }
    } catch (err) {
      addToast(`Failed to delete: ${err.message}`, 'error');
    }
  }, [fetchGames, addToast, selectedGame]);

  const handleBack = useCallback(() => {
    setView('list');
    setSelectedGame(null);
  }, []);

  return (
    <div className="app">
      <Header
        onHome={handleBack}
        onImport={() => setView('import')}
        view={view}
      />

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
            <button className="error-dismiss" onClick={() => setError(null)}>&times;</button>
          </div>
        )}

        {loading && view === 'list' && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading games...</p>
          </div>
        )}

        {view === 'list' && !loading && (
          <GameList
            games={games}
            onSelect={handleSelectGame}
            onReplay={handleReplay}
            onDelete={handleDeleteGame}
            onRefresh={fetchGames}
          />
        )}

        {view === 'detail' && selectedGame && (
          <div className="detail-view">
            <button className="btn btn-ghost back-btn" onClick={handleBack}>
              <span>&larr;</span> Back to Games
            </button>
            <GameDetail game={selectedGame} onReplay={() => handleReplay(selectedGame.id)} />
            <AnalysisPanel game={selectedGame} addToast={addToast} />
          </div>
        )}

        {view === 'replay' && selectedGame && (
          <div className="detail-view">
            <button className="btn btn-ghost back-btn" onClick={handleBack}>
              <span>&larr;</span> Back to Games
            </button>
            <ReplayViewer game={selectedGame} />
          </div>
        )}

        {view === 'import' && (
          <div className="detail-view">
            <button className="btn btn-ghost back-btn" onClick={handleBack}>
              <span>&larr;</span> Back to Games
            </button>
            <ImportGame onGameCreated={handleGameCreated} addToast={addToast} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Chess Game Analyzer &mdash; Powered by python-chess &amp; FastAPI</p>
      </footer>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
