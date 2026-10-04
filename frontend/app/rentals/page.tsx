"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type RentalMarket = {
  id: number;
  city: string;
  region: string;
  country: string;

  studio_rent: number;
  median_rent: number;
  two_bed_rent: number;
  three_bed_rent: number;

  vacancy_rate: number;
  rent_growth: number;
  rent_per_sqft: number;

  median_price: number;
};

type BedroomType = "Studio" | "1 Bed" | "2 Bed" | "3 Bed";

export default function RentalAnalytics() {
  const [markets, setMarkets] = useState<RentalMarket[]>([]);
  const [loading, setLoading] = useState(true);

  const [country, setCountry] = useState<"ALL" | "Canada" | "USA">("ALL");
  const [bedroom, setBedroom] = useState<BedroomType>("1 Bed");

  useEffect(() => {
    async function loadMarkets() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/markets"
        );

        if (!response.ok) {
          throw new Error("Unable to load rental market data");
        }

        const data = await response.json();

        setMarkets(data);
      } catch (error) {
        console.error("Rental API error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMarkets();
  }, []);

  const filtered = useMemo(() => {
    if (country === "ALL") {
      return markets;
    }

    return markets.filter(
      (market) => market.country === country
    );
  }, [markets, country]);

  const rentFor = (market: RentalMarket) => {
    if (bedroom === "Studio") {
      return market.studio_rent;
    }

    if (bedroom === "1 Bed") {
      return market.median_rent;
    }

    if (bedroom === "2 Bed") {
      return market.two_bed_rent;
    }

    return market.three_bed_rent;
  };

  const averageRent = useMemo(() => {
    if (!filtered.length) return 0;

    return (
      filtered.reduce(
        (sum, market) => sum + rentFor(market),
        0
      ) / filtered.length
    );
  }, [filtered, bedroom]);

  const highestRent = useMemo(() => {
    if (!filtered.length) return null;

    return [...filtered].sort(
      (a, b) => rentFor(b) - rentFor(a)
    )[0];
  }, [filtered, bedroom]);

  const fastestGrowth = useMemo(() => {
    if (!filtered.length) return null;

    return [...filtered].sort(
      (a, b) => b.rent_growth - a.rent_growth
    )[0];
  }, [filtered]);

  const lowestVacancy = useMemo(() => {
    if (!filtered.length) return null;

    return [...filtered].sort(
      (a, b) => a.vacancy_rate - b.vacancy_rate
    )[0];
  }, [filtered]);

  const maxRent = Math.max(
    ...filtered.map((market) => rentFor(market)),
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

        <div className="flex gap-6 text-[10px] tracking-[0.2em] text-white/40">
          <Link href="/mortgage">MORTGAGE</Link>
          <span>RENTAL ANALYTICS</span>
        </div>

      </header>

      <section className="px-6 pb-24 pt-16 md:px-12">

        <div className="max-w-7xl">

          <p className="mb-5 text-xs tracking-[0.28em] text-lime-300">
            SQL-POWERED RESIDENTIAL LEASING INTELLIGENCE
          </p>

          <h1 className="text-[18vw] font-semibold leading-[0.76] tracking-[-0.075em] md:text-[10vw]">
            RENTAL
            <br />
            MARKET
          </h1>

        </div>

        <div className="mt-16 flex flex-wrap justify-between gap-8 border-y border-white/10 py-6">

          <div className="flex flex-wrap gap-3">

            <FilterButton
              active={country === "ALL"}
              onClick={() => setCountry("ALL")}
            >
              ALL
            </FilterButton>

            <FilterButton
              active={country === "Canada"}
              onClick={() => setCountry("Canada")}
            >
              CANADA
            </FilterButton>

            <FilterButton
              active={country === "USA"}
              onClick={() => setCountry("USA")}
            >
              USA
            </FilterButton>

          </div>

          <div className="flex flex-wrap gap-3">

            {(["Studio", "1 Bed", "2 Bed", "3 Bed"] as BedroomType[]).map(
              (type) => (
                <FilterButton
                  key={type}
                  active={bedroom === type}
                  onClick={() => setBedroom(type)}
                >
                  {type.toUpperCase()}
                </FilterButton>
              )
            )}

          </div>

        </div>

        {loading ? (
          <div className="py-16 text-sm tracking-[0.2em] text-white/30">
            LOADING RENTAL DATABASE...
          </div>
        ) : (
          <>
            <section className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                label={`Average ${bedroom} Rent`}
                value={money(averageRent)}
              />

              <MetricCard
                label="Highest Rent"
                value={
                  highestRent
                    ? money(rentFor(highestRent))
                    : "—"
                }
                sub={highestRent?.city}
              />

              <MetricCard
                label="Fastest Rent Growth"
                value={
                  fastestGrowth
                    ? `${fastestGrowth.rent_growth > 0 ? "+" : ""}${fastestGrowth.rent_growth.toFixed(1)}%`
                    : "—"
                }
                sub={fastestGrowth?.city}
                positive
              />

              <MetricCard
                label="Tightest Vacancy"
                value={
                  lowestVacancy
                    ? `${lowestVacancy.vacancy_rate.toFixed(1)}%`
                    : "—"
                }
                sub={lowestVacancy?.city}
              />

            </section>

            <section className="mt-28">

              <div className="mb-12">

                <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                  RENT COMPARISON
                </p>

                <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                  {bedroom.toUpperCase()}
                  <span className="text-white/20">
                    {" "} / MONTHLY RENT
                  </span>
                </h2>

              </div>

              <div className="space-y-1">

                {filtered.map((market, index) => {
                  const rent = rentFor(market);
                  const width = (rent / maxRent) * 100;

                  return (
                    <motion.div
                      key={market.id}
                      className="grid grid-cols-[1fr_2fr_auto] items-center gap-6 border-t border-white/[0.08] py-6"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      viewport={{ once: true }}
                    >

                      <div>

                        <div className="text-xl font-medium">
                          {market.city}
                        </div>

                        <div className="mt-1 text-[10px] tracking-[0.15em] text-white/30">
                          {market.region} · {market.country}
                        </div>

                      </div>

                      <div className="h-[5px] overflow-hidden bg-white/[0.08]">

                        <motion.div
                          className="h-full bg-lime-300 shadow-[0_0_20px_rgba(183,255,71,0.35)]"
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${width}%`,
                          }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.04,
                          }}
                          viewport={{ once: true }}
                        />

                      </div>

                      <div className="min-w-[110px] text-right text-xl font-medium">
                        {money(rent)}
                      </div>

                    </motion.div>
                  );
                })}

              </div>

            </section>

            <section className="mt-28">

              <div className="mb-12">

                <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                  MARKET HEALTH
                </p>

                <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                  VACANCY
                  <span className="text-white/20">
                    {" "} / GROWTH
                  </span>
                </h2>

              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                {filtered.map((market) => (
                  <motion.div
                    key={market.id}
                    whileHover={{ y: -5 }}
                    className="min-h-[270px] border border-white/10 bg-white/[0.015] p-6"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <div className="text-xl font-medium">
                          {market.city}
                        </div>

                        <div className="mt-1 text-[10px] tracking-[0.15em] text-white/30">
                          {market.region}
                        </div>

                      </div>

                      <div
                        className={
                          market.rent_growth >= 0
                            ? "text-sm text-lime-300"
                            : "text-sm text-red-400"
                        }
                      >
                        {market.rent_growth >= 0 ? "↗" : "↘"}{" "}
                        {Math.abs(
                          market.rent_growth
                        ).toFixed(1)}
                        %
                      </div>

                    </div>

                    <div className="mt-14">

                      <div className="text-[10px] tracking-[0.18em] text-white/30">
                        VACANCY
                      </div>

                      <div className="mt-2 text-4xl font-medium tracking-[-0.05em]">
                        {market.vacancy_rate.toFixed(1)}%
                      </div>

                    </div>

                    <div className="mt-8">

                      <div className="text-[10px] tracking-[0.18em] text-white/30">
                        RENT / SQ FT
                      </div>

                      <div className="mt-2 text-xl">
                        ${market.rent_per_sqft.toFixed(2)}
                      </div>

                    </div>

                  </motion.div>
                ))}

              </div>

            </section>

            <section className="mt-28">

              <div className="mb-12">

                <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                  INVESTOR VIEW
                </p>

                <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                  RENT
                  <span className="text-white/20">
                    {" "} / PRICE
                  </span>
                </h2>

              </div>

              <div className="overflow-x-auto border-t border-white/10">

                <div className="min-w-[780px]">

                  <div className="grid grid-cols-6 border-b border-white/10 px-4 py-4 text-[10px] tracking-[0.17em] text-white/30">
                    <span>MARKET</span>
                    <span>MONTHLY RENT</span>
                    <span>ANNUAL RENT</span>
                    <span>HOME PRICE</span>
                    <span>GROSS YIELD</span>
                    <span className="text-right">VACANCY</span>
                  </div>

                  {filtered.map((market) => {
                    const monthlyRent = rentFor(market);
                    const annualRent = monthlyRent * 12;

                    const grossYield =
                      market.median_price > 0
                        ? (annualRent / market.median_price) * 100
                        : 0;

                    return (
                      <div
                        key={market.id}
                        className="grid grid-cols-6 border-b border-white/[0.07] px-4 py-5 text-sm transition hover:bg-white/[0.025]"
                      >

                        <span>
                          {market.city}
                        </span>

                        <span>
                          {money(monthlyRent)}
                        </span>

                        <span className="text-white/45">
                          {money(annualRent)}
                        </span>

                        <span className="text-white/45">
                          {money(market.median_price)}
                        </span>

                        <span
                          className={
                            grossYield >= 5
                              ? "text-lime-300"
                              : "text-white"
                          }
                        >
                          {grossYield.toFixed(2)}%
                        </span>

                        <span className="text-right text-white/45">
                          {market.vacancy_rate.toFixed(1)}%
                        </span>

                      </div>
                    );
                  })}

                </div>

              </div>

            </section>

            <section className="mt-32 border-t border-white/10 pt-20">

              <p className="mb-4 text-xs tracking-[0.25em] text-lime-300">
                DATABASE STATUS
              </p>

              <h2 className="max-w-6xl text-6xl font-semibold leading-[0.85] tracking-[-0.065em] text-white/20 md:text-9xl">
                RENTAL DATA
                NOW LIVES
                IN SQL.
              </h2>

            </section>

          </>
        )}

      </section>

    </main>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-lime-300 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-black"
          : "rounded-full border border-white/15 px-4 py-2 text-[10px] tracking-[0.15em] text-white/45 transition hover:border-white/40 hover:text-white"
      }
    >
      {children}
    </button>
  );
}

function MetricCard({
  label,
  value,
  sub,
  positive = false,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="min-h-[190px] border border-white/10 bg-white/[0.015] p-6"
    >

      <p className="text-[10px] tracking-[0.18em] text-white/35">
        {label.toUpperCase()}
      </p>

      <div
        className={
          positive
            ? "mt-10 text-4xl font-medium tracking-[-0.05em] text-lime-300"
            : "mt-10 text-4xl font-medium tracking-[-0.05em]"
        }
      >
        {value}
      </div>

      {sub && (
        <div className="mt-3 text-xs text-white/30">
          {sub}
        </div>
      )}

    </motion.div>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}