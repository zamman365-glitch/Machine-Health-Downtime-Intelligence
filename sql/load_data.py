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
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@"
    f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


def main():

    # ============================================================
    # 1. READ CSV
    # ============================================================

    print(f"Reading {CSV_PATH} ...")

    df = pd.read_csv(CSV_PATH)

    print(f"Dataset shape: {df.shape}")


    # ============================================================
    # 2. CHECK REQUIRED COLUMNS
    # ============================================================

    required = [
        "Product ID",
        "Type",
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]",
        "Temperature difference",
        "Average Temperature",
        "Power",
        "Machine failure",
        "TWF",
        "HDF",
        "PWF",
        "OSF",
        "RNF",
        "Downtime_Hours",
        "Maintenance_Cost",
    ]

    missing = [c for c in required if c not in df.columns]

    if missing:
        raise ValueError(
            f"CSV is missing expected columns: {missing}"
        )


    # ============================================================
    # 3. CLEAR OLD DATA
    # ============================================================

    print("Clearing old database data...")

    with engine.begin() as conn:

        conn.execute(
            text(
                """
                TRUNCATE
                    predictions,
                    maintenance_log,
                    sensor_readings,
                    machines
                RESTART IDENTITY CASCADE
                """
            )
        )

    print("Old data cleared.")


    # ============================================================
    # 4. INSERT MACHINES
    # ============================================================

    print("Preparing machines data...")

    machines_df = (
        df[["Product ID", "Type"]]
        .drop_duplicates(subset="Product ID")
        .rename(
            columns={
                "Product ID": "product_id",
                "Type": "machine_type"
            }
        )
    )

    # AI4I encoding:
    # 0 = L
    # 1 = M
    # 2 = H

    machines_df["machine_type"] = machines_df["machine_type"].map({
        0: "L",
        1: "M",
        2: "H"
    })

    if machines_df["machine_type"].isna().any():
        raise ValueError(
            "Unexpected values found in Type column. "
            "Expected 0, 1 or 2."
        )

    machines_df.to_sql(
        "machines",
        engine,
        if_exists="append",
        index=False
    )

    print(f"Inserted {len(machines_df)} machines.")


    # ============================================================
    # 5. GET MACHINE IDs
    # ============================================================

    print("Getting machine IDs...")

    machine_ids = pd.read_sql(
        "SELECT machine_id, product_id FROM machines",
        engine
    )

    df = df.merge(
        machine_ids,
        left_on="Product ID",
        right_on="product_id",
        how="left"
    )

    if df["machine_id"].isna().any():
        raise ValueError(
            "Some Product IDs could not be mapped to machine_id."
        )

    print("Machine IDs mapped successfully.")


    # ============================================================
    # 6. INSERT SENSOR READINGS
    # ============================================================

    print("Preparing sensor readings...")

    sensor_df = df[
        [
            "machine_id",
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]",
            "Temperature difference",
            "Average Temperature",
            "Power",
        ]
    ].rename(
        columns={
            "Air temperature [K]": "air_temperature",
            "Process temperature [K]": "process_temperature",
            "Rotational speed [rpm]": "rotational_speed",
            "Torque [Nm]": "torque",
            "Tool wear [min]": "tool_wear",
            "Temperature difference": "temperature_difference",
            "Average Temperature": "average_temperature",
            "Power": "power",
        }
    )

    sensor_df.to_sql(
        "sensor_readings",
        engine,
        if_exists="append",
        index=False
    )

    print(f"Inserted {len(sensor_df)} sensor readings.")


    # ============================================================
    # 7. INSERT MAINTENANCE LOG
    # ============================================================

    print("Preparing maintenance logs...")

    maint_df = df[
        [
            "machine_id",
            "Machine failure",
            "TWF",
            "HDF",
            "PWF",
            "OSF",
            "RNF",
            "Downtime_Hours",
            "Maintenance_Cost",
        ]
    ].rename(
        columns={
            "Machine failure": "machine_failure",
            "TWF": "twf",
            "HDF": "hdf",
            "PWF": "pwf",
            "OSF": "osf",
            "RNF": "rnf",
            "Downtime_Hours": "downtime_hours",
            "Maintenance_Cost": "maintenance_cost",
        }
    )

    # ------------------------------------------------------------
    # Convert all failure columns explicitly to Python bool
    # ------------------------------------------------------------

    boolean_columns = [
        "machine_failure",
        "twf",
        "hdf",
        "pwf",
        "osf",
        "rnf"
    ]

    for col in boolean_columns:
        maint_df[col] = maint_df[col].fillna(0).astype(int).astype(bool)

    # IMPORTANT:
    # Convert pandas/numpy values into actual Python bool
    for col in boolean_columns:
        maint_df[col] = maint_df[col].apply(lambda x: bool(x))

    print("Boolean columns converted successfully.")

    maint_df.to_sql(
        "maintenance_log",
        engine,
        if_exists="append",
        index=False
    )

    print(f"Inserted {len(maint_df)} maintenance log rows.")


    # ============================================================
    # 8. FINAL
    # ============================================================

    print()
    print("=" * 60)
    print("DATA LOADING COMPLETED SUCCESSFULLY")
    print("=" * 60)
    print()
    print("Database:", DB_NAME)
    print("Machines:", len(machines_df))
    print("Sensor readings:", len(sensor_df))
    print("Maintenance logs:", len(maint_df))


if __name__ == "__main__":
    main()

    