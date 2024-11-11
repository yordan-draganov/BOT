CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    result VARCHAR(50),
    reels INTEGER[],
    spins INTEGER
);
