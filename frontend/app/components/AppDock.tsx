"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navigation = [
  {
    name: "MARKETS",
    href: "/",
    number: "01",
  },
  {
    name: "MORTGAGE",
    href: "/mortgage",
    number: "02",
  },
  {
    name: "RENTALS",
    href: "/rentals",
    number: "03",
  },
  {
    name: "COMMERCIAL",
    href: "/commercial",
    number: "04",
  },
  {
    name: "INVESTMENT",
    href: "/investment",
    number: "05",
  },
  {
    name: "COMPARE",
    href: "/compare",
    number: "06",
  },
];

export default function AppDock() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        delay: 0.2,
      }}
      className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-24px)] max-w-[920px] -translate-x-1/2"
    >
      <div className="overflow-x-auto rounded-[24px] border border-white/10 bg-black/80 p-2 shadow-2xl shadow-black/60 backdrop-blur-2xl">

        <div className="flex min-w-max items-center gap-1">

          <div className="mr-2 hidden px-4 md:block">
            <div className="text-xs font-semibold tracking-[0.24em] text-white">
              H//
            </div>
          </div>

          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative"
              >
                <div
                  className={
                    active
                      ? "relative min-w-[110px] rounded-[18px] bg-lime-300 px-4 py-3 text-black"
                      : "relative min-w-[110px] rounded-[18px] px-4 py-3 text-white/45 transition hover:bg-white/[0.05] hover:text-white"
                  }
                >
                  <div
                    className={
                      active
                        ? "text-[8px] tracking-[0.18em] text-black/50"
                        : "text-[8px] tracking-[0.18em] text-white/20"
                    }
                  >
                    {item.number}
                  </div>

                  <div className="mt-1 text-[10px] font-medium tracking-[0.12em]">
                    {item.name}
                  </div>

                  {active && (
                    <motion.div
                      layoutId="activeDock"
                      className="absolute inset-0 -z-10 rounded-[18px] bg-lime-300"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
              </Link>
            );
          })}

        </div>

      </div>
    </motion.nav>
  );
}