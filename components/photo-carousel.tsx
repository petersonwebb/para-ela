"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Card } from "@/components/ui/card"

type Photo = {
  src: string
  alt?: string
}

const defaultPhotos: Photo[] = [
  { src: "/foto1.jpg", alt: "Foto 1" },
  { src: "/foto2.jpg", alt: "Foto 2" },
  { src: "/foto3.jpg", alt: "Foto 3" },
  { src: "/foto4.jpg", alt: "Foto 4" },
]

export default function PhotoCarousel({ photos = defaultPhotos }: { photos?: Photo[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false, align: "start", skipSnaps: false })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  return (
    <Card className="p-2 md:p-4 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {photos.map((photo, idx) => (
            <div key={idx} className="flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_45%] pl-2">
              <div className="relative group rounded-xl overflow-hidden border border-primary/20">
                <img
                  src={photo.src}
                  alt={photo.alt || `Foto ${idx + 1}`}
                  className="w-full h-64 md:h-80 object-cover transform transition duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 animate-pulse bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 md:mt-4 flex items-center justify-between">
        <button onClick={scrollPrev} className="text-sm md:text-base px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/10 transition">
          ⬅️ Anterior
        </button>
        <div className="flex gap-1">
          {photos.map((_, i) => (
            <span key={i} className={"h-2 w-2 rounded-full " + (i === selectedIndex ? "bg-primary" : "bg-primary/30")} />
          ))}
        </div>
        <button onClick={scrollNext} className="text-sm md:text-base px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/10 transition">
          Próxima ➡️
        </button>
      </div>
    </Card>
  )
}


