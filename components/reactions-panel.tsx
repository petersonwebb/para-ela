"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveReaction, getReactions, markReactionAsSeen, getUserName } from "@/lib/database"

type Reaction = "heart" | "rose" | "hug"

interface ReactionData {
  id: string
  type: string
  from_user: string
  created_at: string
  seen: boolean
}

export default function ReactionsPanel() {
  const [reactions, setReactions] = useState<ReactionData[]>([])
  const [newReactions, setNewReactions] = useState<ReactionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string>("")
  const burstRef = useRef<HTMLDivElement>(null)

  // Inicializar usuário e carregar reações
  useEffect(() => {
    const initializeUser = () => {
      const user = getUserName()
      setUserName(user)
      loadReactions()
    }
    initializeUser()
  }, [])

  const loadReactions = async () => {
    try {
      setIsLoading(true)
      const allReactions = await getReactions()
      setReactions(allReactions)
      
      // Separar reações não vistas de outros usuários
      const unseenFromOthers = allReactions.filter(
        (r: ReactionData) => !r.seen && r.from_user !== userName
      )
      setNewReactions(unseenFromOthers)
    } catch (error) {
      console.error('Erro ao carregar reações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const react = async (type: Reaction) => {
    console.log('Botão clicado!', type)
    
    if (!userName) {
      alert('Aguarde, carregando usuário...')
      return
    }

    try {
      console.log(`Enviando reação ${type} do usuário ${userName}`)
      
      // Efeito visual imediato
      const container = burstRef.current
      if (container) {
        const el = document.createElement("div")
        el.className = "pointer-events-none absolute inset-0 flex items-center justify-center animate-bounce z-10"
        el.innerHTML = `<span class="text-4xl select-none">${type === "heart" ? "❤️" : type === "rose" ? "🌹" : "🤗"}</span>`
        container.appendChild(el)
        setTimeout(() => {
          if (container.contains(el)) {
            container.removeChild(el)
          }
        }, 1000)
      }
      
      // Salvar reação no GitHub
      const newReaction = await saveReaction(type, userName)
      console.log('Reação salva:', newReaction)
      
      // Atualizar estado local
      setReactions(prev => [...prev, newReaction])
      
    } catch (error) {
      console.error('Erro ao enviar reação:', error)
      alert('Erro ao enviar reação: ' + error)
    }
  }

  const dismissNewReactions = async () => {
    try {
      // Marcar todas as reações não vistas como vistas
      for (const reaction of newReactions) {
        await markReactionAsSeen(reaction.id)
      }
      setNewReactions([])
      await loadReactions() // Recarregar para atualizar o estado
    } catch (error) {
      console.error('Erro ao marcar reações como vistas:', error)
    }
  }

  const getReactionEmoji = (type: string) => {
    switch (type) {
      case "heart": return "❤️"
      case "rose": return "🌹"
      case "hug": return "🤗"
      default: return "💕"
    }
  }

  const getReactionCounts = () => {
    const counts = { heart: 0, rose: 0, hug: 0 }
    reactions.forEach(r => {
      if (r.type in counts) {
        counts[r.type as keyof typeof counts]++
      }
    })
    return counts
  }

  const counts = getReactionCounts()

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Reações Compartilhadas</h2>
        
        {/* Notificação de novas reações */}
        {newReactions.length > 0 && (
          <Card className="p-4 bg-primary/10 border-primary/30 animate-pulse">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-primary">💕 Você recebeu {newReactions.length} nova(s) reação(ões)!</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {newReactions.map(reaction => (
                  <div key={reaction.id} className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
                    <span className="text-lg">{getReactionEmoji(reaction.type)}</span>
                    <span className="text-sm text-muted-foreground">de {reaction.from_user}</span>
                  </div>
                ))}
              </div>
              <Button onClick={dismissNewReactions} size="sm" className="bg-primary text-primary-foreground">
                ✅ Marcar como visto
              </Button>
            </div>
          </Card>
        )}

        <Card className="relative p-6 md:p-8 card-elegant">
          <div ref={burstRef} className="absolute inset-0 pointer-events-none" />
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-sm">Carregando reações...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <button 
                  onClick={() => react("heart")} 
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer font-medium text-sm border-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{ pointerEvents: 'auto' }}
                >
                  Enviar ❤️ ({counts.heart})
                </button>
                <button 
                  onClick={() => react("rose")} 
                  className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors cursor-pointer font-medium text-sm border-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{ pointerEvents: 'auto' }}
                >
                  Enviar 🌹 ({counts.rose})
                </button>
                <button 
                  onClick={() => react("hug")} 
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer font-medium text-sm border-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                  style={{ pointerEvents: 'auto' }}
                >
                  Enviar 🤗 ({counts.hug})
                </button>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  🔗 Conectado ao GitHub - suas reações aparecem para ela em tempo real!
                </p>
                <p className="text-xs text-primary font-medium">
                  Usuário: {userName}
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </section>
  )
}


