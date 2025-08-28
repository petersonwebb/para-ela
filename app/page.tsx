"use client"

import { useState } from "react"
import Preloader from "@/components/preloader"
import LoveCounter from "@/components/love-counter"
import TimelineGallery from "@/components/timeline-gallery"
import LoveDiary from "@/components/love-diary"

export default function HomePage() {
  const [showPreloader, setShowPreloader] = useState(true)

  const handlePreloaderComplete = () => {
    setShowPreloader(false)
  }

  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} />
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=romantic couple silhouette sunset)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80" />

        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-primary mb-6 animate-float">
            Bem-vinda, meu amor ❤️
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Este é o nosso espaço especial, onde cada momento juntos é eternizado com amor
          </p>
          <div className="mt-8">
            <div className="inline-block animate-heartbeat">
              <span className="text-6xl">💕</span>
            </div>
          </div>
        </div>

        {/* Floating hearts animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float text-primary/30 text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      </section>

      {/* Love Counter Section */}
      <LoveCounter />

      {/* Timeline Gallery Section */}
      <TimelineGallery />

      {/* Love Diary Section */}
      <LoveDiary />

      {/* Footer */}
      <footer className="py-12 px-4 bg-background/80 backdrop-blur-sm border-t border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-playfair text-2xl md:text-3xl text-primary mb-4">
            "Nosso amor é eterno, e este site é o nosso diário."
          </p>
          <p className="text-muted-foreground">Feito com muito amor para você ❤️</p>
        </div>
      </footer>
    </main>
  )
}
