import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASE_DIR = BASE_DIR / "database"

DB_PATH = DATABASE_DIR / "habitat.db"
SCHEMA_PATH = DATABASE_DIR / "schema.sql"
SEED_PATH = DATABASE_DIR / "seed.sql"


def initialize_database():
    connection = sqlite3.connect(DB_PATH)

    with open(SCHEMA_PATH, "r", encoding="utf-8") as file:
        connection.executescript(file.read())

    count = connection.execute(
        "SELECT COUNT(*) FROM markets"
    ).fetchone()[0]

    if count == 0:
        with open(SEED_PATH, "r", encoding="utf-8") as file:
            connection.executescript(file.read())

    connection.commit()
    connection.close()

    print("HABITAT database initialized.")
    print(DB_PATH)


if __name__ == "__main__":
    initialize_database()