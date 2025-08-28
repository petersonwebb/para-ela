"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function LoveCounter() {
  const [timeElapsed, setTimeElapsed] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Data de início do relacionamento - ajuste conforme necessário
  const startDate = new Date("2025-08-11T00:00:00")

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const difference = now.getTime() - startDate.getTime()

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeElapsed({ days, hours, minutes, seconds })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-playfair text-4xl md:text-5xl text-primary mb-8 animate-fade-in-up">Nosso Tempo Juntos</h2>
        <p className="text-muted-foreground mb-12 text-lg">Cada segundo ao seu lado é precioso</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-heartbeat">{timeElapsed.days}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Dias</div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-heartbeat">
              {timeElapsed.hours}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Horas</div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-heartbeat">
              {timeElapsed.minutes}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Minutos</div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-heartbeat">
              {timeElapsed.seconds}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Segundos</div>
          </Card>
        </div>
      </div>
    </section>
  )
}
