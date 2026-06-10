const API_BASE = 'http://localhost:8000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      detail = err.detail || detail;
    } catch { /* ignore parsing errors */ }
    throw new Error(detail);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const chessApi = {
  // Health
  health: () => request('/health'),

  // Games
  createGame: (pgn) =>
    request('/api/games', {
      method: 'POST',
      body: JSON.stringify({ pgn }),
    }),

  listGames: (skip = 0, limit = 20) =>
    request(`/api/games?skip=${skip}&limit=${limit}`),

  getGame: (gameId) => request(`/api/games/${gameId}`),

  deleteGame: (gameId) =>
    request(`/api/games/${gameId}`, { method: 'DELETE' }),

  // Analysis
  analysePosition: (gameId, fen = null, depth = 18) => {
    const params = new URLSearchParams();
    if (fen) params.set('fen', fen);
    params.set('depth', String(depth));
    return request(`/api/games/${gameId}/analyse?${params.toString()}`, {
      method: 'POST',
    });
  },

  // Stockfish-powered analysis (advanced)
  stockfishAnalyse: (fen, timeLimit = 2.0, depthLimit = null) => {
    const body = { fen, time_limit: timeLimit };
    if (depthLimit !== null) body.depth_limit = depthLimit;
    return request('/api/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Replay
  getReplay: (gameId) => request(`/api/games/${gameId}/replay`),

  // AI Commentary (via local LLM Commentary server)
  getCommentary: async (fen, lastMove = null, context = null) => {
    const commentaryUrl = 'http://localhost:8765/api/commentary';
    const movesStr = context?.moves?.slice(0, 40).join(' ') || '';
    
    const prompt = lastMove
      ? `You are a chess commentator. Analyze this position and the last move played.

FEN: ${fen}
Last move: ${lastMove}
${movesStr ? `Game moves so far: ${movesStr}` : ''}

Provide a concise, insightful chess commentary (2-3 sentences) covering:
1. What the last move accomplishes
2. The current strategic situation
3. What both players should be thinking about now

Keep it natural, insightful, and actionable for a club-level player.`
      : `You are a chess commentator. Analyze this starting position.

FEN: ${fen}

Provide a concise chess commentary (2-3 sentences) about:
1. The opening being played
2. Key strategic ideas for both sides
3. What to watch for in the next few moves

Keep it natural and insightful.`;

    const response = await fetch(commentaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'custom',
        instruction: prompt,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!response.ok) throw new Error(`Commentary server error: ${response.status}`);
    const data = await response.json();
    return data.commentary || data.text || data.content || 'No commentary available.';
  },
};

export default chessApi;
