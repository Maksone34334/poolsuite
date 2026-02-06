import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const chicago = localFont({
  src: [
    { path: "../public/fonts/Chicago.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/ChicagoLight.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-chicago",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poolsuite FM",
  description:
    "Ultra-summer music for the discerning poolside listener. Retro internet radio.",
};

export const viewport: Viewport = {
  themeColor: "#faeed9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={chicago.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
