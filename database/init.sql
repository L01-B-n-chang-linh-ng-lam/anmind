-- =====================================
-- INIT.SQL — ANMIND DATABASE SCHEMA
-- Updated for Agora Livestream Integration
-- =====================================
-- =========================
-- EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- =========================
-- USER
-- =========================
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =========================
-- RESET SESSION
-- =========================
CREATE TABLE reset_session (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NULL,
    duration_minutes INT NOT NULL CHECK (
        duration_minutes BETWEEN 1 AND 30
    ),
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =========================
-- MOOD ENTRY
-- =========================
CREATE TABLE mood_entry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reset_session_id UUID NOT NULL,
    score_before INT CHECK (
        score_before BETWEEN 1 AND 5
    ),
    score_after INT CHECK (
        score_after BETWEEN 1 AND 5
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =========================
-- MEDITATION SESSION
-- Agora integration notes:
-- - channel_name: unique Agora channel identifier
-- - host_user_id: session owner / broadcaster
-- - rtc_token: optional pre-generated token (usually not stored)
-- - status: scheduling state
-- - max_participants: business rule only
-- =========================
CREATE TABLE meditation_session (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    host_user_id UUID NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL CHECK (
        duration_minutes BETWEEN 1 AND 120
    ),
    -- Agora fields
    channel_name TEXT NOT NULL UNIQUE,
    rtc_token TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (
        status IN ('scheduled', 'live', 'ended', 'cancelled')
    ),
    max_participants INT DEFAULT 100 CHECK (max_participants > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =========================
-- USER MEDITATION SESSION
-- Tracks attendance and Agora role
-- =========================
CREATE TABLE user_meditation_session (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    meditation_session_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'audience' CHECK (role IN ('host', 'audience')),
    joined_at TIMESTAMP,
    left_at TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, meditation_session_id)
);
-- =========================
-- OPTIONAL: AGORA TOKEN AUDIT
-- Stores token issuance history.
-- Useful for debugging and security auditing.
-- =========================
CREATE TABLE agora_token_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    meditation_session_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('host', 'audience')),
    token_expire_at TIMESTAMP NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =====================================
-- FOREIGN KEY CONSTRAINTS
-- =====================================
ALTER TABLE reset_session
ADD CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE
SET NULL;
ALTER TABLE mood_entry
ADD CONSTRAINT fk_mood_reset FOREIGN KEY (reset_session_id) REFERENCES reset_session(id) ON DELETE CASCADE;
ALTER TABLE user_meditation_session
ADD CONSTRAINT fk_user_meditation_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
ALTER TABLE user_meditation_session
ADD CONSTRAINT fk_user_meditation_session FOREIGN KEY (meditation_session_id) REFERENCES meditation_session(id) ON DELETE CASCADE;
ALTER TABLE agora_token_log
ADD CONSTRAINT fk_agora_token_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
ALTER TABLE agora_token_log
ADD CONSTRAINT fk_agora_token_session FOREIGN KEY (meditation_session_id) REFERENCES meditation_session(id) ON DELETE CASCADE;
-- =====================================
-- INDEXES
-- =====================================
CREATE INDEX idx_user_username ON "user"(username);
CREATE INDEX idx_reset_user ON reset_session(user_id);
CREATE INDEX idx_reset_time ON reset_session(started_at);
CREATE INDEX idx_mood_session ON mood_entry(reset_session_id);
CREATE INDEX idx_meditation_start_time ON meditation_session(start_time);
CREATE INDEX idx_meditation_status ON meditation_session(status);
CREATE INDEX idx_user_meditation_session ON user_meditation_session(meditation_session_id);
CREATE INDEX idx_agora_token_session ON agora_token_log(meditation_session_id);