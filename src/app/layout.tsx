import type { Metadata } from "next";
import { Barlow_Condensed, Montserrat } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.canarywatersports.com"),
  title: "Canary Watersports",
  description: "Water sports in Puerto Rico, Gran Canaria.",
  icons: { icon: "/media/logo.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-locale") || "en";
  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} ${barlow.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
