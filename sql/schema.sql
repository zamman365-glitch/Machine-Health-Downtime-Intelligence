-- ============================================================
-- Machine Health & Downtime Cost Intelligence Platform
-- Database schema (PostgreSQL)
-- ============================================================

DROP TABLE IF EXISTS predictions;
DROP TABLE IF EXISTS maintenance_log;
DROP TABLE IF EXISTS sensor_readings;
DROP TABLE IF EXISTS machines;

-- ------------------------------------------------------------
-- 1. machines — one row per machine (each AI4I "Product ID"
--    is treated as one machine, since the dataset has a single
--    snapshot of readings per machine rather than a time series)
-- ------------------------------------------------------------
CREATE TABLE machines (
    machine_id      SERIAL PRIMARY KEY,
    product_id      TEXT UNIQUE NOT NULL,
    machine_type    CHAR(1) NOT NULL CHECK (machine_type IN ('L', 'M', 'H')),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. sensor_readings — the raw + engineered sensor values
-- ------------------------------------------------------------
CREATE TABLE sensor_readings (
    reading_id              SERIAL PRIMARY KEY,
    machine_id              INT NOT NULL REFERENCES machines(machine_id),
    recorded_at             TIMESTAMP NOT NULL DEFAULT NOW(),
    air_temperature         NUMERIC(6,2) NOT NULL,
    process_temperature     NUMERIC(6,2) NOT NULL,
    rotational_speed        NUMERIC(8,2) NOT NULL,
    torque                  NUMERIC(6,2) NOT NULL,
    tool_wear                NUMERIC(6,2) NOT NULL,
    temperature_difference  NUMERIC(6,2) NOT NULL,
    average_temperature     NUMERIC(6,2) NOT NULL,
    power                   NUMERIC(10,2) NOT NULL
);

-- ------------------------------------------------------------
-- 3. maintenance_log — actual failure history + cost/downtime
--    (this is the ground truth used to train the models)
-- ------------------------------------------------------------
CREATE TABLE maintenance_log (
    log_id             SERIAL PRIMARY KEY,
    machine_id         INT NOT NULL REFERENCES machines(machine_id),
    recorded_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    machine_failure    BOOLEAN NOT NULL,
    twf                BOOLEAN NOT NULL DEFAULT FALSE,
    hdf                BOOLEAN NOT NULL DEFAULT FALSE,
    pwf                BOOLEAN NOT NULL DEFAULT FALSE,
    osf                BOOLEAN NOT NULL DEFAULT FALSE,
    rnf                BOOLEAN NOT NULL DEFAULT FALSE,
    downtime_hours     NUMERIC(6,2) NOT NULL DEFAULT 0,
    maintenance_cost   NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------
-- 4. predictions — every prediction FastAPI makes gets logged
--    here, so Power BI can compare predicted vs actual over time
-- ------------------------------------------------------------
CREATE TABLE predictions (
    prediction_id        SERIAL PRIMARY KEY,
    machine_id           INT REFERENCES machines(machine_id),
    predicted_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    failure_prediction    BOOLEAN,
    failure_probability   NUMERIC(5,4),
    predicted_cost        NUMERIC(10,2),
    model_version          TEXT DEFAULT 'v1'
);

-- ------------------------------------------------------------
-- Helpful indexes
-- ------------------------------------------------------------
CREATE INDEX idx_sensor_readings_machine ON sensor_readings(machine_id);
CREATE INDEX idx_maintenance_log_machine ON maintenance_log(machine_id);
CREATE INDEX idx_predictions_machine ON predictions(machine_id);

-- ------------------------------------------------------------
-- A view for Power BI: one row per machine with its latest
-- reading + actual failure info + latest prediction, joined
-- together (demonstrates JOIN + this is what Power BI will read)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW machine_health_overview AS
SELECT
    m.machine_id,
    m.product_id,
    m.machine_type,
    sr.air_temperature,
    sr.process_temperature,
    sr.rotational_speed,
    sr.torque,
    sr.tool_wear,
    sr.power,
    ml.machine_failure,
    ml.downtime_hours,
    ml.maintenance_cost,
    p.failure_probability AS predicted_failure_probability,
    p.predicted_cost
FROM machines m
LEFT JOIN sensor_readings sr ON sr.machine_id = m.machine_id
LEFT JOIN maintenance_log ml ON ml.machine_id = m.machine_id
LEFT JOIN predictions p ON p.machine_id = m.machine_id;
