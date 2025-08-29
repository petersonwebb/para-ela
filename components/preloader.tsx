"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  type: "fire" | "flower"
  color: string
  angle: number
  rotationSpeed: number
}

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const animationRef = useRef<number>()
  const particles = useRef<Particle[]>([])
  const startTime = useRef<number>(Date.now())
  const [showLoveText, setShowLoveText] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create initial fire explosion (mais prolongado)
    const createFireExplosion = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < 90; i++) {
        const angle = (Math.PI * 2 * i) / 50
        const speed = Math.random() * 7 + 3
        particles.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 110,
          size: Math.random() * 8 + 4,
          type: "fire",
          color: `hsl(${Math.random() * 60 + 10}, 100%, ${Math.random() * 30 + 50}%)`,
          angle: 0,
          rotationSpeed: 0,
        })
      }
    }

    // Create flower particles (chuva de rosas mais longa)
    const createFlowerParticles = () => {
      for (let i = 0; i < 45; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: -20,
          vx: (Math.random() - 0.5) * 1.6,
          vy: Math.random() * 1.6 + 0.8,
          life: 1,
          maxLife: 320,
          size: Math.random() * 15 + 10,
          type: "flower",
          color: `hsl(${Math.random() * 30 + 330}, 70%, 80%)`,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
        })
      }
    }

    // Draw flower shape
    const drawFlower = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      color: string,
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)

      // Draw petals
      ctx.fillStyle = color
      for (let i = 0; i < 5; i++) {
        ctx.save()
        ctx.rotate((Math.PI * 2 * i) / 5)
        ctx.beginPath()
        const petalWidth = Math.max(0.1, size / 4)
        const petalHeight = Math.max(0.1, size / 2)
        ctx.ellipse(0, -size / 3, petalWidth, petalHeight, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw center
      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      const centerRadius = Math.max(0.1, size / 6)
      ctx.arc(0, 0, centerRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      const elapsed = Date.now() - startTime.current

      ctx.fillStyle = "rgba(26, 26, 26, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create fire explosion at start (janela maior)
      if (elapsed < 900 && particles.current.filter((p) => p.type === "fire").length === 0) {
        createFireExplosion()
      }

      // Create flowers por mais tempo
      if (elapsed > 1200 && elapsed < 5200 && Math.random() < 0.35) {
        createFlowerParticles()
      }

      // Update and draw particles
      particles.current = particles.current.filter((particle) => {
        particle.life -= 1 / particle.maxLife
        particle.x += particle.vx
        particle.y += particle.vy
        particle.angle += particle.rotationSpeed

        if (particle.type === "fire") {
          particle.vy += 0.08 // gravity
          particle.vx *= 0.985 // friction

          const alpha = particle.life
          ctx.globalAlpha = alpha
          ctx.fillStyle = particle.color
          ctx.beginPath()
          const radius = Math.max(0.1, particle.size * particle.life)
          ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2)
          ctx.fill()
        } else {
          particle.vy += 0.035 // gentle gravity for flowers
          particle.vx *= 0.992

          const alpha = Math.min(particle.life, 0.8)
          ctx.globalAlpha = alpha
          const flowerSize = Math.max(0.1, particle.size * particle.life)
          drawFlower(ctx, particle.x, particle.y, flowerSize, particle.angle, particle.color)
        }

        return particle.life > 0 && particle.y < canvas.height + 50
      })

      ctx.globalAlpha = 1

      // Mostrar texto "Eu te amo" antes de encerrar
      if (!showLoveText && elapsed > 5200) {
        setShowLoveText(true)
      }

      // End animation after ~7s
      if (elapsed < 7000) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setIsVisible(false)
          setTimeout(onComplete, 500)
        }, 800)
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" style={{ background: "#1a1a1a" }} />
      <div className="relative z-10 text-center">
        {!showLoveText ? (
          <>
            <h1 className="font-playfair text-4xl md:text-6xl text-primary animate-heartbeat">❤️</h1>
            <p className="text-foreground/70 mt-4 animate-fade-in-up">Carregando nosso amor...</p>
          </>
        ) : (
          <h2 className="font-playfair text-4xl md:text-6xl text-primary animate-fade-in-up">Eu te amo</h2>
        )}
      </div>
    </div>
  )
}
