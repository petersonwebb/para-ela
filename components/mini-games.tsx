"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type QuizQuestion = {
  id: string
  question: string
  options: string[]
}

const defaultQuestions: QuizQuestion[] = [
  { id: "q1", question: "Qual é a cor favorita?", options: ["Vermelho", "Rosa", "Azul", "Roxo"] },
  { id: "q2", question: "Filme para ver juntos?", options: ["Romance", "Comédia", "Ação", "Animação"] },
  { id: "q3", question: "Melhor horário para conversar?", options: ["Manhã", "Tarde", "Noite", "Madrugada"] },
]

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export default function MiniGames() {
  const [answersMine, setAnswersMine] = useState<Record<string, number>>(() => loadLocal("quiz_mine", {}))
  const [answersHers, setAnswersHers] = useState<Record<string, number>>(() => loadLocal("quiz_hers", {}))
  const [rouletteTask, setRouletteTask] = useState<string>("")

  const tasks = useMemo(
    () => [
      "Enviar uma selfie agora 💕",
      "Gravar um áudio de bom dia ☀️",
      "Escolher a música da noite 🎶",
      "Escrever uma mini carta ✍️",
      "Compartilhar um meme fofo 😄",
    ],
    [],
  )

  useEffect(() => saveLocal("quiz_mine", answersMine), [answersMine])
  useEffect(() => saveLocal("quiz_hers", answersHers), [answersHers])

  const score = useMemo(() => {
    let points = 0
    for (const q of defaultQuestions) {
      if (answersMine[q.id] !== undefined && answersHers[q.id] !== undefined && answersMine[q.id] === answersHers[q.id]) {
        points += 1
      }
    }
    return points
  }, [answersMine, answersHers])

  const spinRoulette = () => {
    const next = tasks[Math.floor(Math.random() * tasks.length)]
    setRouletteTask(next)
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Mini Joguinhos</h2>

        <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-semibold mb-3">Quiz: Quem conhece mais quem?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Minhas respostas</p>
              {defaultQuestions.map((q) => (
                <div key={q.id} className="mb-3">
                  <div className="text-sm mb-1">{q.question}</div>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt, idx) => (
                      <Button
                        key={idx}
                        variant={answersMine[q.id] === idx ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAnswersMine((s) => ({ ...s, [q.id]: idx }))}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Respostas dela</p>
              {defaultQuestions.map((q) => (
                <div key={q.id} className="mb-3">
                  <div className="text-sm mb-1">{q.question}</div>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt, idx) => (
                      <Button
                        key={idx}
                        variant={answersHers[q.id] === idx ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAnswersHers((s) => ({ ...s, [q.id]: idx }))}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-center text-sm">Pontuação de compatibilidade: {score}/{defaultQuestions.length}</div>
        </Card>

        <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-semibold mb-3">Roleta romântica</h3>
          <div className="flex items-center gap-3">
            <Button onClick={spinRoulette}>Girar roleta</Button>
            <span className="text-muted-foreground text-sm">{rouletteTask || "Gire para receber uma missão fofa"}</span>
          </div>
        </Card>
      </div>
    </section>
  )
}


