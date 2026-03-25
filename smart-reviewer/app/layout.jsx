import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Smart Reviewer — AI News Sentiment Analysis",
  description:
    "Search news articles and get AI-powered sentiment analysis with summaries, confidence scores, and persistent storage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
