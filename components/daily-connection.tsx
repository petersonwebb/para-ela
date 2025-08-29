"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveMoodEntry, getMoodEntry, getUserName } from "@/lib/database"

export default function DailyConnection() {
  const [mood, setMood] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const user = getUserName()
      setUserName(user)
      
      try {
        // Carregar mood do dia
        const moodData = await getMoodEntry(user)
        if (moodData) {
          setMood(moodData.mood)
        }
      } catch (error) {
        console.log("Primeira vez do usuário ou erro ao carregar:", error)
      }
    }
    
    loadData()
  }, [])

  const saveMood = async (selectedMood: string) => {
    setMood(selectedMood)
    try {
      await saveMoodEntry(userName, selectedMood)
      setSaveMessage("Humor salvo! 💕")
      setTimeout(() => setSaveMessage(""), 2000)
    } catch (error) {
      console.error("Erro ao salvar humor:", error)
      setSaveMessage("Erro ao salvar 😔")
      setTimeout(() => setSaveMessage(""), 2000)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Rotina diária & conexão</h2>

        <Card className="p-6 md:p-8 card-elegant">
          <h3 className="font-semibold mb-4">Check‑in do humor</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { v: "feliz", l: "😊 Feliz" },
              { v: "com saudade", l: "🥺 Com saudade" },
              { v: "empolgado", l: "🤩 Empolgado" },
              { v: "cansado", l: "😴 Cansado" },
            ].map((m) => (
              <Button key={m.v} variant={mood === m.v ? "default" : "outline"} size="sm" onClick={() => saveMood(m.v)}>
                {m.l}
              </Button>
            ))}
          </div>
          {saveMessage && (
            <div className="mt-2 text-sm text-green-600 text-center">{saveMessage}</div>
          )}
        </Card>

        {userName && (
          <div className="text-center text-sm text-muted-foreground">
            Logado como: {userName} ❤️
          </div>
        )}
      </div>
    </section>
  )
}


