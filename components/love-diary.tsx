"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

interface VlogEntry {
  id: string
  date: string
  content: string
  image?: string
  timestamp: string
}

export default function LoveDiary() {
  const [vlogEntries, setVlogEntries] = useState<VlogEntry[]>([])
  const [newEntry, setNewEntry] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar entradas salvas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vlogEntries")
    console.log("Carregando do localStorage:", saved)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log("Entradas carregadas:", parsed)
        setVlogEntries(parsed)
      } catch (error) {
        console.log("Erro ao carregar entradas:", error)
      }
    } else {
      console.log("Nenhuma entrada salva encontrada")
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
    if (!newEntry.trim() && !selectedImage) return

    const entry: VlogEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("pt-BR"),
      content: newEntry.trim(),
      image: imagePreview,
      timestamp: new Date().toLocaleString("pt-BR")
    }

    console.log("Postando nova entrada:", entry)
    const updatedEntries = [entry, ...vlogEntries]
    console.log("Entradas atualizadas:", updatedEntries)
    
    setVlogEntries(updatedEntries)
    localStorage.setItem("vlogEntries", JSON.stringify(updatedEntries))
    clearForm()
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

  // Gerenciar seleção de imagem
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("A imagem deve ter menos de 5MB")
        return
      }
      
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remover imagem selecionada
  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Limpar formulário
  const clearForm = () => {
    setNewEntry("")
    setSelectedImage(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
              src="https://www.youtube.com/embed/hLX_Kl0EeIw?autoplay=1&mute=0&volume=0.5&controls=1&loop=1&playlist=hLX_Kl0EeIw&enablejsapi=1&rel=0"
              title="Música Romântica de Fundo"
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

          {/* Lista de mensagens postadas - sempre visível */}
          {vlogEntries.length > 0 && (
            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-foreground">Mensagens Postadas ({vlogEntries.length}):</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {vlogEntries.map((entry) => (
                  <div key={entry.id} className="p-3 bg-background/30 rounded-lg border border-primary/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-primary font-medium">{entry.date}</span>
                      <span className="text-xs text-muted-foreground">{entry.timestamp.split(', ')[1]}</span>
                    </div>
                    {entry.image && (
                      <div className="mb-3">
                        <img
                          src={entry.image}
                          alt="Imagem da mensagem"
                          className="w-full max-h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {entry.content && (
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                    )}
                    {!entry.content && !entry.image && (
                      <p className="text-muted-foreground text-sm italic">Mensagem sem conteúdo</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensagem quando não há entradas */}
          {vlogEntries.length === 0 && (
            <div className="text-center py-6 mb-6">
              <p className="text-muted-foreground">Nenhuma mensagem postada ainda... 💕</p>
            </div>
          )}

          {/* Área de autenticação e escrita */}
          {!isAuthenticated ? (
            <div className="space-y-4">
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">🔒 Para escrever uma nova mensagem, digite a senha</p>
                {!showPasswordInput ? (
                  <Button
                    onClick={() => setShowPasswordInput(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    ✍️ Escrever Nova Mensagem
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
                <h4 className="font-semibold text-foreground">✍️ Escrever Nova Mensagem:</h4>
                
                {/* Upload de Imagem */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">📷 Anexar Imagem:</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-primary/20 text-primary hover:bg-primary/10"
                    >
                      🖼️ Selecionar Imagem
                    </Button>
                  </div>
                  
                  {/* Preview da Imagem */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview da imagem"
                        className="w-full max-h-48 object-cover rounded-lg border border-primary/20"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500/80 text-white hover:bg-red-500 border-0"
                      >
                        ❌
                      </Button>
                    </div>
                  )}
                </div>

                {/* Campo de Texto */}
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
                    🔒 Bloquear Área de Escrita
                  </Button>
                  <div className="flex gap-2">
                    {vlogEntries.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllEntries}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        🗑️ Limpar Todas as Mensagens
                      </Button>
                    )}
                    <Button
                      onClick={postEntry}
                      disabled={!newEntry.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📤 Postar Mensagem
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mensagem de confirmação */}
              {isPosting && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center animate-fade-in-up">
                  ✅ Mensagem postada com sucesso!
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
