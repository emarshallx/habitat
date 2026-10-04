from pathlib import Path
import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="HABITAT API",
    version="0.4.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / "database" / "habitat.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


@app.get("/")
def home():
    return {
        "name": "HABITAT",
        "status": "online",
        "database": "connected",
        "version": "0.4.0"
    }


@app.get("/api/markets")
def get_markets():
    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            m.id,
            m.city,
            m.region,
            m.country,

            rs.median_price,
            rs.yoy_change,
            rs.inventory,
            rs.sales,
            rs.days_on_market,
            rs.price_per_sqft,

            rr.studio_rent,
            rr.one_bed_rent AS median_rent,
            rr.two_bed_rent,
            rr.three_bed_rent,
            rr.vacancy_rate,
            rr.rent_growth,
            rr.rent_per_sqft

        FROM markets AS m

        LEFT JOIN residential_sales AS rs
            ON rs.market_id = m.id

        LEFT JOIN residential_rentals AS rr
            ON rr.market_id = m.id

        ORDER BY
            m.country,
            m.city
        """
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]


@app.get("/api/commercial")
def get_commercial():
    connection = get_connection()

    rows = connection.execute(
        """
        SELECT
            cm.id,
            m.id AS market_id,
            m.city,
            m.region,
            m.country,

            cm.period,
            cm.property_type,
            cm.asking_rent,
            cm.effective_rent,
            cm.vacancy_rate,
            cm.availability_rate,
            cm.absorption,
            cm.cap_rate,
            cm.inventory_sqft,
            cm.ti_allowance

        FROM commercial_markets AS cm

        JOIN markets AS m
            ON m.id = cm.market_id

        ORDER BY
            cm.property_type,
            m.country,
            m.city
        """
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]