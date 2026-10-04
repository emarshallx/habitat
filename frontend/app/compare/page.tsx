"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Market = {
  id: number;
  city: string;
  region: string;
  country: string;

  median_price: number;
  median_rent: number;
  yoy_change: number;
  vacancy_rate: number;
  rent_growth: number;
  price_per_sqft: number;
};

export default function ComparePage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCities, setSelectedCities] = useState<string[]>([
    "Toronto",
    "Chicago",
    "Miami",
  ]);

  useEffect(() => {
    async function loadMarkets() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/markets"
        );

        if (!response.ok) {
          throw new Error("Unable to load market data");
        }

        const data = await response.json();

        setMarkets(data);
      } catch (error) {
        console.error("Compare API error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMarkets();
  }, []);

  const selectedMarkets = useMemo(() => {
    return selectedCities
      .map((city) =>
        markets.find((market) => market.city === city)
      )
      .filter(Boolean) as Market[];
  }, [markets, selectedCities]);

  const scoredMarkets = useMemo(() => {
    return selectedMarkets
      .map((market) => {
        const annualRent = market.median_rent * 12;

        const grossYield =
          market.median_price > 0
            ? (annualRent / market.median_price) * 100
            : 0;

        const affordabilityScore =
          market.median_price > 0
            ? Math.max(
                0,
                100 -
                  market.median_price / 15000
              )
            : 0;

        const score =
          grossYield * 8 +
          market.yoy_change * 4 +
          affordabilityScore * 0.35 -
          market.vacancy_rate * 1.5;

        return {
          ...market,
          grossYield,
          affordabilityScore,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [selectedMarkets]);

  const toggleMarket = (city: string) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length <= 2) {
        return;
      }

      setSelectedCities(
        selectedCities.filter(
          (selected) => selected !== city
        )
      );

      return;
    }

    if (selectedCities.length >= 4) {
      return;
    }

    setSelectedCities([
      ...selectedCities,
      city,
    ]);
  };

  const bestOverall = scoredMarkets[0];

  const bestYield = [...scoredMarkets].sort(
    (a, b) =>
      b.grossYield - a.grossYield
  )[0];

  const bestGrowth = [...scoredMarkets].sort(
    (a, b) =>
      b.yoy_change - a.yoy_change
  )[0];

  const bestVacancy = [...scoredMarkets].sort(
    (a, b) =>
      a.vacancy_rate - b.vacancy_rate
  )[0];

  const maxPrice = Math.max(
    ...selectedMarkets.map(
      (market) => market.median_price
    ),
    1
  );

  const maxRent = Math.max(
    ...selectedMarkets.map(
      (market) => market.median_rent
    ),
    1
  );

  const maxScore = Math.max(
    ...scoredMarkets.map(
      (market) => market.score
    ),
    1
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      <header className="flex items-center justify-between border-b border-white/10 px-6 py-6 md:px-12">

        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.25em]"
        >
          HABITAT//
        </Link>

        <div className="flex flex-wrap gap-6 text-[10px] tracking-[0.2em] text-white/40">
          <Link href="/mortgage">MORTGAGE</Link>
          <Link href="/rentals">RENTALS</Link>
          <Link href="/commercial">COMMERCIAL</Link>
          <Link href="/investment">INVESTMENT</Link>
          <span>COMPARE</span>
        </div>

      </header>

      <section className="px-6 pb-28 pt-16 md:px-12">

        <p className="mb-5 text-xs tracking-[0.28em] text-lime-300">
          SQL-POWERED MARKET DECISION ENGINE
        </p>

        <h1 className="text-[17vw] font-semibold leading-[0.76] tracking-[-0.075em] md:text-[9vw]">
          COMPARE
          <br />
          MARKETS
        </h1>

        <p className="mt-10 max-w-2xl text-sm leading-7 text-white/40">
          Select between two and four markets. HABITAT compares
          price, rent, growth, vacancy and gross rental yield using
          the central market database.
        </p>

        {loading ? (
          <div className="py-16 text-sm tracking-[0.2em] text-white/30">
            LOADING MARKET DATABASE...
          </div>
        ) : (
          <>
            <section className="mt-16">

              <p className="mb-4 text-[10px] tracking-[0.2em] text-white/35">
                SELECT MARKETS · MINIMUM 2 · MAXIMUM 4
              </p>

              <div className="flex flex-wrap gap-3">

                {markets.map((market) => {
                  const selected =
                    selectedCities.includes(
                      market.city
                    );

                  return (
                    <button
                      key={market.id}
                      onClick={() =>
                        toggleMarket(
                          market.city
                        )
                      }
                      className={
                        selected
                          ? "rounded-full bg-lime-300 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-black"
                          : "rounded-full border border-white/15 px-4 py-2 text-[10px] tracking-[0.12em] text-white/45 transition hover:border-white/40 hover:text-white"
                      }
                    >
                      {market.city.toUpperCase()}
                    </button>
                  );
                })}

              </div>

            </section>

            <section className="mt-20 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <WinnerCard
                label="Best Overall"
                city={
                  bestOverall?.city ?? "—"
                }
                value={
                  bestOverall
                    ? `${bestOverall.score.toFixed(
                        1
                      )} SCORE`
                    : "—"
                }
              />

              <WinnerCard
                label="Best Yield"
                city={
                  bestYield?.city ?? "—"
                }
                value={
                  bestYield
                    ? `${bestYield.grossYield.toFixed(
                        2
                      )}%`
                    : "—"
                }
              />

              <WinnerCard
                label="Best Growth"
                city={
                  bestGrowth?.city ?? "—"
                }
                value={
                  bestGrowth
                    ? `${bestGrowth.yoy_change > 0 ? "+" : ""}${bestGrowth.yoy_change.toFixed(
                        1
                      )}%`
                    : "—"
                }
              />

              <WinnerCard
                label="Lowest Vacancy"
                city={
                  bestVacancy?.city ?? "—"
                }
                value={
                  bestVacancy
                    ? `${bestVacancy.vacancy_rate.toFixed(
                        1
                      )}%`
                    : "—"
                }
              />

            </section>

            <section className="mt-28">

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                SIDE BY SIDE
              </p>

              <h2 className="mb-14 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                MARKET
                <span className="text-white/20">
                  {" "} / MATRIX
                </span>
              </h2>

              <div className="overflow-x-auto">

                <div
                  className="min-w-[900px]"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `200px repeat(${selectedMarkets.length}, minmax(180px, 1fr))`,
                  }}
                >

                  <div className="border-b border-white/10 p-4" />

                  {selectedMarkets.map(
                    (market) => (
                      <div
                        key={market.id}
                        className="border-b border-white/10 p-4"
                      >

                        <div className="text-xl font-medium">
                          {market.city}
                        </div>

                        <div className="mt-1 text-[10px] tracking-[0.14em] text-white/30">
                          {market.region} ·{" "}
                          {market.country}
                        </div>

                      </div>
                    )
                  )}

                  <MatrixLabel label="Median Price" />

                  {selectedMarkets.map(
                    (market) => (
                      <MatrixValue
                        key={`${market.id}-price`}
                        value={money(
                          market.median_price
                        )}
                      />
                    )
                  )}

                  <MatrixLabel label="Monthly Rent" />

                  {selectedMarkets.map(
                    (market) => (
                      <MatrixValue
                        key={`${market.id}-rent`}
                        value={money(
                          market.median_rent
                        )}
                      />
                    )
                  )}

                  <MatrixLabel label="YoY Growth" />

                  {selectedMarkets.map(
                    (market) => (
                      <MatrixValue
                        key={`${market.id}-growth`}
                        value={`${market.yoy_change > 0 ? "+" : ""}${market.yoy_change.toFixed(
                          1
                        )}%`}
                        positive={
                          market.yoy_change >= 0
                        }
                        negative={
                          market.yoy_change < 0
                        }
                      />
                    )
                  )}

                  <MatrixLabel label="Vacancy" />

                  {selectedMarkets.map(
                    (market) => (
                      <MatrixValue
                        key={`${market.id}-vacancy`}
                        value={`${market.vacancy_rate.toFixed(
                          1
                        )}%`}
                      />
                    )
                  )}

                  <MatrixLabel label="Price / Sq Ft" />

                  {selectedMarkets.map(
                    (market) => (
                      <MatrixValue
                        key={`${market.id}-psf`}
                        value={`$${market.price_per_sqft.toLocaleString()}`}
                      />
                    )
                  )}

                  <MatrixLabel label="Gross Yield" />

                  {selectedMarkets.map(
                    (market) => {
                      const grossYield =
                        market.median_price >
                        0
                          ? ((market.median_rent *
                              12) /
                              market.median_price) *
                            100
                          : 0;

                      return (
                        <MatrixValue
                          key={`${market.id}-yield`}
                          value={`${grossYield.toFixed(
                            2
                          )}%`}
                          positive={
                            grossYield >= 5
                          }
                        />
                      );
                    }
                  )}

                </div>

              </div>

            </section>

            <section className="mt-28">

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                PRICE
              </p>

              <h2 className="mb-14 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                ENTRY
                <span className="text-white/20">
                  {" "} / COST
                </span>
              </h2>

              <div>

                {selectedMarkets.map(
                  (market, index) => {
                    const width =
                      (market.median_price /
                        maxPrice) *
                      100;

                    return (
                      <ComparisonBar
                        key={market.id}
                        index={index}
                        city={
                          market.city
                        }
                        value={money(
                          market.median_price
                        )}
                        width={width}
                      />
                    );
                  }
                )}

              </div>

            </section>

            <section className="mt-28">

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                RENTAL POWER
              </p>

              <h2 className="mb-14 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                RENT
                <span className="text-white/20">
                  {" "} / MONTH
                </span>
              </h2>

              <div>

                {selectedMarkets.map(
                  (market, index) => {
                    const width =
                      (market.median_rent /
                        maxRent) *
                      100;

                    return (
                      <ComparisonBar
                        key={market.id}
                        index={index}
                        city={
                          market.city
                        }
                        value={money(
                          market.median_rent
                        )}
                        width={width}
                      />
                    );
                  }
                )}

              </div>

            </section>

            <section className="mt-28">

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                HABITAT SCORE
              </p>

              <h2 className="mb-14 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                INVESTMENT
                <span className="text-white/20">
                  {" "} / RANKING
                </span>
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                {scoredMarkets.map(
                  (market, index) => {
                    const width =
                      (market.score /
                        maxScore) *
                      100;

                    return (
                      <motion.div
                        key={
                          market.id
                        }
                        whileHover={{
                          y: -5,
                        }}
                        className="min-h-[290px] border border-white/10 bg-white/[0.015] p-6"
                      >

                        <div className="flex items-start justify-between">

                          <div>

                            <div className="text-[10px] tracking-[0.17em] text-white/30">
                              RANK{" "}
                              {index +
                                1}
                            </div>

                            <div className="mt-2 text-3xl font-medium">
                              {
                                market.city
                              }
                            </div>

                          </div>

                          <div className="text-4xl font-medium tracking-[-0.05em] text-lime-300">
                            {market.score.toFixed(
                              1
                            )}
                          </div>

                        </div>

                        <div className="mt-10 h-[5px] bg-white/[0.08]">

                          <motion.div
                            initial={{
                              width:
                                0,
                            }}
                            whileInView={{
                              width: `${width}%`,
                            }}
                            transition={{
                              duration:
                                0.8,
                              delay:
                                index *
                                0.05,
                            }}
                            viewport={{
                              once:
                                true,
                            }}
                            className="h-full bg-lime-300 shadow-[0_0_20px_rgba(183,255,71,0.35)]"
                          />

                        </div>

                        <div className="mt-10 grid grid-cols-3 gap-5">

                          <MiniStat
                            label="Yield"
                            value={`${market.grossYield.toFixed(
                              2
                            )}%`}
                          />

                          <MiniStat
                            label="Growth"
                            value={`${market.yoy_change > 0 ? "+" : ""}${market.yoy_change.toFixed(
                              1
                            )}%`}
                          />

                          <MiniStat
                            label="Vacancy"
                            value={`${market.vacancy_rate.toFixed(
                              1
                            )}%`}
                          />

                        </div>

                      </motion.div>
                    );
                  }
                )}

              </div>

            </section>

            <section className="mt-32 border-t border-white/10 pt-20">

              <p className="mb-4 text-xs tracking-[0.25em] text-lime-300">
                DATABASE STATUS
              </p>

              <h2 className="max-w-6xl text-6xl font-semibold leading-[0.84] tracking-[-0.07em] text-white/20 md:text-9xl">
                ONE DATABASE.
                MANY MARKETS.
                BETTER DECISIONS.
              </h2>

            </section>

          </>
        )}

      </section>

    </main>
  );
}

