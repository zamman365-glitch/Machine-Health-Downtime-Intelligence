-- ============================================================
-- Sample analytical queries for the Machine Health platform
-- Run these in pgAdmin's Query Tool once data is loaded.
-- ============================================================

-- 1. Basic JOIN: every machine with its latest sensor reading
--    and whether it actually failed
SELECT
    m.product_id,
    m.machine_type,
    sr.tool_wear,
    sr.torque,
    ml.machine_failure,
    ml.maintenance_cost
FROM machines m
JOIN sensor_readings sr ON sr.machine_id = m.machine_id
JOIN maintenance_log ml ON ml.machine_id = m.machine_id
ORDER BY ml.maintenance_cost DESC
LIMIT 20;


-- 2. CTE: average maintenance cost per machine type, only for
--    machines that actually failed
WITH failed_machines AS (
    SELECT
        m.machine_type,
        ml.maintenance_cost,
        ml.downtime_hours
    FROM machines m
    JOIN maintenance_log ml ON ml.machine_id = m.machine_id
    WHERE ml.machine_failure = TRUE
)
SELECT
    machine_type,
    COUNT(*)                     AS failure_count,
    ROUND(AVG(maintenance_cost), 2) AS avg_cost,
    ROUND(AVG(downtime_hours), 2)   AS avg_downtime_hours
FROM failed_machines
GROUP BY machine_type
ORDER BY avg_cost DESC;


-- 3. Window function: rank machines by tool wear within each
--    machine type (useful for a "highest risk machines" report)
SELECT
    m.product_id,
    m.machine_type,
    sr.tool_wear,
    RANK() OVER (
        PARTITION BY m.machine_type
        ORDER BY sr.tool_wear DESC
    ) AS wear_rank_within_type
FROM machines m
JOIN sensor_readings sr ON sr.machine_id = m.machine_id
ORDER BY m.machine_type, wear_rank_within_type
LIMIT 30;


-- 4. Window function: running total of maintenance cost, ordered
--    by predicted_at (useful for a cumulative-cost-over-time chart)
SELECT
    p.prediction_id,
    p.machine_id,
    p.predicted_at,
    p.predicted_cost,
    SUM(p.predicted_cost) OVER (
        ORDER BY p.predicted_at
    ) AS running_total_predicted_cost
FROM predictions p
ORDER BY p.predicted_at;


-- 5. KPI summary — good candidate for Power BI's executive-overview page
SELECT
    COUNT(*)                                   AS total_machines,
    SUM(CASE WHEN ml.machine_failure THEN 1 ELSE 0 END) AS total_failures,
    ROUND(
        100.0 * SUM(CASE WHEN ml.machine_failure THEN 1 ELSE 0 END) / COUNT(*),
        2
    )                                            AS failure_rate_pct,
    ROUND(SUM(ml.maintenance_cost), 2)          AS total_maintenance_cost,
    ROUND(SUM(ml.downtime_hours), 2)            AS total_downtime_hours
FROM machines m
JOIN maintenance_log ml ON ml.machine_id = m.machine_id;


-- 6. Predicted vs actual — for comparing model output to reality
--    once /predict endpoints have logged some rows
SELECT
    m.product_id,
    ml.machine_failure           AS actual_failure,
    p.failure_prediction         AS predicted_failure,
    p.failure_probability,
    ml.maintenance_cost          AS actual_cost,
    p.predicted_cost
FROM machines m
JOIN maintenance_log ml ON ml.machine_id = m.machine_id
LEFT JOIN predictions p ON p.machine_id = m.machine_id
WHERE p.prediction_id IS NOT NULL
ORDER BY p.predicted_at DESC;
