"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InvestmentLab() {
  const [purchasePrice, setPurchasePrice] = useState(850000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(4.85);
  const [amortizationYears, setAmortizationYears] = useState(25);

  const [monthlyRent, setMonthlyRent] = useState(3900);
  const [vacancyPct, setVacancyPct] = useState(3);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(6200);
  const [insuranceAnnual, setInsuranceAnnual] = useState(1800);
  const [maintenancePct, setMaintenancePct] = useState(0.8);
  const [managementPct, setManagementPct] = useState(5);

  const [appreciationPct, setAppreciationPct] = useState(3);
  const [rentGrowthPct, setRentGrowthPct] = useState(2.5);

  const results = useMemo(() => {
    const downPayment = purchasePrice * (downPaymentPct / 100);
    const loanAmount = purchasePrice - downPayment;

    const monthlyRate = interestRate / 100 / 12;
    const paymentCount = amortizationYears * 12;

    const mortgagePayment =
      monthlyRate === 0
        ? loanAmount / paymentCount
        : loanAmount *
          ((monthlyRate * Math.pow(1 + monthlyRate, paymentCount)) /
            (Math.pow(1 + monthlyRate, paymentCount) - 1));

    const grossAnnualRent = monthlyRent * 12;
    const vacancyLoss = grossAnnualRent * (vacancyPct / 100);
    const effectiveGrossIncome = grossAnnualRent - vacancyLoss;

    const maintenance = purchasePrice * (maintenancePct / 100);
    const management = effectiveGrossIncome * (managementPct / 100);

    const operatingExpenses =
      propertyTaxAnnual +
      insuranceAnnual +
      maintenance +
      management;

    const noi = effectiveGrossIncome - operatingExpenses;

    const annualDebtService = mortgagePayment * 12;
    const cashFlow = noi - annualDebtService;

    const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

    const cashOnCash =
      downPayment > 0 ? (cashFlow / downPayment) * 100 : 0;

    const dscr =
      annualDebtService > 0 ? noi / annualDebtService : 0;

    const grossYield =
      purchasePrice > 0
        ? (grossAnnualRent / purchasePrice) * 100
        : 0;

    return {
      downPayment,
      loanAmount,
      mortgagePayment,
      grossAnnualRent,
      vacancyLoss,
      effectiveGrossIncome,
      operatingExpenses,
      noi,
      annualDebtService,
      cashFlow,
      capRate,
      cashOnCash,
      dscr,
      grossYield,
    };
  }, [
    purchasePrice,
    downPaymentPct,
    interestRate,
    amortizationYears,
    monthlyRent,
    vacancyPct,
    propertyTaxAnnual,
    insuranceAnnual,
    maintenancePct,
    managementPct,
  ]);

  const projection = useMemo(() => {
    const years = [];
    let propertyValue = purchasePrice;
    let rent = monthlyRent;

    for (let year = 1; year <= 10; year++) {
      propertyValue *= 1 + appreciationPct / 100;
      rent *= 1 + rentGrowthPct / 100;

      years.push({
        year,
        propertyValue,
        monthlyRent: rent,
      });
    }

    return years;
  }, [
    purchasePrice,
    monthlyRent,
    appreciationPct,
    rentGrowthPct,
  ]);

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
          <Link href="/commercial">COMMERCIAL</Link>
          <span>INVESTMENT</span>
        </div>
      </header>

      <section className="px-6 pb-28 pt-16 md:px-12">

        <p className="mb-5 text-xs tracking-[0.28em] text-lime-300">
          REAL ESTATE UNDERWRITING
        </p>

        <h1 className="text-[17vw] font-semibold leading-[0.76] tracking-[-0.075em] md:text-[9vw]">
          INVESTMENT
          <br />
          LAB
        </h1>

        <div className="mt-16 grid gap-8 xl:grid-cols-[0.9fr_1.4fr]">

          <section className="border border-white/10 bg-white/[0.02] p-6 md:p-8">

            <SectionTitle>ACQUISITION</SectionTitle>

            <InputField
              label="Purchase Price"
              prefix="$"
              value={purchasePrice}
              onChange={setPurchasePrice}
            />

            <InputField
              label="Down Payment"
              suffix="%"
              value={downPaymentPct}
              onChange={setDownPaymentPct}
              step={1}
            />

            <InputField
              label="Interest Rate"
              suffix="%"
              value={interestRate}
              onChange={setInterestRate}
              step={0.05}
            />

            <InputField
              label="Amortization"
              suffix="years"
              value={amortizationYears}
              onChange={setAmortizationYears}
              step={1}
            />

            <Divider />

            <SectionTitle>INCOME</SectionTitle>

            <InputField
              label="Monthly Rent"
              prefix="$"
              value={monthlyRent}
              onChange={setMonthlyRent}
            />

            <InputField
              label="Vacancy"
              suffix="%"
              value={vacancyPct}
              onChange={setVacancyPct}
              step={0.1}
            />

            <Divider />

            <SectionTitle>OPERATING COSTS</SectionTitle>

            <InputField
              label="Annual Property Tax"
              prefix="$"
              value={propertyTaxAnnual}
              onChange={setPropertyTaxAnnual}
            />

            <InputField
              label="Annual Insurance"
              prefix="$"
              value={insuranceAnnual}
              onChange={setInsuranceAnnual}
            />

            <InputField
              label="Maintenance"
              suffix="% of value"
              value={maintenancePct}
              onChange={setMaintenancePct}
              step={0.1}
            />

            <InputField
              label="Management Fee"
              suffix="% of rent"
              value={managementPct}
              onChange={setManagementPct}
              step={0.5}
            />

          </section>

          <section>

            <div className="grid gap-4 md:grid-cols-2">
              <HeroMetric
                label="Net Operating Income"
                value={money(results.noi)}
                highlight
              />

              <HeroMetric
                label="Annual Cash Flow"
                value={money(results.cashFlow)}
                negative={results.cashFlow < 0}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <SmallMetric
                label="Cap Rate"
                value={`${results.capRate.toFixed(2)}%`}
              />

              <SmallMetric
                label="Cash-on-Cash"
                value={`${results.cashOnCash.toFixed(2)}%`}
              />

              <SmallMetric
                label="DSCR"
                value={results.dscr.toFixed(2)}
              />

              <SmallMetric
                label="Gross Yield"
                value={`${results.grossYield.toFixed(2)}%`}
              />

              <SmallMetric
                label="Monthly Mortgage"
                value={money(results.mortgagePayment)}
              />

              <SmallMetric
                label="Loan Amount"
                value={money(results.loanAmount)}
              />

            </div>

            <div className="mt-4 border border-white/10 p-6 md:p-8">

              <p className="text-[10px] tracking-[0.2em] text-white/35">
                OPERATING STATEMENT
              </p>

              <div className="mt-8 space-y-5">

                <StatementRow
                  label="Gross Annual Rent"
                  value={results.grossAnnualRent}
                />

                <StatementRow
                  label="Vacancy Loss"
                  value={-results.vacancyLoss}
                  negative
                />

                <StatementRow
                  label="Effective Gross Income"
                  value={results.effectiveGrossIncome}
                />

                <StatementRow
                  label="Operating Expenses"
                  value={-results.operatingExpenses}
                  negative
                />

                <div className="border-t border-white/10 pt-5">

                  <StatementRow
                    label="NOI"
                    value={results.noi}
                    highlight
                  />

                </div>

                <StatementRow
                  label="Debt Service"
                  value={-results.annualDebtService}
                  negative
                />

                <div className="border-t border-white/10 pt-5">

                  <StatementRow
                    label="Cash Flow"
                    value={results.cashFlow}
                    highlight={results.cashFlow >= 0}
                    negative={results.cashFlow < 0}
                  />

                </div>

              </div>

            </div>

          </section>

        </div>

        <section className="mt-28">

          <div className="mb-12">

            <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
              RETURN PROFILE
            </p>

            <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
              DOES IT
              <span className="text-white/20"> WORK?</span>
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <ScoreCard
              label="Cap Rate"
              value={results.capRate}
              good={5}
              great={7}
            />

            <ScoreCard
              label="Cash-on-Cash"
              value={results.cashOnCash}
              good={5}
              great={8}
            />

            <ScoreCard
              label="DSCR"
              value={results.dscr}
              good={1.2}
              great={1.5}
              decimals={2}
            />

            <ScoreCard
              label="Gross Yield"
              value={results.grossYield}
              good={5}
              great={7}
            />

          </div>

        </section>

        <section className="mt-28 border border-white/10 bg-white/[0.015] p-7 md:p-10">

          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">

            <div>

              <p className="mb-4 text-xs tracking-[0.24em] text-lime-300">
                10 YEAR OUTLOOK
              </p>

              <h2 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                EQUITY
                <br />
                ENGINE
              </h2>

              <div className="mt-10">

                <InputField
                  label="Annual Appreciation"
                  suffix="%"
                  value={appreciationPct}
                  onChange={setAppreciationPct}
                  step={0.1}
                />

                <InputField
                  label="Annual Rent Growth"
                  suffix="%"
                  value={rentGrowthPct}
                  onChange={setRentGrowthPct}
                  step={0.1}
                />

              </div>

            </div>

            <div className="overflow-x-auto">

              <div className="min-w-[620px]">

                <div className="grid grid-cols-3 border-b border-white/10 py-4 text-[10px] tracking-[0.17em] text-white/30">
                  <span>YEAR</span>
                  <span>PROPERTY VALUE</span>
                  <span className="text-right">MONTHLY RENT</span>
                </div>

                {projection.map((row) => (
                  <div
                    key={row.year}
                    className="grid grid-cols-3 border-b border-white/[0.07] py-5 text-sm"
                  >
                    <span className="text-white/40">
                      {String(row.year).padStart(2, "0")}
                    </span>

                    <span>
                      {money(row.propertyValue)}
                    </span>

                    <span className="text-right text-lime-300">
                      {money(row.monthlyRent)}
                    </span>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>

        <section className="mt-32 border-t border-white/10 pt-20">

          <p className="mb-4 text-xs tracking-[0.25em] text-lime-300">
            INVESTMENT SIGNAL
          </p>

          <h2 className="max-w-6xl text-6xl font-semibold leading-[0.84] tracking-[-0.07em] text-white/20 md:text-9xl">
            PRICE IS WHAT YOU PAY.
            CASH FLOW IS WHAT
            YOU LIVE WITH.
          </h2>

        </section>

      </section>

    </main>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-8 text-[10px] tracking-[0.2em] text-white/35">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-10 border-t border-white/10" />;
}

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 100,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="mb-7 block">

      <span className="mb-3 block text-[10px] tracking-[0.18em] text-white/40">
        {label.toUpperCase()}
      </span>

      <div className="flex items-center border-b border-white/15 pb-3 focus-within:border-lime-300">

        {prefix && (
          <span className="mr-2 text-white/35">
            {prefix}
          </span>
        )}

        <input
          type="number"
          value={value}
          step={step}
          onChange={(event) =>
            onChange(Number(event.target.value))
          }
          className="min-w-0 flex-1 bg-transparent text-2xl outline-none"
        />

        {suffix && (
          <span className="ml-3 text-xs text-white/35">
            {suffix}
          </span>
        )}

      </div>

    </label>
  );
}

function HeroMetric({
  label,
  value,
  highlight = false,
  negative = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  negative?: boolean;
}) {
  let valueClass = "text-white";

  if (highlight) valueClass = "text-lime-300";
  if (negative) valueClass = "text-red-400";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="min-h-[220px] border border-white/10 bg-white/[0.015] p-7"
    >
      <p className="text-[10px] tracking-[0.2em] text-white/35">
        {label.toUpperCase()}
      </p>

      <div
        className={`mt-16 text-5xl font-medium tracking-[-0.06em] md:text-6xl ${valueClass}`}
      >
        {value}
      </div>
    </motion.div>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-[145px] border border-white/10 bg-white/[0.012] p-5">
      <p className="text-[9px] tracking-[0.18em] text-white/35">
        {label.toUpperCase()}
      </p>

      <div className="mt-8 text-2xl font-medium tracking-[-0.04em]">
        {value}
      </div>
    </div>
  );
}

