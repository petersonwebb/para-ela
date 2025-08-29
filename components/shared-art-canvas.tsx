"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveArtCanvas, getLatestArtCanvas, getUserName } from "@/lib/database"

export default function SharedArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [color, setColor] = useState("#ff6b9a")
  const [size, setSize] = useState(6)
  const [drawing, setDrawing] = useState(false)
  const [userName, setUserName] = useState("")
  const [saving, setSaving] = useState(false)
  const [lastArtist, setLastArtist] = useState("")
  const [hasDrawn, setHasDrawn] = useState(false)

  useEffect(() => {
    const initCanvas = async () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const user = getUserName()
      setUserName(user)
      
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      
      // Configurar canvas
      canvas.width = Math.min(800, window.innerWidth - 64)
      canvas.height = 360
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Carregar desenho existente
      try {
        const artData = await getLatestArtCanvas()
        if (artData && artData.canvas_data) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
          img.src = artData.canvas_data
          setLastArtist(artData.created_by)
        }
      } catch (error) {
        console.log("Nenhum desenho anterior encontrado:", error)
      }
    }
    
    initCanvas()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      canvas.width = Math.min(800, window.innerWidth - 64)
      canvas.height = 360
      ctx.putImageData(imageData, 0, 0)
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    setHasDrawn(true)
  }

  const pointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const clearAndStartNew = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
    setLastArtist("")
  }

  const saveDrawing = async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) return
    
    setSaving(true)
    try {
      const dataURL = canvas.toDataURL()
      await saveArtCanvas(dataURL, userName)
      setLastArtist(userName)
      setHasDrawn(false)
      alert("Desenho salvo! ❤️")
    } catch (error) {
      console.error("Erro ao salvar desenho:", error)
      alert("Erro ao salvar desenho 😔")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Quadro de arte a dois</h2>
        <Card className="p-6 md:p-8 card-elegant">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-8" />
            <input type="range" min={2} max={24} value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-20" />
            <span className="text-xs text-muted-foreground">Tamanho: {size}px</span>
            <Button variant="outline" onClick={clearAndStartNew}>
              Novo desenho
            </Button>
            <Button onClick={saveDrawing} disabled={!hasDrawn || saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          
          {lastArtist && (
            <div className="mb-3 text-sm text-muted-foreground">
              Último desenho por: {lastArtist} ❤️
            </div>
          )}
          <div className="rounded-xl overflow-hidden border border-primary/20">
            <canvas
              ref={canvasRef}
              className="touch-none bg-background/60"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                setDrawing(true)
                const { x, y } = pointer(e)
                draw(x, y)
              }}
              onPointerMove={(e) => {
                if (!drawing) return
                const { x, y } = pointer(e)
                draw(x, y)
              }}
              onPointerUp={() => setDrawing(false)}
              onPointerCancel={() => setDrawing(false)}
              width={800}
              height={360}
            />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>💡 Como funciona: Quando você salvar um novo desenho, ele substituirá o anterior.</p>
            <p>Assim vocês podem se revezar criando arte juntos! ❤️</p>
          </div>
        </Card>
      </div>
    </section>
  )
}


