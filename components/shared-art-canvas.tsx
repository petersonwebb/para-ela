"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SharedArtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [color, setColor] = useState("#ff6b9a")
  const [size, setSize] = useState(6)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const resize = () => {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
      canvas.width = Math.min(900, window.innerWidth - 32)
      canvas.height = 360
      ctx.putImageData(img, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
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
  }

  const pointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Quadro de arte a dois</h2>
        <Card className="p-3 md:p-4 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <input type="range" min={2} max={24} value={size} onChange={(e) => setSize(parseInt(e.target.value))} />
            <Button
              variant="outline"
              onClick={() => {
                const c = canvasRef.current
                if (!c) return
                const ctx = c.getContext("2d")
                if (!ctx) return
                ctx.clearRect(0, 0, c.width, c.height)
              }}
            >
              Limpar
            </Button>
          </div>
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
          <p className="text-xs text-muted-foreground mt-2">Em breve: salvar desenho e compartilhar link ❤️</p>
        </Card>
      </div>
    </section>
  )
}