function StatementRow({
  label,
  value,
  negative = false,
  highlight = false,
}: {
  label: string;
  value: number;
  negative?: boolean;
  highlight?: boolean;
}) {
  let valueClass = "text-white";

  if (negative) valueClass = "text-red-400";
  if (highlight) valueClass = "text-lime-300";

  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm text-white/45">
        {label}
      </span>

      <span className={`text-lg ${valueClass}`}>
        {value < 0 ? "-" : ""}
        {money(Math.abs(value))}
      </span>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  good,
  great,
  decimals = 1,
}: {
  label: string;
  value: number;
  good: number;
  great: number;
  decimals?: number;
}) {
  let status = "WEAK";
  let statusClass = "text-red-400";
  let borderClass = "border-red-400/20";

  if (value >= good) {
    status = "GOOD";
    statusClass = "text-yellow-300";
    borderClass = "border-yellow-300/20";
  }

  if (value >= great) {
    status = "STRONG";
    statusClass = "text-lime-300";
    borderClass = "border-lime-300/20";
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`min-h-[230px] border bg-white/[0.015] p-6 ${borderClass}`}
    >

      <div className="flex justify-between">
        <span className="text-[10px] tracking-[0.18em] text-white/35">
          {label.toUpperCase()}
        </span>

        <span className={`text-[10px] tracking-[0.15em] ${statusClass}`}>
          {status}
        </span>
      </div>

      <div className="mt-16 text-5xl font-medium tracking-[-0.06em]">
        {value.toFixed(decimals)}
        {label !== "DSCR" && "%"}
      </div>

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
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  );
}