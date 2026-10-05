import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ARVYN | Agents. Intelligence. Execution.",
  description:
    "ARVYN provides guarded execution infrastructure for AI agents on Robinhood Chain.",
  metadataBase: new URL("https://arvyn.xyz"),
  openGraph: {
    title: "ARVYN | Execution infrastructure for Robinhood Chain",
    description:
      "Read chain state, apply policy, simulate transactions, and settle through smart contracts.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-arvyn-black font-sans text-arvyn-ink">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
