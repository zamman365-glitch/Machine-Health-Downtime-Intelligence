import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="machine_health",
    user="postgres",
    password="REMOVED_SECRET",
    port="5432"
)

print("PostgreSQL connected successfully!")

conn.close()