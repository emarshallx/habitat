"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Market = {
  id: number;
  city: string;
  region: string;
  country: string;

  median_price: number;
  yoy_change: number;
  inventory: number;
  sales: number;
  days_on_market: number;
  price_per_sqft: number;

  studio_rent: number;
  median_rent: number;
  two_bed_rent: number;
  three_bed_rent: number;
  vacancy_rate: number;
  rent_growth: number;
  rent_per_sqft: number;
};

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState<
    "ALL" | "Canada" | "USA"
  >("ALL");
  const [mode, setMode] = useState<"SALE" | "LEASE">("SALE");

  useEffect(() => {
    async function loadMarkets() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/markets"
        );

        if (!response.ok) {
          throw new Error("Unable to load market data");
        }

        const data = await response.json();

        setMarkets(data);
      } catch (error) {
        console.error("Market API error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMarkets();
  }, []);

  const filteredMarkets = useMemo(() => {
    if (countryFilter === "ALL") {
      return markets;
    }

    return markets.filter(
      (market) => market.country === countryFilter
    );
  }, [markets, countryFilter]);

  const averagePrice = useMemo(() => {
    if (!filteredMarkets.length) return 0;

    return (
      filteredMarkets.reduce(
        (sum, market) => sum + market.median_price,
        0
      ) / filteredMarkets.length
    );
  }, [filteredMarkets]);

  const averageRent = useMemo(() => {
    if (!filteredMarkets.length) return 0;

    return (
      filteredMarkets.reduce(
        (sum, market) => sum + market.median_rent,
        0
      ) / filteredMarkets.length
    );
  }, [filteredMarkets]);

  const averageGrowth = useMemo(() => {
    if (!filteredMarkets.length) return 0;

    return (
      filteredMarkets.reduce(
        (sum, market) => sum + market.yoy_change,
        0
      ) / filteredMarkets.length
    );
  }, [filteredMarkets]);

  const totalInventory = useMemo(() => {
    return filteredMarkets.reduce(
      (sum, market) => sum + market.inventory,
      0
    );
  }, [filteredMarkets]);

  const strongestMarket = useMemo(() => {
    if (!filteredMarkets.length) return null;

    return [...filteredMarkets].sort(
      (a, b) => b.yoy_change - a.yoy_change
    )[0];
  }, [filteredMarkets]);

  const weakestMarket = useMemo(() => {
    if (!filteredMarkets.length) return null;

    return [...filteredMarkets].sort(
      (a, b) => a.yoy_change - b.yoy_change
    )[0];
  }, [filteredMarkets]);

  const highestRent = useMemo(() => {
    if (!filteredMarkets.length) return null;

    return [...filteredMarkets].sort(
      (a, b) => b.median_rent - a.median_rent
    )[0];
  }, [filteredMarkets]);

  const lowestVacancy = useMemo(() => {
    if (!filteredMarkets.length) return null;

    return [...filteredMarkets].sort(
      (a, b) => a.vacancy_rate - b.vacancy_rate
    )[0];
  }, [filteredMarkets]);

  const maxPrice = Math.max(
    ...filteredMarkets.map((market) => market.median_price),
    1
  );

  return (
    <main className="app-shell">
      <section className="hero-section">

        <motion.header
          className="top-nav"
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="brand">
            HABITAT//
          </div>

          <div className="nav-links">

            <button
              onClick={() =>
                setCountryFilter("Canada")
              }
            >
              CANADA
            </button>

            <button
              onClick={() =>
                setCountryFilter("USA")
              }
            >
              USA
            </button>

            <button
              onClick={() =>
                setMode("SALE")
              }
            >
              SALE
            </button>

            <button
              onClick={() =>
                setMode("LEASE")
              }
            >
              LEASE
            </button>

          </div>
        </motion.header>

        <div className="hero-content">

          <motion.p
            className="eyebrow"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
          >
            NORTH AMERICAN REAL ESTATE INTELLIGENCE
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 0.9,
            }}
          >
            MARKET
            <br />
            INTELLIGENCE
          </motion.h1>

          <motion.div
            className="hero-metrics"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.6,
              duration: 0.8,
            }}
          >

            <Metric
              label="Tracked Markets"
              value={`${filteredMarkets.length}`}
            />

            <Metric
              label="Average Home Price"
              value={money(averagePrice)}
            />

            <Metric
              label="Average Rent"
              value={money(averageRent)}
            />

            <Metric
              label="Average Growth"
              value={`${averageGrowth >= 0 ? "+" : ""}${averageGrowth.toFixed(
                1
              )}%`}
            />

          </motion.div>

        </div>

        <div className="ticker-wrap">

          {markets.length > 0 && (
            <motion.div
              className="ticker"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 30,
                ease: "linear",
              }}
            >

              {[...markets, ...markets].map(
                (market, index) => (
                  <div
                    className="ticker-item"
                    key={`${market.city}-${index}`}
                  >

                    <span>
                      {market.city}
                    </span>

                    <span className="ticker-country">
                      {market.country}
                    </span>

                    <span>
                      {compactMoney(
                        market.median_price
                      )}
                    </span>

                    <span
                      className={
                        market.yoy_change >= 0
                          ? "ticker-up"
                          : "ticker-down"
                      }
                    >
                      {market.yoy_change >= 0
                        ? "↗"
                        : "↘"}{" "}
                      {Math.abs(
                        market.yoy_change
                      ).toFixed(1)}
                      %
                    </span>

                  </div>
                )
              )}

            </motion.div>
          )}

        </div>

      </section>

      <section className="control-section">

        <div className="filter-group">

          <span className="filter-label">
            COUNTRY
          </span>

          <button
            className={
              countryFilter === "ALL"
                ? "filter active"
                : "filter"
            }
            onClick={() =>
              setCountryFilter("ALL")
            }
          >
            ALL
          </button>

          <button
            className={
              countryFilter === "Canada"
                ? "filter active"
                : "filter"
            }
            onClick={() =>
              setCountryFilter("Canada")
            }
          >
            CANADA
          </button>

          <button
            className={
              countryFilter === "USA"
                ? "filter active"
                : "filter"
            }
            onClick={() =>
              setCountryFilter("USA")
            }
          >
            USA
          </button>

        </div>

        <div className="filter-group">

          <span className="filter-label">
            MARKET TYPE
          </span>

          <button
            className={
              mode === "SALE"
                ? "filter active"
                : "filter"
            }
            onClick={() =>
              setMode("SALE")
            }
          >
            SALE
          </button>

          <button
            className={
              mode === "LEASE"
                ? "filter active"
                : "filter"
            }
            onClick={() =>
              setMode("LEASE")
            }
          >
            LEASE
          </button>

        </div>

      </section>

      <section className="market-section">

        <div className="market-heading">

          <div>

            <p className="section-label">
              SQL MARKET FEED
            </p>

            <h2>
              CITIES{" "}
              <span className="muted">
                / NORTH AMERICA
              </span>
            </h2>

          </div>

          <div className="live-indicator">

            <span className="live-dot" />

            DATABASE LIVE

          </div>

        </div>

        {loading ? (

          <div className="loading">
            LOADING MARKET DATABASE...
          </div>

        ) : (

          <div className="market-table">

            <div className="market-table-header">

              <span>
                MARKET
              </span>

              <span>
                COUNTRY
              </span>

              <span>
                {mode === "SALE"
                  ? "MEDIAN PRICE"
                  : "MEDIAN RENT"}
              </span>

              <span>
                {mode === "SALE"
                  ? "$ / SQ FT"
                  : "VACANCY"}
              </span>

              <span>
                CHANGE
              </span>

            </div>

            {filteredMarkets.map(
              (market, index) => {

                const positive =
                  market.yoy_change >= 0;

                return (
                  <motion.div
                    key={market.id}
                    className="market-row"
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.4,
                    }}
                    viewport={{
                      once: true,
                    }}
                  >

                    <div className="market-name">

                      <span className="city">
                        {market.city}
                      </span>

                      <span className="region">
                        {market.region}
                      </span>

                    </div>

                    <span className="country">
                      {market.country}
                    </span>

                    <span
                      className={
                        positive
                          ? "market-price price-up"
                          : "market-price price-down"
                      }
                      style={{
                        animationDelay: `${index * 0.45}s`,
                      }}
                    >
                      {mode === "SALE"
                        ? money(
                            market.median_price
                          )
                        : money(
                            market.median_rent
                          )}
                    </span>

                    <span className="rent">
                      {mode === "SALE"
                        ? `$${market.price_per_sqft.toLocaleString()}`
                        : `${market.vacancy_rate.toFixed(
                            1
                          )}%`}
                    </span>

                    <span
                      className={
                        positive
                          ? "change change-up"
                          : "change change-down"
                      }
                    >
                      {positive
                        ? "↗"
                        : "↘"}{" "}
                      {Math.abs(
                        market.yoy_change
                      ).toFixed(1)}
                      %
                    </span>

                  </motion.div>
                );
              }
            )}

          </div>
        )}

      </section>

      <section className="analysis-section">

        <div className="analysis-copy">

          <p className="section-label">
            MARKET SIGNALS
          </p>

          <h2 className="analysis-title">
            DATA,
            <br />
            NOT NOISE.
          </h2>

        </div>

        <div className="analysis-grid">

          <AnalysisCard
            label="Strongest Market"
            city={
              strongestMarket?.city ??
              "—"
            }
            value={
              strongestMarket
                ? `+${strongestMarket.yoy_change.toFixed(
                    1
                  )}%`
                : "—"
            }
            description="Highest annual price growth in the selected market group."
          />

          <AnalysisCard
            label="Weakest Market"
            city={
              weakestMarket?.city ??
              "—"
            }
            value={
              weakestMarket
                ? `${weakestMarket.yoy_change.toFixed(
                    1
                  )}%`
                : "—"
            }
            negative
            description="Lowest annual price growth in the selected market group."
          />

          <AnalysisCard
            label="Highest Rent"
            city={
              highestRent?.city ??
              "—"
            }
            value={
              highestRent
                ? money(
                    highestRent.median_rent
                  )
                : "—"
            }
            description="Highest one-bedroom median rent in the current selection."
          />

          <AnalysisCard
            label="Tightest Vacancy"
            city={
              lowestVacancy?.city ??
              "—"
            }
            value={
              lowestVacancy
                ? `${lowestVacancy.vacancy_rate.toFixed(
                    1
                  )}%`
                : "—"
            }
            description="Lowest residential rental vacancy rate in the current selection."
          />

        </div>

      </section>

      <section className="comparison-section">

        <div className="comparison-heading">

          <p className="section-label">
            PRICE COMPARISON
          </p>

          <h2>
            ENTRY COST
          </h2>

        </div>

        <div className="comparison-list">

          {filteredMarkets.map(
            (market, index) => {

              const width =
                (market.median_price /
                  maxPrice) *
                100;

              return (
                <div
                  className="comparison-row"
                  key={market.id}
                >

                  <div className="comparison-city">

                    <strong>
                      {market.city}
                    </strong>

                    <span>
                      {market.region} ·{" "}
                      {market.country}
                    </span>

                  </div>

                  <div className="bar-track">

                    <motion.div
                      className="bar-fill"
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: `${width}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay:
                          index * 0.04,
                      }}
                      viewport={{
                        once: true,
                      }}
                    />

                  </div>

                  <div className="comparison-values">

                    <strong>
                      {money(
                        market.median_price
                      )}
                    </strong>

                    <span>
                      $
                      {market.price_per_sqft.toLocaleString()}
                      /SF
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </section>

      <section className="analysis-section">

        <div className="analysis-copy">

          <p className="section-label">
            MARKET LIQUIDITY
          </p>

          <h2 className="analysis-title">
            SUPPLY,
            <br />
            DEMAND.
          </h2>

        </div>

        <div className="analysis-grid">

          <AnalysisCard
            label="Total Inventory"
            city="Tracked Markets"
            value={compactNumber(
              totalInventory
            )}
            description="Combined residential inventory across the current market selection."
          />

          <AnalysisCard
            label="Average Days on Market"
            city={
              countryFilter === "ALL"
                ? "North America"
                : countryFilter
            }
            value={`${average(
              filteredMarkets.map(
                (m) =>
                  m.days_on_market
              )
            ).toFixed(0)} DAYS`}
            description="Average time listed properties remain on market."
          />

          <AnalysisCard
            label="Average Vacancy"
            city={
              countryFilter === "ALL"
                ? "North America"
                : countryFilter
            }
            value={`${average(
              filteredMarkets.map(
                (m) =>
                  m.vacancy_rate
              )
            ).toFixed(1)}%`}
            description="Average residential rental vacancy rate."
          />

          <AnalysisCard
            label="Average Rent Growth"
            city={
              countryFilter === "ALL"
                ? "North America"
                : countryFilter
            }
            value={`${average(
              filteredMarkets.map(
                (m) =>
                  m.rent_growth
              )
            ).toFixed(1)}%`}
            description="Average annual residential rent growth."
          />

        </div>

      </section>

      <section className="future-section">

        <p className="section-label">
          HABITAT DATA ENGINE
        </p>

        <h2>
          SQL
          <br />
          FASTAPI
          <br />
          NEXT.JS
          <br />
          MARKET INTELLIGENCE
        </h2>

      </section>

    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="metric">

      <p>
        {label}
      </p>

      <strong>
        {value}
      </strong>

    </div>
  );
}

function AnalysisCard({
  label,
  city,
  value,
  description,
  negative = false,
}: {
  label: string;
  city: string;
  value: string;
  description: string;
  negative?: boolean;
}) {
  return (
    <motion.div
      className="analysis-card"
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
    >

      <p className="analysis-label">
        {label}
      </p>

      <h3>
        {city}
      </h3>

      <div
        className={
          negative
            ? "analysis-value negative"
            : "analysis-value"
        }
      >
        {value}
      </div>

      <p className="analysis-description">
        {description}
      </p>

    </motion.div>
  );
}

function money(value: number) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(value || 0);
}

function compactMoney(
  value: number
) {
  if (value >= 1000000) {
    return `$${(
      value / 1000000
    ).toFixed(2)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(
      value / 1000
    )}K`;
  }

  return `$${value}`;
}

function compactNumber(
  value: number
) {
  if (value >= 1000000) {
    return `${(
      value / 1000000
    ).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(
      value / 1000
    )}K`;
  }

  return `${value}`;
}

function average(
  values: number[]
) {
  if (!values.length) {
    return 0;
  }

  return (
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );
}