function WinnerCard({
  label,
  city,
  value,
}: {
  label: string;
  city: string;
  value: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="min-h-[210px] border border-white/10 bg-white/[0.015] p-6"
    >

      <p className="text-[10px] tracking-[0.18em] text-white/35">
        {label.toUpperCase()}
      </p>

      <div className="mt-10 text-3xl font-medium">
        {city}
      </div>

      <div className="mt-4 text-xl text-lime-300">
        {value}
      </div>

    </motion.div>
  );
}

function MatrixLabel({
  label,
}: {
  label: string;
}) {
  return (
    <div className="border-b border-white/[0.08] p-4 text-[10px] tracking-[0.16em] text-white/30">
      {label.toUpperCase()}
    </div>
  );
}

function MatrixValue({
  value,
  positive = false,
  negative = false,
}: {
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  let className =
    "border-b border-white/[0.08] p-4 text-sm";

  if (positive) {
    className +=
      " text-lime-300";
  }

  if (negative) {
    className +=
      " text-red-400";
  }

  return (
    <div className={className}>
      {value}
    </div>
  );
}

function ComparisonBar({
  city,
  value,
  width,
  index,
}: {
  city: string;
  value: string;
  width: number;
  index: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_2fr_auto] items-center gap-6 border-t border-white/[0.08] py-6">

      <div className="text-xl">
        {city}
      </div>

      <div className="h-[5px] bg-white/[0.08]">

        <motion.div
          initial={{
            width: 0,
          }}
          whileInView={{
            width: `${width}%`,
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.05,
          }}
          viewport={{
            once: true,
          }}
          className="h-full bg-lime-300 shadow-[0_0_20px_rgba(183,255,71,0.35)]"
        />

      </div>

      <div className="min-w-[120px] text-right text-xl">
        {value}
      </div>

    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="text-[9px] tracking-[0.16em] text-white/30">
        {label.toUpperCase()}
      </div>

      <div className="mt-2 text-lg">
        {value}
      </div>

    </div>
  );
}

function money(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }
  ).format(value || 0);
}