from pathlib import Path
import sqlite3


BASE_DIR = Path(__file__).resolve().parent.parent

DB_PATH = BASE_DIR / "database" / "habitat.db"
SEED_PATH = BASE_DIR / "database" / "commercial_seed.sql"


def seed_commercial():
    connection = sqlite3.connect(DB_PATH)

    with open(SEED_PATH, "r", encoding="utf-8") as file:
        connection.executescript(file.read())

    connection.commit()

    count = connection.execute(
        "SELECT COUNT(*) FROM commercial_markets"
    ).fetchone()[0]

    connection.close()

    print("HABITAT commercial data loaded.")
    print(f"Commercial rows: {count}")


if __name__ == "__main__":
    seed_commercial()