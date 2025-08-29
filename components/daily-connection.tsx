"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const prompts = [
  "Qual foi o momento mais doce do seu dia?",
  "Uma música que combina com hoje?",
  "O que você sentiu falta hoje?",
  "Qual foi um pensamento que te fez sorrir?",
]

function todayKey(key: string) {
  const d = new Date()
  const day = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  return `${key}:${day}`
}

export default function DailyConnection() {
  const [mood, setMood] = useState<string | null>(null)
  const [answer, setAnswer] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)

  useEffect(() => {
    const keyMood = todayKey("mood")
    const keyAnswer = todayKey("prompt")
    setMood(localStorage.getItem(keyMood))
    setAnswer(localStorage.getItem(keyAnswer) || "")
    setPromptIndex(new Date().getDate() % prompts.length)
  }, [])

  const save = () => {
    localStorage.setItem(todayKey("mood"), mood || "")
    localStorage.setItem(todayKey("prompt"), answer)
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Rotina diária & conexão</h2>

        <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-semibold mb-3">Check‑in do humor</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { v: "feliz", l: "😊 Feliz" },
              { v: "com saudade", l: "🥺 Com saudade" },
              { v: "empolgado", l: "🤩 Empolgado" },
              { v: "cansado", l: "😴 Cansado" },
            ].map((m) => (
              <Button key={m.v} variant={mood === m.v ? "default" : "outline"} size="sm" onClick={() => setMood(m.v)}>
                {m.l}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-semibold mb-3">Prompt do dia</h3>
          <p className="text-sm text-muted-foreground mb-3">{prompts[promptIndex]}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Escreva aqui..."
            className="w-full h-24 p-2 bg-background/50 border border-primary/20 rounded-lg"
          />
          <div className="mt-2 text-right">
            <Button onClick={save}>Salvar de hoje</Button>
          </div>
        </Card>
      </div>
    </section>
  )
}


