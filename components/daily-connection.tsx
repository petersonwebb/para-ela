"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveMoodEntry, getMoodEntry, savePromptAnswer, getPromptAnswer, getUserName } from "@/lib/database"

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
  const [userName, setUserName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const user = getUserName()
      setUserName(user)
      setPromptIndex(new Date().getDate() % prompts.length)
      
      try {
        // Carregar mood do dia
        const moodData = await getMoodEntry(user)
        if (moodData) {
          setMood(moodData.mood)
        }
        
        // Carregar resposta do prompt
        const promptData = await getPromptAnswer(user)
        if (promptData) {
          setAnswer(promptData.answer)
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

  const savePrompt = async () => {
    if (!answer.trim()) return
    
    setSaving(true)
    try {
      await savePromptAnswer(userName, prompts[promptIndex], answer)
      setSaveMessage("Resposta salva! ❤️")
      setTimeout(() => setSaveMessage(""), 2000)
    } catch (error) {
      console.error("Erro ao salvar resposta:", error)
      setSaveMessage("Erro ao salvar 😔")
      setTimeout(() => setSaveMessage(""), 2000)
    } finally {
      setSaving(false)
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

        <Card className="p-6 md:p-8 card-elegant">
          <h3 className="font-semibold mb-4">Prompt do dia</h3>
          <p className="text-sm text-muted-foreground mb-3">{prompts[promptIndex]}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Escreva aqui..."
            className="w-full h-24 p-2 bg-background/50 border border-primary/20 rounded-lg"
          />
          <div className="mt-2 text-right">
            <Button onClick={savePrompt} disabled={saving || !answer.trim()}>
              {saving ? "Salvando..." : "Salvar de hoje"}
            </Button>
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


