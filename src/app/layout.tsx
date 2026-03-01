import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Cascade | Real-Time Pandemic Outbreak Predictor",
  description:
    "Simulate pandemic spread across the global flight network. Optimize vaccine deployment, travel restrictions, and field hospitals to minimize casualties using Monte Carlo Tree Search.",
  keywords: [
    "pandemic simulation",
    "SEIR model",
    "MCTS optimization",
    "disease outbreak",
    "epidemic modeling",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
