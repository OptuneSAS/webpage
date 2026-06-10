/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { chessApi } from '../services/api.js';

const GameContext = createContext(null);

export function GameProvider({ children, game, initialMoves }) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [moves] = useState(initialMoves || game?.moves || []);
  const [fen, setFen] = useState(() => {
    try {
      const board = new Chess();
      return board.fen();
    } catch {
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
  });

  // Stockfish analysis state
  const [stockfishResult, setStockfishResult] = useState(null);
  const [stockfishLoading, setStockfishLoading] = useState(false);
  const [stockfishError, setStockfishError] = useState(null);

  // AI Commentary state
  const [commentary, setCommentary] = useState('');
  const [commentaryLoading, setCommentaryLoading] = useState(false);
  const [commentaryError, setCommentaryError] = useState(null);

  // Cache analysis results by FEN
  const analysisCache = useRef(new Map());
  const commentaryCache = useRef(new Map());
  const abortRef = useRef(null);

  const navigateTo = useCallback((index) => {
    const idx = Math.max(-1, Math.min(moves.length, index));
    setCurrentMoveIndex(idx);
    try {
      const board = new Chess();
      for (let i = 0; i < idx; i++) {
        board.move(moves[i]);
      }
      setFen(board.fen());
    } catch {
      // fallback
    }
  }, [moves]);

  // Request deep Stockfish analysis
  const requestDeepAnalysis = useCallback(async (fenToAnalyze, timeLimit = 2.0) => {
    // Cancel any pending request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    // Check cache
    const cacheKey = `${fenToAnalyze}|${timeLimit}`;
    if (analysisCache.current.has(cacheKey)) {
      setStockfishResult(analysisCache.current.get(cacheKey));
      setStockfishLoading(false);
      setStockfishError(null);
      return;
    }

    setStockfishLoading(true);
    setStockfishError(null);
    setStockfishResult(null);

    try {
      const result = await chessApi.stockfishAnalyse(fenToAnalyze, timeLimit);
      if (!controller.signal.aborted) {
        analysisCache.current.set(cacheKey, result);
        setStockfishResult(result);
        setStockfishLoading(false);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setStockfishError(err.message);
        setStockfishLoading(false);
      }
    }
  }, []);

  // Request AI commentary
  const requestCommentary = useCallback(async (fenToAnalyze, lastMove = null) => {
    // Check cache
    const cacheKey = `${fenToAnalyze}|${lastMove || ''}`;
    if (commentaryCache.current.has(cacheKey)) {
      setCommentary(commentaryCache.current.get(cacheKey));
      setCommentaryLoading(false);
      setCommentaryError(null);
      return;
    }

    setCommentaryLoading(true);
    setCommentaryError(null);

    try {
      const text = await chessApi.getCommentary(fenToAnalyze, lastMove, {
        moves,
        currentMoveIndex,
      });
      commentaryCache.current.set(cacheKey, text);
      setCommentary(text);
      setCommentaryLoading(false);
    } catch (err) {
      setCommentaryError(err.message);
      setCommentaryLoading(false);
    }
  }, [moves, currentMoveIndex]);

  // Get the last move SAN
  const lastMove = currentMoveIndex >= 0 ? moves[currentMoveIndex] : null;

  // Auto-analyze when FEN changes (debounced)
  const debounceRef = useRef(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      requestDeepAnalysis(fen, 2.0);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fen, requestDeepAnalysis]);

  const value = {
    // Game state
    game,
    moves,
    currentMoveIndex,
    fen,
    lastMove,
    navigateTo,

    // Stockfish analysis
    stockfishResult,
    stockfishLoading,
    stockfishError,
    requestDeepAnalysis,

    // AI Commentary
    commentary,
    commentaryLoading,
    commentaryError,
    requestCommentary,
    setCommentary,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}

export default GameContext;
