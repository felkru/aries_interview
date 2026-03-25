import { Poppins, Lora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  adjustFontFallback: true,
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata = {
  title: "Smart Reviewer — AI News Sentiment Analysis",
  description:
    "Search news articles and get AI-powered sentiment analysis with summaries, confidence scores, and persistent storage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
