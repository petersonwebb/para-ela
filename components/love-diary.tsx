"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

interface VlogEntry {
  id: string
  date: string
  content: string
  timestamp: string
}

export default function LoveDiary() {
  const [vlogEntries, setVlogEntries] = useState<VlogEntry[]>([])
  const [newEntry, setNewEntry] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Carregar entradas salvas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vlogEntries")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setVlogEntries(parsed)
      } catch (error) {
        console.log("Nenhuma entrada salva encontrada")
      }
    }
  }, [])

  // Verificar senha
  const checkPassword = () => {
    if (password === "1232") {
      setIsAuthenticated(true)
      setShowPasswordInput(false)
      setPassword("")
      // Focar no textarea após autenticação
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 100)
    } else {
      alert("Senha incorreta! Tente novamente.")
      setPassword("")
    }
  }

  // Postar nova entrada no vlog
  const postEntry = () => {
    if (!newEntry.trim()) return

    const entry: VlogEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("pt-BR"),
      content: newEntry.trim(),
      timestamp: new Date().toLocaleString("pt-BR")
    }

    const updatedEntries = [entry, ...vlogEntries]
    setVlogEntries(updatedEntries)
    localStorage.setItem("vlogEntries", JSON.stringify(updatedEntries))
    setNewEntry("")
    setIsPosting(true)
    
    // Mostrar confirmação temporariamente
    setTimeout(() => setIsPosting(false), 2000)
  }

  // Limpar todas as entradas
  const clearAllEntries = () => {
    if (confirm("Tem certeza que deseja apagar todas as mensagens?")) {
      setVlogEntries([])
      localStorage.removeItem("vlogEntries")
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl text-primary text-center mb-8 animate-fade-in-up">
          Dizeres e uma bela música para minha amada
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">Aprecie com todo amor</p>

        {/* Player de YouTube */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md">
            <iframe
              width="100%"
              height="200"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&volume=0.5&controls=1&loop=1&playlist=dQw4w9WgXcQ&enablejsapi=1"
              title="Música de Fundo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Sistema de Vlog com Senha */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <h3 className="font-playfair text-xl font-semibold text-foreground">Meu Vlog para Você</h3>
            </div>
            <div className="text-primary text-sm font-medium">{new Date().toLocaleDateString("pt-BR")}</div>
          </div>

          {!isAuthenticated ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">🔒 Este vlog está protegido por senha</p>
                {!showPasswordInput ? (
                  <Button
                    onClick={() => setShowPasswordInput(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    🔓 Digite a Senha
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite a senha..."
                      className="px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                      onKeyPress={(e) => e.key === 'Enter' && checkPassword()}
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={checkPassword}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        ✅ Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPasswordInput(false)
                          setPassword("")
                        }}
                        className="border-primary/20 text-primary hover:bg-primary/10"
                      >
                        ❌ Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Área de escrita */}
              <div className="space-y-4">
                <textarea
                  ref={textareaRef}
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="Escreva aqui sua mensagem para ela... 💕"
                  className="w-full h-32 p-3 bg-background/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/40 transition-colors"
                />
                <div className="flex gap-3 justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsAuthenticated(false)}
                    className="border-primary/20 text-primary hover:bg-primary/10"
                  >
                    🔒 Bloquear Vlog
                  </Button>
                  <Button
                    onClick={postEntry}
                    disabled={!newEntry.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📤 Postar Mensagem
                  </Button>
                </div>
              </div>

              {/* Mensagem de confirmação */}
              {isPosting && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center animate-fade-in-up">
                  ✅ Mensagem postada com sucesso!
                </div>
              )}

              {/* Lista de mensagens postadas */}
              {vlogEntries.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Mensagens Postadas:</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllEntries}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs"
                    >
                      🗑️ Limpar Tudo
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {vlogEntries.map((entry) => (
                      <div key={entry.id} className="p-3 bg-background/30 rounded-lg border border-primary/10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-primary font-medium">{entry.date}</span>
                          <span className="text-xs text-muted-foreground">{entry.timestamp.split(', ')[1]}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
