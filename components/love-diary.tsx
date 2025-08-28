"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { loadMessagesFromGitHub, saveMessagesToGitHub, checkForUpdates, VlogEntry } from "@/lib/github-service"

export default function LoveDiary() {
  const [vlogEntries, setVlogEntries] = useState<VlogEntry[]>([])
  const [newEntry, setNewEntry] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [expandedImage, setExpandedImage] = useState<{src: string, content: string, date: string} | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar mensagens do GitHub
  useEffect(() => {
    loadMessagesFromGitHub()
  }, [])

  // Função para carregar mensagens
  const loadMessagesFromGitHub = async () => {
    try {
      setIsLoading(true)
      const messages = await loadMessagesFromGitHub()
      setVlogEntries(messages)
      setLastSync(new Date())
      console.log('Mensagens carregadas com sucesso!')
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      // Fallback para localStorage
      const saved = localStorage.getItem("vlogEntries")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setVlogEntries(parsed)
        } catch (e) {
          console.error('Erro ao carregar do localStorage:', e)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Sincronizar com GitHub
  const syncWithGitHub = async () => {
    try {
      setIsLoading(true)
      const updatedMessages = await checkForUpdates(vlogEntries)
      if (JSON.stringify(updatedMessages) !== JSON.stringify(vlogEntries)) {
        setVlogEntries(updatedMessages)
        setLastSync(new Date())
        console.log('Sincronização realizada com sucesso!')
      } else {
        console.log('Nenhuma atualização encontrada')
      }
    } catch (error) {
      console.error('Erro na sincronização:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
  const postEntry = async () => {
    if (!newEntry.trim() && !selectedImage) return

    const entry: VlogEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("pt-BR"),
      content: newEntry.trim(),
      image: imagePreview,
      timestamp: new Date().toLocaleString("pt-BR")
    }

    const updatedEntries = [entry, ...vlogEntries]
    setVlogEntries(updatedEntries)
    
    // Salvar no GitHub
    await saveMessagesToGitHub(updatedEntries)
    
    clearForm()
    setIsPosting(true)
    
    // Mostrar confirmação temporariamente
    setTimeout(() => setIsPosting(false), 2000)
  }

  // Limpar todas as entradas
  const clearAllEntries = async () => {
    if (!confirm("Tem certeza que deseja apagar todas as mensagens?")) return

    setVlogEntries([])
    localStorage.removeItem("vlogEntries")
    
    // Salvar no GitHub
    await saveMessagesToGitHub([])
    
    alert('Todas as mensagens foram removidas.')
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

  // Expandir imagem para visualização completa
  const expandImage = (src: string, content: string, date: string) => {
    setExpandedImage({ src, content, date })
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
        <Card className="p-3 sm:p-4 md:p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <h3 className="font-playfair text-base sm:text-lg md:text-xl font-semibold text-foreground">Meu Vlog para Você</h3>
            </div>
            <div className="text-primary text-sm font-medium text-center sm:text-right">{new Date().toLocaleDateString("pt-BR")}</div>
          </div>

          {/* Lista de mensagens postadas - sempre visível */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground text-sm">Carregando mensagens...</p>
            </div>
          ) : vlogEntries.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <h4 className="font-semibold text-foreground text-center sm:text-left text-sm sm:text-base">Mensagens Postadas ({vlogEntries.length}):</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={syncWithGitHub}
                    disabled={isLoading}
                    className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 px-2 py-1 text-xs"
                  >
                    🔄 Sincronizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllEntries}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10 px-2 py-1 text-xs"
                  >
                    🗑️ Limpar Todas as Mensagens
                  </Button>
                </div>
              </div>
              
              {/* Status do GitHub */}
              <div className="bg-background/30 rounded-lg p-2 border border-primary/10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">🔗 GitHub Conectado</span>
                    {lastSync && (
                      <span className="text-muted-foreground">
                        Última sinc: {lastSync.toLocaleTimeString('pt-BR')}
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    petersonwebb/para-ela
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto">
                {vlogEntries.map((entry) => (
                  <div key={entry.id} className="p-2 sm:p-3 bg-background/30 rounded-lg border border-primary/10">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-1">
                      <span className="text-xs text-primary font-medium text-center sm:text-left">{entry.date}</span>
                      <span className="text-xs text-muted-foreground text-center sm:text-left">{entry.timestamp.split(', ')[1]}</span>
                    </div>
                    {entry.image && (
                      <div className="mb-3 flex justify-center">
                        <img
                          src={entry.image}
                          alt="Imagem da mensagem"
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 border border-primary/20"
                          onClick={() => expandImage(entry.image!, entry.content, entry.date)}
                        />
                      </div>
                    )}
                    {entry.content && (
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-center sm:text-left">{entry.content}</p>
                    )}
                    {!entry.content && !entry.image && (
                      <p className="text-muted-foreground text-xs sm:text-sm italic text-center sm:text-left">Mensagem sem conteúdo</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 mb-4 sm:mb-6">
              <p className="text-muted-foreground text-sm sm:text-base mb-3">Nenhuma mensagem postada ainda... 💕</p>
              <div className="bg-background/30 rounded-lg p-3 border border-primary/10">
                <p className="text-muted-foreground text-xs mb-2">💡 <strong>Sistema GitHub Ativo:</strong></p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Suas mensagens serão salvas no repositório GitHub e ficarão públicas para qualquer pessoa ver!
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  <strong>Repositório:</strong> petersonwebb/para-ela
                </p>
              </div>
            </div>
          )}

          {/* Área de autenticação e escrita */}
          {!isAuthenticated ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center py-3 sm:py-4 md:py-6">
                <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">🔒 Para escrever uma nova mensagem, digite a senha</p>
                
                {!showPasswordInput ? (
                  <Button
                    onClick={() => setShowPasswordInput(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
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
                      className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 text-sm sm:text-base"
                      onKeyPress={(e) => e.key === 'Enter' && checkPassword()}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        onClick={checkPassword}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
                      >
                        ✅ Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPasswordInput(false)
                          setPassword("")
                        }}
                        className="border-primary/20 text-primary hover:bg-primary/10 w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
                      >
                        ❌ Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Área de escrita */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-foreground text-center sm:text-left text-sm sm:text-base">✍️ Escrever Nova Mensagem:</h4>
                
                {/* Upload de Imagem */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-muted-foreground">📷 Anexar Imagem:</span>
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
                      className="border-primary/20 text-primary hover:bg-primary/10 w-full sm:w-auto px-3 py-2 text-xs sm:text-sm"
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
                        className="w-full max-h-32 sm:max-h-48 object-cover rounded-lg border border-primary/20"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500/80 text-white hover:bg-red-500 border-0 text-xs"
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
                  className="w-full h-24 sm:h-32 p-2 sm:p-3 bg-background/50 border border-primary/20 rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/40 transition-colors text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsAuthenticated(false)}
                    className="border-primary/20 text-primary hover:bg-primary/10 w-full sm:w-auto px-2 py-2 text-xs sm:text-sm"
                  >
                    🔒 Bloquear Área de Escrita
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {vlogEntries.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllEntries}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 w-full sm:w-auto px-2 py-2 text-xs"
                      >
                        🗑️ Limpar Todas as Mensagens
                      </Button>
                    )}
                    <Button
                      onClick={postEntry}
                      disabled={!newEntry.trim() && !selectedImage}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto px-2 py-2 text-xs sm:text-sm"
                    >
                      📤 Postar Mensagem
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mensagem de confirmação */}
              {isPosting && (
                <div className="p-2 sm:p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-center animate-fade-in-up text-sm">
                  ✅ Mensagem postada com sucesso!
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Modal de Imagem Expandida */}
        {expandedImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-1 sm:p-2 md:p-4"
            onClick={() => setExpandedImage(null)}
          >
            <Card 
              className="w-full max-w-xs sm:max-w-sm md:max-w-2xl bg-card border-primary/20 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 sm:p-4 md:p-6">
                {/* Cabeçalho com data e botão fechar */}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-primary text-xs sm:text-sm font-medium">{expandedImage.date}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedImage(null)}
                    className="border-primary/20 text-primary hover:bg-primary/10 px-2 py-1 text-xs"
                  >
                    ❌ Fechar
                  </Button>
                </div>
                
                {/* Imagem expandida */}
                <div className="mb-3 sm:mb-4">
                  <img
                    src={expandedImage.src}
                    alt="Imagem expandida"
                    className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] object-contain rounded-lg"
                  />
                </div>
                
                {/* Texto da mensagem */}
                {expandedImage.content && (
                  <div className="p-2 sm:p-3 md:p-4 bg-background/30 rounded-lg border border-primary/10">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-xs sm:text-sm md:text-base">
                      {expandedImage.content}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
