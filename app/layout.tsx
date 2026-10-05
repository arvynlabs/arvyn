import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ARVYN — Agents. Intelligence. Execution.",
  description:
    "ARVYN is the AI execution layer for Robinhood Chain — infrastructure that turns machine intelligence into verifiable on-chain settlement.",
  metadataBase: new URL("https://arvyn.xyz"),
  openGraph: {
    title: "ARVYN — The AI execution layer for Robinhood Chain",
    description:
      "Execution infrastructure for verifiable machine processes: sense chain state, plan strategies, and settle through smart contracts.",
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
