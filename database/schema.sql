CREATE TABLE IF NOT EXISTS markets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude REAL,
    longitude REAL
);

CREATE TABLE IF NOT EXISTS residential_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    median_price REAL NOT NULL,
    yoy_change REAL,
    inventory INTEGER,
    sales INTEGER,
    days_on_market REAL,
    price_per_sqft REAL,
    FOREIGN KEY (market_id) REFERENCES markets(id)
);

CREATE TABLE IF NOT EXISTS residential_rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    studio_rent REAL,
    one_bed_rent REAL,
    two_bed_rent REAL,
    three_bed_rent REAL,
    vacancy_rate REAL,
    rent_growth REAL,
    rent_per_sqft REAL,
    FOREIGN KEY (market_id) REFERENCES markets(id)
);

CREATE TABLE IF NOT EXISTS commercial_markets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    market_id INTEGER NOT NULL,
    period TEXT NOT NULL,
    property_type TEXT NOT NULL,
    asking_rent REAL,
    effective_rent REAL,
    vacancy_rate REAL,
    availability_rate REAL,
    absorption REAL,
    cap_rate REAL,
    inventory_sqft REAL,
    ti_allowance REAL,
    FOREIGN KEY (market_id) REFERENCES markets(id)
);

CREATE TABLE IF NOT EXISTS mortgage_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT NOT NULL,
    period TEXT NOT NULL,
    mortgage_type TEXT,
    rate REAL NOT NULL
);