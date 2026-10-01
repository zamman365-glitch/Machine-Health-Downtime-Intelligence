import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="machine_health",
    user="postgres",
    password="Root1234",
    port="5432"
)

print("PostgreSQL connected successfully!")

conn.close()



