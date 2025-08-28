"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DiaryEntry {
  id: number
  date: string
  title: string
  content: string
  mood: "❤️" | "💕" | "🥰" | "😍" | "💖"
}

const diaryEntries: DiaryEntry[] = [
  {
    id: 1,
    date: "28/08/2025",
    title: "Um Dia Perfeito",
    content:
      "Hoje acordei pensando em você, como sempre. Cada manhã ao seu lado é uma bênção. Seu sorriso ilumina meu dia e faz tudo valer a pena.",
    mood: "❤️",
  },
  {
    id: 2,
    date: "27/08/2025",
    title: "Nossos Sonhos",
    content:
      "Conversamos sobre nossos planos para o futuro. É incrível como nossos sonhos se alinham perfeitamente. Mal posso esperar para construir nossa vida juntos.",
    mood: "💕",
  },
  {
    id: 3,
    date: "26/08/2025",
    title: "Pequenos Momentos",
    content:
      "Às vezes são os pequenos momentos que mais importam. Hoje você me surpreendeu com meu café favorito. É nesses detalhes que vejo o quanto me ama.",
    mood: "🥰",
  },
]

export default function LoveDiary() {
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null)

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl text-primary text-center mb-8 animate-fade-in-up">
          Diário do Nosso Amor
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">Memórias e sentimentos guardados com carinho</p>

        <div className="space-y-6">
          {diaryEntries.map((entry, index) => (
            <Card
              key={entry.id}
              className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{entry.mood}</span>
                    <h3 className="font-playfair text-xl font-semibold text-foreground">{entry.title}</h3>
                  </div>
                  <div className="text-primary text-sm font-medium">{entry.date}</div>
                </div>
              </div>

              <div className="text-muted-foreground leading-relaxed">
                {expandedEntry === entry.id ? (
                  <>
                    <p>{entry.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedEntry(null)}
                      className="mt-3 text-primary hover:text-primary/80"
                    >
                      Mostrar menos
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-2">{entry.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedEntry(entry.id)}
                      className="mt-3 text-primary hover:text-primary/80"
                    >
                      Ler mais
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full">
            Ver Todas as Memórias
          </Button>
        </div>
      </div>
    </section>
  )
}
