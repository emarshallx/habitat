"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type PropertyType = "Office" | "Retail" | "Industrial" | "Multifamily";

type CommercialMarket = {
  id: number;
  market_id: number;
  city: string;
  region: string;
  country: string;
  period: string;
  property_type: PropertyType;
  asking_rent: number;
  effective_rent: number;
  vacancy_rate: number;
  availability_rate: number;
  absorption: number;
  cap_rate: number;
  inventory_sqft: number;
  ti_allowance: number;
};

export default function CommercialPage() {
  const [markets, setMarkets] = useState<CommercialMarket[]>([]);
  const [loading, setLoading] = useState(true);

  const [country, setCountry] = useState<"ALL" | "Canada" | "USA">("ALL");
  const [propertyType, setPropertyType] = useState<PropertyType>("Office");

  useEffect(() => {
    async function loadCommercialMarkets() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/commercial"
        );

        if (!response.ok) {
          throw new Error("Unable to load commercial market data");
        }

        const data = await response.json();
        setMarkets(data);
      } catch (error) {
        console.error("Commercial API error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCommercialMarkets();
  }, []);

  const filtered = useMemo(() => {
    return markets.filter((market) => {
      const countryMatch =
        country === "ALL" || market.country === country;

      const typeMatch =
        market.property_type === propertyType;

      return countryMatch && typeMatch;
    });
  }, [markets, country, propertyType]);

  const avgRent = average(
    filtered.map((market) => market.asking_rent)
  );

  const avgVacancy = average(
    filtered.map((market) => market.vacancy_rate)
  );

  const avgCapRate = average(
    filtered.map((market) => market.cap_rate)
  );

  const bestAbsorption = useMemo(() => {
    if (!filtered.length) return null;

    return [...filtered].sort(
      (a, b) => b.absorption - a.absorption
    )[0];
  }, [filtered]);

  const lowestVacancy = useMemo(() => {
    if (!filtered.length) return null;

    return [...filtered].sort(
      (a, b) => a.vacancy_rate - b.vacancy_rate
    )[0];
  }, [filtered]);

  const highestCapRate = useMemo(() => {
    if (!filtered.length) return null;

    return [...filtered].sort(
      (a, b) => b.cap_rate - a.cap_rate
    )[0];
  }, [filtered]);

  const maxRent = Math.max(
    ...filtered.map((market) => market.asking_rent),
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
          <Link href="/rentals">RENTALS</Link>
          <span>COMMERCIAL</span>
        </div>

      </header>

      <section className="px-6 pb-28 pt-16 md:px-12">

        <p className="mb-5 text-xs tracking-[0.28em] text-lime-300">
          SQL-POWERED COMMERCIAL REAL ESTATE INTELLIGENCE
        </p>

        <h1 className="text-[17vw] font-semibold leading-[0.76] tracking-[-0.075em] md:text-[9vw]">
          COMMERCIAL
          <br />
          MARKETS
        </h1>

        <div className="mt-16 flex flex-col gap-6 border-y border-white/10 py-6 xl:flex-row xl:items-center xl:justify-between">

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

            {(["Office", "Retail", "Industrial", "Multifamily"] as PropertyType[]).map(
              (type) => (
                <FilterButton
                  key={type}
                  active={propertyType === type}
                  onClick={() => setPropertyType(type)}
                >
                  {type.toUpperCase()}
                </FilterButton>
              )
            )}

          </div>

        </div>

        {loading ? (
          <div className="py-16 text-sm tracking-[0.2em] text-white/30">
            LOADING COMMERCIAL DATABASE...
          </div>
        ) : (
          <>
            <section className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                label="Average Asking Rent"
                value={`$${avgRent.toFixed(2)}`}
                sub="/ SF"
              />

              <MetricCard
                label="Average Vacancy"
                value={`${avgVacancy.toFixed(1)}%`}
              />

              <MetricCard
                label="Average Cap Rate"
                value={`${avgCapRate.toFixed(1)}%`}
              />

              <MetricCard
                label="Best Absorption"
                value={
                  bestAbsorption
                    ? compactNumber(bestAbsorption.absorption)
                    : "—"
                }
                sub={bestAbsorption?.city}
                positive
              />

            </section>

            <section className="mt-28">

              <div className="mb-12">

                <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                  LEASING MARKET
                </p>

                <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                  ASKING RENT
                  <span className="text-white/20"> / SF</span>
                </h2>

              </div>

              <div>

                {filtered.map((market, index) => {
                  const width =
                    (market.asking_rent / maxRent) * 100;

                  return (
                    <motion.div
                      key={market.id}
                      className="grid grid-cols-[1fr_2fr_auto] items-center gap-6 border-t border-white/[0.08] py-6"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      viewport={{ once: true }}
                    >

                      <div>

                        <div className="text-xl font-medium">
                          {market.city}
                        </div>

                        <div className="mt-1 text-[10px] tracking-[0.14em] text-white/30">
                          {market.region} · {market.country}
                        </div>

                      </div>

                      <div className="h-[5px] bg-white/[0.08]">

                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${width}%`,
                          }}
                          transition={{
                            duration: 0.8,
                          }}
                          viewport={{ once: true }}
                          className="h-full bg-lime-300 shadow-[0_0_18px_rgba(183,255,71,0.35)]"
                        />

                      </div>

                      <div className="text-right">

                        <div className="text-xl">
                          ${market.asking_rent.toFixed(2)}
                        </div>

                        <div className="text-[10px] text-white/30">
                          EFFECTIVE ${market.effective_rent.toFixed(2)}
                        </div>

                      </div>

                    </motion.div>
                  );
                })}

              </div>

            </section>

            <section className="mt-28">

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                SUPPLY & DEMAND
              </p>

              <h2 className="mb-14 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                MARKET HEALTH
              </h2>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {filtered.map((market) => (
                  <motion.div
                    key={market.id}
                    whileHover={{ y: -5 }}
                    className="min-h-[330px] border border-white/10 bg-white/[0.015] p-6"
                  >

                    <div className="flex justify-between">

                      <div>

                        <div className="text-2xl font-medium">
                          {market.city}
                        </div>

                        <div className="mt-1 text-[10px] tracking-[0.15em] text-white/30">
                          {market.property_type.toUpperCase()}
                        </div>

                      </div>

                      <div
                        className={
                          market.absorption >= 0
                            ? "text-lime-300"
                            : "text-red-400"
                        }
                      >
                        {market.absorption >= 0 ? "↗" : "↘"}
                      </div>

                    </div>

                    <div className="mt-14 grid grid-cols-2 gap-8">

                      <Stat
                        label="Vacancy"
                        value={`${market.vacancy_rate.toFixed(1)}%`}
                      />

                      <Stat
                        label="Availability"
                        value={`${market.availability_rate.toFixed(1)}%`}
                      />

                      <Stat
                        label="Absorption"
                        value={compactNumber(market.absorption)}
                        positive={market.absorption >= 0}
                        negative={market.absorption < 0}
                      />

                      <Stat
                        label="Cap Rate"
                        value={`${market.cap_rate.toFixed(1)}%`}
                      />

                    </div>

                  </motion.div>
                ))}

              </div>

            </section>

            <section className="mt-28">

              <div className="mb-12">

                <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                  MARKET SIGNALS
                </p>

                <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                  WHERE
                  <span className="text-white/20"> / CAPITAL MOVES</span>
                </h2>

              </div>

              <div className="grid gap-4 md:grid-cols-3">

                <SignalCard
                  label="Lowest Vacancy"
                  city={lowestVacancy?.city ?? "—"}
                  value={
                    lowestVacancy
                      ? `${lowestVacancy.vacancy_rate.toFixed(1)}%`
                      : "—"
                  }
                />

                <SignalCard
                  label="Highest Cap Rate"
                  city={highestCapRate?.city ?? "—"}
                  value={
                    highestCapRate
                      ? `${highestCapRate.cap_rate.toFixed(1)}%`
                      : "—"
                  }
                />

                <SignalCard
                  label="Strongest Absorption"
                  city={bestAbsorption?.city ?? "—"}
                  value={
                    bestAbsorption
                      ? compactNumber(bestAbsorption.absorption)
                      : "—"
                  }
                />

              </div>

            </section>

            <section className="mt-28">

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                LEASE ECONOMICS
              </p>

              <h2 className="mb-14 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                EFFECTIVE RENT
                <span className="text-white/20"> / COST</span>
              </h2>

              <div className="overflow-x-auto border-t border-white/10">

                <div className="min-w-[900px]">

                  <div className="grid grid-cols-7 border-b border-white/10 px-4 py-4 text-[10px] tracking-[0.16em] text-white/30">
                    <span>MARKET</span>
                    <span>ASKING RENT</span>
                    <span>EFFECTIVE RENT</span>
                    <span>VACANCY</span>
                    <span>CAP RATE</span>
                    <span>TI ALLOWANCE</span>
                    <span className="text-right">INVENTORY</span>
                  </div>

                  {filtered.map((market) => (
                    <div
                      key={market.id}
                      className="grid grid-cols-7 border-b border-white/[0.07] px-4 py-5 text-sm transition hover:bg-white/[0.025]"
                    >

                      <span>
                        {market.city}
                      </span>

                      <span>
                        ${market.asking_rent.toFixed(2)}
                      </span>

                      <span className="text-lime-300">
                        ${market.effective_rent.toFixed(2)}
                      </span>

                      <span className="text-white/50">
                        {market.vacancy_rate.toFixed(1)}%
                      </span>

                      <span>
                        {market.cap_rate.toFixed(1)}%
                      </span>

                      <span className="text-white/50">
                        ${market.ti_allowance}/SF
                      </span>

                      <span className="text-right text-white/50">
                        {compactNumber(market.inventory_sqft)} SF
                      </span>

                    </div>
                  ))}

                </div>

              </div>

            </section>

            <section className="mt-28 border border-white/10 bg-white/[0.015] p-8 md:p-12">

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                PORTFOLIO VIEW
              </p>

              <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                LEASING IS
                <br />
                MORE THAN RENT.
              </h2>

              <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <LeaseMetric
                  label="Avg Asking"
                  value={`$${avgRent.toFixed(2)}/SF`}
                />

                <LeaseMetric
                  label="Avg Vacancy"
                  value={`${avgVacancy.toFixed(1)}%`}
                />

                <LeaseMetric
                  label="Avg Cap Rate"
                  value={`${avgCapRate.toFixed(1)}%`}
                />

                <LeaseMetric
                  label="Markets"
                  value={`${filtered.length}`}
                />

              </div>

            </section>

            <section className="mt-32 border-t border-white/10 pt-20">

              <p className="mb-4 text-xs tracking-[0.25em] text-lime-300">
                DATABASE STATUS
              </p>

              <h2 className="max-w-6xl text-6xl font-semibold leading-[0.84] tracking-[-0.07em] text-white/20 md:text-9xl">
                COMMERCIAL DATA
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

function SignalCard({
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
      whileHover={{ y: -5 }}
      className="min-h-[220px] border border-white/10 bg-white/[0.015] p-6"
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

function Stat({
  label,
  value,
  positive = false,
  negative = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  let valueClass = "text-white";

  if (positive) valueClass = "text-lime-300";
  if (negative) valueClass = "text-red-400";

  return (
    <div>
      <div className="text-[9px] tracking-[0.16em] text-white/30">
        {label.toUpperCase()}
      </div>

      <div className={`mt-2 text-xl ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function LeaseMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-white/10 pt-5">
      <div className="text-[9px] tracking-[0.17em] text-white/30">
        {label.toUpperCase()}
      </div>

      <div className="mt-3 text-2xl text-lime-300">
        {value}
      </div>
    </div>
  );
}

function average(values: number[]) {
  if (!values.length) return 0;

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
}

function compactNumber(value: number) {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);

  if (absolute >= 1000000000) {
    return `${sign}${(absolute / 1000000000).toFixed(1)}B`;
  }

  if (absolute >= 1000000) {
    return `${sign}${(absolute / 1000000).toFixed(1)}M`;
  }

  if (absolute >= 1000) {
    return `${sign}${Math.round(absolute / 1000)}K`;
  }

  return `${value}`;
}