"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Country = "Canada" | "USA";

export default function MortgageLab() {
  const [country, setCountry] = useState<Country>("Canada");

  const [homePrice, setHomePrice] = useState(850000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.85);
  const [amortizationYears, setAmortizationYears] = useState(25);

  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(6200);
  const [insuranceMonthly, setInsuranceMonthly] = useState(150);
  const [hoaMonthly, setHoaMonthly] = useState(650);
  const [extraPaymentMonthly, setExtraPaymentMonthly] = useState(0);

  const results = useMemo(() => {
    const downPayment =
      homePrice * (downPaymentPercent / 100);

    const mortgageAmount =
      Math.max(homePrice - downPayment, 0);

    const numberOfPayments =
      amortizationYears * 12;

    let monthlyRate = 0;

    if (country === "Canada") {
      const nominalRate =
        interestRate / 100;

      monthlyRate =
        Math.pow(
          1 + nominalRate / 2,
          2 / 12
        ) - 1;
    } else {
      monthlyRate =
        interestRate / 100 / 12;
    }

    let monthlyMortgagePayment = 0;

    if (
      mortgageAmount > 0 &&
      numberOfPayments > 0
    ) {
      if (monthlyRate === 0) {
        monthlyMortgagePayment =
          mortgageAmount / numberOfPayments;
      } else {
        monthlyMortgagePayment =
          mortgageAmount *
          (
            monthlyRate *
            Math.pow(
              1 + monthlyRate,
              numberOfPayments
            )
          ) /
          (
            Math.pow(
              1 + monthlyRate,
              numberOfPayments
            ) - 1
          );
      }
    }

    const propertyTaxMonthly =
      propertyTaxAnnual / 12;

    const monthlyHousingCost =
      monthlyMortgagePayment +
      propertyTaxMonthly +
      insuranceMonthly +
      hoaMonthly +
      extraPaymentMonthly;

    const totalMortgagePayments =
      monthlyMortgagePayment *
      numberOfPayments;

    const totalInterest =
      totalMortgagePayments -
      mortgageAmount;

    const loanToValue =
      homePrice > 0
        ? (mortgageAmount / homePrice) * 100
        : 0;

    const principalFirstMonth =
      monthlyMortgagePayment -
      mortgageAmount * monthlyRate;

    const interestFirstMonth =
      mortgageAmount * monthlyRate;

    return {
      downPayment,
      mortgageAmount,
      monthlyRate,
      monthlyMortgagePayment,
      propertyTaxMonthly,
      monthlyHousingCost,
      totalMortgagePayments,
      totalInterest,
      loanToValue,
      principalFirstMonth,
      interestFirstMonth,
    };
  }, [
    country,
    homePrice,
    downPaymentPercent,
    interestRate,
    amortizationYears,
    propertyTaxAnnual,
    insuranceMonthly,
    hoaMonthly,
    extraPaymentMonthly,
  ]);

  const schedule = useMemo(() => {
    const rows = [];

    let balance =
      results.mortgageAmount;

    for (
      let month = 1;
      month <= Math.min(amortizationYears * 12, 12);
      month++
    ) {
      const interest =
        balance *
        results.monthlyRate;

      let principal =
        results.monthlyMortgagePayment -
        interest +
        extraPaymentMonthly;

      if (principal > balance) {
        principal = balance;
      }

      balance =
        Math.max(balance - principal, 0);

      rows.push({
        month,
        payment:
          results.monthlyMortgagePayment +
          extraPaymentMonthly,
        principal,
        interest,
        balance,
      });
    }

    return rows;
  }, [
    results,
    amortizationYears,
    extraPaymentMonthly,
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

        <div className="text-xs tracking-[0.22em] text-white/40">
          MORTGAGE LAB
        </div>
      </header>

      <section className="px-6 pb-20 pt-16 md:px-12">

        <div className="mb-16 max-w-6xl">
          <p className="mb-5 text-xs tracking-[0.28em] text-lime-300">
            FINANCING INTELLIGENCE
          </p>

          <h1 className="text-[17vw] font-semibold leading-[0.76] tracking-[-0.075em] md:text-[10vw]">
            MORTGAGE
            <br />
            LAB
          </h1>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">

          <button
            onClick={() =>
              setCountry("Canada")
            }
            className={
              country === "Canada"
                ? "rounded-full bg-lime-300 px-5 py-3 text-xs font-semibold tracking-[0.15em] text-black"
                : "rounded-full border border-white/15 px-5 py-3 text-xs tracking-[0.15em] text-white/50"
            }
          >
            CANADA
          </button>

          <button
            onClick={() =>
              setCountry("USA")
            }
            className={
              country === "USA"
                ? "rounded-full bg-lime-300 px-5 py-3 text-xs font-semibold tracking-[0.15em] text-black"
                : "rounded-full border border-white/15 px-5 py-3 text-xs tracking-[0.15em] text-white/50"
            }
          >
            USA
          </button>

        </div>

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.4fr]">

          <section className="border border-white/10 bg-white/[0.02] p-6 md:p-8">

            <p className="mb-10 text-xs tracking-[0.22em] text-white/40">
              FINANCING INPUTS
            </p>

            <InputField
              label="Home Price"
              prefix="$"
              value={homePrice}
              onChange={setHomePrice}
            />

            <InputField
              label="Down Payment"
              suffix="%"
              value={downPaymentPercent}
              onChange={setDownPaymentPercent}
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

            <div className="my-10 border-t border-white/10" />

            <p className="mb-8 text-xs tracking-[0.22em] text-white/40">
              MONTHLY OWNERSHIP COSTS
            </p>

            <InputField
              label="Annual Property Tax"
              prefix="$"
              value={propertyTaxAnnual}
              onChange={setPropertyTaxAnnual}
            />

            <InputField
              label="Insurance"
              prefix="$"
              suffix="/ month"
              value={insuranceMonthly}
              onChange={setInsuranceMonthly}
            />

            <InputField
              label={
                country === "Canada"
                  ? "Condo Fee"
                  : "HOA Fee"
              }
              prefix="$"
              suffix="/ month"
              value={hoaMonthly}
              onChange={setHoaMonthly}
            />

            <InputField
              label="Extra Mortgage Payment"
              prefix="$"
              suffix="/ month"
              value={extraPaymentMonthly}
              onChange={setExtraPaymentMonthly}
            />

          </section>

          <section>

            <div className="grid gap-4 md:grid-cols-2">

              <HeroMetric
                label="Monthly Mortgage"
                value={money(
                  results.monthlyMortgagePayment
                )}
                highlight
              />

              <HeroMetric
                label="Total Monthly Housing"
                value={money(
                  results.monthlyHousingCost
                )}
              />

            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <SmallMetric
                label="Mortgage Amount"
                value={money(
                  results.mortgageAmount
                )}
              />

              <SmallMetric
                label="Down Payment"
                value={money(
                  results.downPayment
                )}
              />

              <SmallMetric
                label="Loan-to-Value"
                value={`${results.loanToValue.toFixed(
                  1
                )}%`}
              />

              <SmallMetric
                label="Total Interest"
                value={money(
                  results.totalInterest
                )}
              />

              <SmallMetric
                label="Property Tax / Month"
                value={money(
                  results.propertyTaxMonthly
                )}
              />

              <SmallMetric
                label="Total Mortgage Payments"
                value={money(
                  results.totalMortgagePayments
                )}
              />

            </div>

            <div className="mt-4 border border-white/10 p-6 md:p-8">

              <div className="mb-10 flex items-start justify-between gap-6">

                <div>
                  <p className="text-xs tracking-[0.2em] text-white/40">
                    PAYMENT COMPOSITION
                  </p>

                  <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                    First month
                  </h2>
                </div>

                <span className="rounded-full border border-lime-300/25 bg-lime-300/5 px-4 py-2 text-xs text-lime-300">
                  {country}
                </span>

              </div>

              <div className="space-y-7">

                <ProgressMetric
                  label="Principal"
                  value={
                    results.principalFirstMonth
                  }
                  total={
                    results.monthlyMortgagePayment
                  }
                />

                <ProgressMetric
                  label="Interest"
                  value={
                    results.interestFirstMonth
                  }
                  total={
                    results.monthlyMortgagePayment
                  }
                />

              </div>

            </div>

          </section>

        </div>

        <section className="mt-24">

          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <p className="mb-4 text-xs tracking-[0.25em] text-lime-300">
                AMORTIZATION
              </p>

              <h2 className="text-5xl font-semibold tracking-[-0.055em] md:text-7xl">
                FIRST 12 MONTHS
              </h2>
            </div>

            <div className="text-xs leading-6 text-white/35">
              Principal · Interest · Balance
            </div>

          </div>

          <div className="overflow-x-auto border-t border-white/10">

            <div className="min-w-[760px]">

              <div className="grid grid-cols-5 border-b border-white/10 px-4 py-4 text-[10px] tracking-[0.18em] text-white/30">
                <span>MONTH</span>
                <span>PAYMENT</span>
                <span>PRINCIPAL</span>
                <span>INTEREST</span>
                <span className="text-right">
                  BALANCE
                </span>
              </div>

              {schedule.map((row) => (
                <div
                  key={row.month}
                  className="grid grid-cols-5 border-b border-white/[0.07] px-4 py-5 text-sm transition hover:bg-white/[0.025]"
                >
                  <span className="text-white/45">
                    {String(row.month).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span>
                    {money(row.payment)}
                  </span>

                  <span className="text-lime-300">
                    {money(row.principal)}
                  </span>

                  <span className="text-white/45">
                    {money(row.interest)}
                  </span>

                  <span className="text-right">
                    {money(row.balance)}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </section>

        <section className="mt-28 border-t border-white/10 pt-16">

          <p className="mb-4 text-xs tracking-[0.25em] text-lime-300">
            FINANCING MODEL
          </p>

          <h2 className="max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-white/20 md:text-8xl">
            TEST THE PROPERTY
            BEFORE THE PROPERTY
            TESTS YOU.
          </h2>

          <p className="mt-10 max-w-2xl text-sm leading-7 text-white/40">
            The calculator currently estimates
            principal and interest using the selected
            country's mortgage convention. Taxes,
            insurance and condo or HOA fees are added
            to show a broader monthly ownership cost.
          </p>

        </section>

      </section>

    </main>
  );
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
            onChange(
              Number(event.target.value)
            )
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
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "min-h-[230px] border border-lime-300/25 bg-lime-300/[0.04] p-7"
          : "min-h-[230px] border border-white/10 bg-white/[0.02] p-7"
      }
    >
      <p className="text-[10px] tracking-[0.2em] text-white/40">
        {label.toUpperCase()}
      </p>

      <div
        className={
          highlight
            ? "mt-16 text-5xl font-medium tracking-[-0.06em] text-lime-300 md:text-6xl"
            : "mt-16 text-5xl font-medium tracking-[-0.06em] md:text-6xl"
        }
      >
        {value}
      </div>
    </div>
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
    <div className="min-h-[150px] border border-white/10 bg-white/[0.015] p-5">

      <p className="text-[9px] tracking-[0.18em] text-white/35">
        {label.toUpperCase()}
      </p>

      <div className="mt-8 text-2xl font-medium tracking-[-0.04em]">
        {value}
      </div>

    </div>
  );
}

function ProgressMetric({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percent =
    total > 0
      ? Math.min(
          (value / total) * 100,
          100
        )
      : 0;

  return (
    <div>

      <div className="mb-3 flex justify-between text-sm">

        <span className="text-white/50">
          {label}
        </span>

        <span>{money(value)}</span>

      </div>

      <div className="h-[5px] overflow-hidden bg-white/10">

        <div
          className="h-full bg-lime-300 transition-all duration-500"
          style={{
            width: `${percent}%`,
          }}
        />

      </div>

    </div>
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