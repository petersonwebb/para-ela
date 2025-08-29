import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Montserrat } from "next/font/google"
import "./globals.css"
import RadioPlayer from "@/components/radio-player"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["900"], // Black weight
})

export const metadata: Metadata = {
  title: "Nosso Amor Eterno ❤️",
  description: "Um diário digital do nosso amor",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfairDisplay.variable} ${montserrat.variable}`}>
        <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-primary/20">
          <div className="container mx-auto px-4 py-2 flex items-center gap-3">
            <div className="font-playfair text-xl text-primary">Nosso Amor ❤️</div>
            <div className="ml-auto">
              <RadioPlayer compact />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
