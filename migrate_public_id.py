import psycopg2
import secrets
import os

# Choose your connection method:
# For Cloud SQL Proxy (local): use host='localhost', port=5432
# For Cloud Shell: use host='/cloudsql/snr0-154605:us-central1:scioly-db', no port

DB_USER = "scioly-app-user"
DB_PASS = "ZKF/yqdV7e4sahJRoLRyfeVQPnp6p5NNEaAshuO+gu4="
DB_NAME = "scioly_app_db"

# Uncomment ONE of the following blocks:

# --- For Cloud SQL Proxy (local) ---
HOST = "localhost"
PORT = 5432

# --- For Cloud Shell or GCP VM ---
# HOST = "/cloudsql/snr0-154605:us-central1:scioly-db"
#PORT = None

def main():
    conn_args = {
        "dbname": DB_NAME,
        "user": DB_USER,
        "password": DB_PASS,
        "host": HOST
    }
    if PORT:
        conn_args["port"] = PORT

    conn = psycopg2.connect(**conn_args)
    cur = conn.cursor()

    # 1. Add the public_id column if it doesn't exist
    try:
        cur.execute('ALTER TABLE "user" ADD COLUMN public_id VARCHAR(32) UNIQUE;')
        print("Added public_id column.")
    except psycopg2.errors.DuplicateColumn:
        print("public_id column already exists.")
        conn.rollback()
    except Exception as e:
        if 'already exists' in str(e):
            print("public_id column already exists.")
            conn.rollback()
        else:
            raise

    # 2. Backfill public_id for users missing it
    cur.execute('SELECT id FROM "user" WHERE public_id IS NULL OR public_id = \'\';')
    users = cur.fetchall()
    print(f"Backfilling {len(users)} users...")
    for (user_id,) in users:
        public_id = secrets.token_hex(16)
        cur.execute('UPDATE "user" SET public_id = %s WHERE id = %s;', (public_id, user_id))
    conn.commit()
    print("Migration complete.")

    cur.close()
    conn.close()

if __name__ == '__main__':
    main()
