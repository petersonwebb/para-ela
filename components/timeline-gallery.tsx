"use client"

import { Card } from "@/components/ui/card"
import { useState } from "react"

interface TimelineItem {
  id: number
  date: string
  title: string
  description: string
  image: string
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    date: "11/08/2025",
    title: "Nossa Primeira Conversa",
    description: "O dia em que tudo começou...",
    image: "/foto1.jpg",
  },
  {
    id: 2,
    date: "22/08/2025",
    title: "Quando soube que eu realmente te amava",
    description: "Um dia onde descobri que era completamente recíproco",
    image: "/foto2.jpg",
  },
  {
    id: 3,
    date: "00/00/0000",
    title: "Nosso Primeiro Beijo",
    description: "Loading...",
    image: "/foto3.jpg",
  },
  {
    id: 4,
    date: "00/00/0000",
    title: "Onde tudo realmente começará",
    description: "Loading...",
    image: "/foto4.jpg",
  },
]

export default function TimelineGallery() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null)

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl text-primary text-center mb-8 animate-fade-in-up">
          Nossa História
        </h2>
        <p className="text-muted-foreground text-center mb-12 text-lg">Momentos especiais que construíram nosso amor</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {timelineData.map((item, index) => (
            <Card
              key={item.id}
              className="group cursor-pointer overflow-hidden card-elegant hover:scale-105"
              onClick={() => setSelectedItem(item)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="text-primary text-sm font-medium mb-2">{item.date}</div>
                <h3 className="font-playfair text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <Card className="max-w-2xl w-full card-elegant">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-primary text-sm font-medium mb-2">{selectedItem.date}</div>
                <h3 className="font-playfair text-2xl font-semibold mb-4 text-foreground">{selectedItem.title}</h3>
                <p className="text-muted-foreground">{selectedItem.description}</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
