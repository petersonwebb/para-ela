"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

interface LetterContent {
  id: string
  date: string
  content: string
  lastSaved: string
}

export default function LoveDiary() {
  const [letterContent, setLetterContent] = useState<LetterContent>({
    id: "1",
    date: new Date().toLocaleDateString("pt-BR"),
    content: "",
    lastSaved: ""
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Carregar conteúdo salvo do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("loveLetter")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setLetterContent(parsed)
      } catch (error) {
        console.log("Nenhuma carta salva encontrada")
      }
    }
  }, [])

  // Salvar carta no localStorage
  const saveLetter = () => {
    const updatedLetter = {
      ...letterContent,
      lastSaved: new Date().toLocaleString("pt-BR")
    }
    localStorage.setItem("loveLetter", JSON.stringify(updatedLetter))
    setLetterContent(updatedLetter)
    setIsSaved(true)
    setIsEditing(false)
    
    // Mostrar mensagem de sucesso temporariamente
    setTimeout(() => setIsSaved(false), 2000)
  }

  // Iniciar edição
  const startEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)
  }

  // Cancelar edição
  const cancelEditing = () => {
    setIsEditing(false)
    // Restaurar conteúdo original se não foi salvo
    const saved = localStorage.getItem("loveLetter")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setLetterContent(parsed)
      } catch (error) {
        setLetterContent({
          id: "1",
          date: new Date().toLocaleDateString("pt-BR"),
          content: "",
          lastSaved: ""
        })
      }
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl text-primary text-center mb-8 animate-fade-in-up">
          Música e Carta de Amor
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">Música de fundo para inspirar suas palavras</p>

        {/* Player de YouTube */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md">
            <iframe
              width="100%"
              height="200"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&volume=0.5&controls=1&loop=1&playlist=dQw4w9WgXcQ"
              title="Música de Fundo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Card de Carta Editável */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💌</span>
              <h3 className="font-playfair text-xl font-semibold text-foreground">Minha Carta para Você</h3>
            </div>
            <div className="text-primary text-sm font-medium">{letterContent.date}</div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <textarea
                ref={textareaRef}
                value={letterContent.content}
                onChange={(e) => setLetterContent({...letterContent, content: e.target.value})}
                placeholder="Escreva aqui sua carta de amor... 💕"
                className="w-full h-32 p-3 bg-background/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/40 transition-colors"
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={cancelEditing}
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={saveLetter}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Salvar Carta
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="min-h-32 p-3 bg-background/30 rounded-lg border border-primary/10">
                {letterContent.content ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{letterContent.content}</p>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma carta escrita ainda... 💕</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {letterContent.lastSaved && `Última edição: ${letterContent.lastSaved}`}
                </div>
                <Button
                  onClick={startEditing}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {letterContent.content ? "Editar Carta" : "Escrever Carta"}
                </Button>
              </div>
            </div>
          )}

          {/* Mensagem de sucesso */}
          {isSaved && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center animate-fade-in-up">
              ✅ Carta salva com sucesso!
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
