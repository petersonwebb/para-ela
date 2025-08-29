"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveTreasureProgress, getTreasureProgress, getUserName } from "@/lib/database"

const clues = [
  "Pista 1: Qual foi a primeira música que te enviei? (letras minúsculas)",
  "Pista 2: O mês do nosso primeiro papo",
  "Pista 3: A inicial do seu apelido",
]

const secretCode = "amor" // simples; podemos personalizar depois

export default function TreasureHunt() {
  const [progress, setProgress] = useState(0)
  const [input, setInput] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [userName, setUserName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const user = getUserName()
      setUserName(user)
      
      try {
        const treasureData = await getTreasureProgress(user)
        if (treasureData) {
          setProgress(treasureData.progress)
          setUnlocked(treasureData.unlocked)
        }
      } catch (error) {
        console.log("Primeira vez do usuário ou erro ao carregar:", error)
      }
    }
    
    loadData()
  }, [])

  const next = async () => {
    if (!input.trim()) return
    
    setSaving(true)
    try {
      // neste protótipo, a última etapa pede o código "amor"
      if (progress < clues.length - 1) {
        const newProgress = progress + 1
        setProgress(newProgress)
        await saveTreasureProgress(userName, newProgress, false)
        setInput("")
      } else {
        if (input.trim().toLowerCase() === secretCode) {
          setUnlocked(true)
          await saveTreasureProgress(userName, progress, true)
        } else {
          alert("Quase! Tente outra palavra carinhosa.")
        }
      }
    } catch (error) {
      console.error("Erro ao salvar progresso:", error)
      alert("Erro ao salvar progresso. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Caça ao tesouro digital</h2>
        <Card className="p-6 md:p-8 card-elegant">
          {!unlocked ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">{clues[progress]}</p>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva sua resposta/código aqui"
                className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-sm"
              />
              <div className="mt-3">
                <Button onClick={next} disabled={saving || !input.trim()}>
                  {saving ? "Verificando..." : "Enviar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Progresso: {progress + 1}/{clues.length}</p>
            </>
          ) : (
            <div className="text-center">
              <div className="text-3xl">🎁</div>
              <p className="mt-2 text-sm">Surpresa desbloqueada: Eu te amo! Em breve deixamos aqui um vídeo/carta especial.</p>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}


