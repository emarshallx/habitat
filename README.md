# HABITAT//

HABITAT is a North American real estate intelligence platform I built to bring residential, rental, commercial, mortgage, and investment analysis into one clean and interactive application.

The project combines a modern Next.js frontend with a FastAPI backend and a SQL database. My goal is to continue developing HABITAT into a more complete real estate analytics platform with historical data, live market feeds, forecasting, and deeper market intelligence.

## What HABITAT Does

HABITAT currently includes several connected modules:

### Market Intelligence
A real estate dashboard covering major Canadian and U.S. markets with:

- Median home prices
- Median rents
- Year-over-year price changes
- Inventory
- Sales volume
- Days on market
- Price per square foot
- Rental vacancy
- Rent growth

### Mortgage Lab
An interactive mortgage calculator that includes:

- Home price
- Down payment
- Interest rate
- Amortization
- Property tax
- Insurance
- Condo or HOA fees
- Extra monthly mortgage payments
- Monthly mortgage payment
- Total housing cost
- Loan-to-value
- Total interest
- Amortization breakdown

The calculator also accounts for different mortgage calculation conventions between Canada and the United States.

### Rental Analytics
Residential leasing analysis with:

- Studio rent
- One-bedroom rent
- Two-bedroom rent
- Three-bedroom rent
- Vacancy rate
- Rent growth
- Rent per square foot
- Gross rental yield
- Canada and U.S. market filters

### Commercial Real Estate
Commercial market intelligence covering:

- Office
- Retail
- Industrial
- Multifamily

Commercial analytics currently include:

- Asking rent
- Effective rent
- Vacancy
- Availability
- Absorption
- Cap rates
- Inventory
- Tenant improvement allowances

### Investment Lab
A property underwriting tool that calculates:

- Net operating income
- Cap rate
- Cash-on-cash return
- Debt service coverage ratio
- Gross yield
- Annual cash flow
- Mortgage payment
- Operating expenses
- Ten-year property value projection
- Ten-year rent growth projection

### Compare Markets
A side-by-side market comparison tool that allows users to compare selected cities using:

- Home price
- Rent
- Price growth
- Vacancy
- Price per square foot
- Gross rental yield
- HABITAT investment score

## Technology

HABITAT is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Python
- FastAPI
- SQLite
- SQL
- Git / GitHub

## Architecture

The application currently follows this structure:

```text
HABITAT
│
├── frontend
│   └── Next.js / React / TypeScript
│
├── backend
│   └── FastAPI / Python
│
└── database
    └── SQLite / SQL