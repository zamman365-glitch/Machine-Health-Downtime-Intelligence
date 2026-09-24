"""
Loads the notebook's processed data (ai4i_processed.csv) into the
PostgreSQL tables defined in schema.sql.

Before running this:
1. Run schema.sql once against your database (pgAdmin Query Tool, or:
   psql -U postgres -d machine_health -f schema.sql)
2. In your notebook, export the processed dataframe to CSV:
       df.to_csv("data/processed/ai4i_processed.csv", index=False)
3. pip install sqlalchemy psycopg2-binary python-dotenv pandas
4. Create a .env file (see .env.example) with your DB password.

Run with:
    python load_data.py
"""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "machine_health")

CSV_PATH = "data/processed/ai4i_processed.csv"

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


def main():
    print(f"Reading {CSV_PATH} ...")
    df = pd.read_csv(CSV_PATH)

    # ---- sanity check the columns we need are present ----
    required = [
        "Product ID", "Type", "Air temperature [K]", "Process temperature [K]",
        "Rotational speed [rpm]", "Torque [Nm]", "Tool wear [min]",
        "Temperature difference", "Average Temperature", "Power",
        "Machine failure", "TWF", "HDF", "PWF", "OSF", "RNF",
        "Downtime_Hours", "Maintenance_Cost",
    ]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"CSV is missing expected columns: {missing}")

    with engine.begin() as conn:
        # clear existing rows so this script is safe to re-run
        conn.execute(text(
            "TRUNCATE predictions, maintenance_log, sensor_readings, machines "
            "RESTART IDENTITY CASCADE"
        ))

    # ---- 1. machines ----
    machines_df = (
        df[["Product ID", "Type"]]
        .drop_duplicates(subset="Product ID")
        .rename(columns={"Product ID": "product_id", "Type": "machine_type"})
    )
    machines_df.to_sql("machines", engine, if_exists="append", index=False)
    print(f"Inserted {len(machines_df)} machines.")

    # pull back the auto-generated machine_id for each product_id
    machine_ids = pd.read_sql("SELECT machine_id, product_id FROM machines", engine)
    df = df.merge(machine_ids, left_on="Product ID", right_on="product_id")

    # ---- 2. sensor_readings ----
    sensor_df = df[[
        "machine_id", "Air temperature [K]", "Process temperature [K]",
        "Rotational speed [rpm]", "Torque [Nm]", "Tool wear [min]",
        "Temperature difference", "Average Temperature", "Power",
    ]].rename(columns={
        "Air temperature [K]": "air_temperature",
        "Process temperature [K]": "process_temperature",
        "Rotational speed [rpm]": "rotational_speed",
        "Torque [Nm]": "torque",
        "Tool wear [min]": "tool_wear",
        "Temperature difference": "temperature_difference",
        "Average Temperature": "average_temperature",
        "Power": "power",
    })
    sensor_df.to_sql("sensor_readings", engine, if_exists="append", index=False)
    print(f"Inserted {len(sensor_df)} sensor readings.")

    # ---- 3. maintenance_log ----
    maint_df = df[[
        "machine_id", "Machine failure", "TWF", "HDF", "PWF", "OSF", "RNF",
        "Downtime_Hours", "Maintenance_Cost",
    ]].rename(columns={
        "Machine failure": "machine_failure",
        "TWF": "twf", "HDF": "hdf", "PWF": "pwf", "OSF": "osf", "RNF": "rnf",
        "Downtime_Hours": "downtime_hours",
        "Maintenance_Cost": "maintenance_cost",
    })
    for col in ["machine_failure", "twf", "hdf", "pwf", "osf", "rnf"]:
        maint_df[col] = maint_df[col].astype(bool)
    maint_df.to_sql("maintenance_log", engine, if_exists="append", index=False)
    print(f"Inserted {len(maint_df)} maintenance log rows.")

    print("Done. Data loaded into PostgreSQL.")


if __name__ == "__main__":
    main()
