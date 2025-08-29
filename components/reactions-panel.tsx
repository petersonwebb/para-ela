"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Reaction = "heart" | "rose" | "hug"

function loadCount(key: string) {
  try {
    return parseInt(localStorage.getItem(key) || "0", 10)
  } catch {
    return 0
  }
}

export default function ReactionsPanel() {
  const [hearts, setHearts] = useState(() => loadCount("reactions:hearts"))
  const [roses, setRoses] = useState(() => loadCount("reactions:roses"))
  const [hugs, setHugs] = useState(() => loadCount("reactions:hugs"))
  const burstRef = useRef<HTMLDivElement>(null)

  useEffect(() => localStorage.setItem("reactions:hearts", String(hearts)), [hearts])
  useEffect(() => localStorage.setItem("reactions:roses", String(roses)), [roses])
  useEffect(() => localStorage.setItem("reactions:hugs", String(hugs)), [hugs])

  const react = (type: Reaction) => {
    if (type === "heart") setHearts((n) => n + 1)
    if (type === "rose") setRoses((n) => n + 1)
    if (type === "hug") setHugs((n) => n + 1)

    // pequena explosão visual
    const container = burstRef.current
    if (!container) return
    const el = document.createElement("div")
    el.className = "pointer-events-none absolute inset-0 flex items-center justify-center"
    el.innerHTML = `<span class="text-3xl select-none">${type === "heart" ? "❤️" : type === "rose" ? "🌹" : "🤗"}</span>`
    container.appendChild(el)
    setTimeout(() => container.removeChild(el), 800)
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="font-playfair text-3xl md:text-4xl text-primary text-center">Reações (mesmo offline)</h2>
        <Card className="relative p-4 md:p-6 bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
          <div ref={burstRef} className="absolute inset-0" />
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => react("heart")} variant="default">Enviar ❤️ ({hearts})</Button>
            <Button onClick={() => react("rose")} variant="outline">Enviar 🌹 ({roses})</Button>
            <Button onClick={() => react("hug")} variant="outline">Enviar 🤗 ({hugs})</Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">As reações ficam salvas no seu navegador e somam ao longo do tempo.</p>
        </Card>
      </div>
    </section>
  )
}


