import type { Metadata } from "next";
import "./globals.css";
import AppDock from "./components/AppDock";

export const metadata: Metadata = {
  title: "HABITAT//",
  description: "North American Real Estate Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <AppDock />
      </body>
    </html>
  );
}