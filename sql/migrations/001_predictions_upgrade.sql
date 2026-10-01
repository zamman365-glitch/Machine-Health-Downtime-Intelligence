-- ============================================================
-- Migration 001: Predictions Table Upgrade
-- Non-destructive ALTER table to support full prediction logs,
-- input feature snapshots, request tracing, and timestamps.
-- ============================================================

ALTER TABLE predictions 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS machine_type CHAR(1),
    ADD COLUMN IF NOT EXISTS air_temperature NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS process_temperature NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS rotational_speed NUMERIC(8,2),
    ADD COLUMN IF NOT EXISTS torque NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS tool_wear NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS request_id UUID;

-- Index on created_at for fast descending time-series queries
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions (created_at DESC);
