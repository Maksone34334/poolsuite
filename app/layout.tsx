import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Poolsuite FM",
  description:
    "The ultra-summer music player by Grand Leisure, Inc. Kick back, relax, and enjoy the good life.",
}

export const viewport: Viewport = {
  themeColor: "#faeed9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
