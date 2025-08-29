"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RADIO_PLAYLIST, RADIO_SETTINGS } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pause, Play, SkipBack, SkipForward, Shuffle } from "lucide-react"

type Track = {
  url: string
  title?: string
}

function buildTracksFromConfig(): Track[] {
  return (RADIO_PLAYLIST || []).map((url) => ({ url }))
}

type RadioPlayerProps = {
  compact?: boolean
}

export default function RadioPlayer({ compact = false }: RadioPlayerProps) {
  const [tracks] = useState<Track[]>(() => buildTracksFromConfig())
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isShuffled, setIsShuffled] = useState<boolean>(!!RADIO_SETTINGS.startShuffled)
  const [volume, setVolume] = useState<number>(RADIO_SETTINGS.defaultVolume ?? 0.7)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const hasTracks = tracks.length > 0
  const controlsDisabled = !hasTracks

  const order = useMemo(() => {
    const base = tracks.map((_, index) => index)
    if (!isShuffled) return base
    // simple Fisher-Yates shuffle
    for (let i = base.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[base[i], base[j]] = [base[j], base[i]]
    }
    return base
  }, [tracks, isShuffled])

  const orderedIndexToTrackIndex = useCallback(
    (orderedIndex: number) => (hasTracks ? order[orderedIndex % order.length] : 0),
    [order, hasTracks],
  )

  const play = useCallback(async () => {
    if (!audioRef.current) return
    try {
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (e) {
      // autoplay may be blocked; user interaction needed
      setIsPlaying(false)
    }
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const next = useCallback(() => {
    if (!hasTracks) return
    setCurrentIndex((prev) => (prev + 1) % order.length)
  }, [hasTracks, order.length])

  const prev = useCallback(() => {
    if (!hasTracks) return
    setCurrentIndex((prev) => (prev - 1 + order.length) % order.length)
  }, [hasTracks, order.length])

  const currentTrack = useMemo(() => {
    if (!hasTracks) return undefined
    const trackIndex = orderedIndexToTrackIndex(currentIndex)
    return tracks[trackIndex]
  }, [tracks, currentIndex, orderedIndexToTrackIndex, hasTracks])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (!audioRef.current) return
    const handleEnded = () => {
      next()
    }
    const el = audioRef.current
    el.addEventListener("ended", handleEnded)
    return () => el.removeEventListener("ended", handleEnded)
  }, [next])

  useEffect(() => {
    // Autoplay attempt on mount
    if (hasTracks) {
      setTimeout(() => {
        play()
      }, 0)
    }
  }, [hasTracks, play])

  useEffect(() => {
    // When track changes, try to play immediately
    if (audioRef.current && isPlaying) {
      void audioRef.current.play()
    }
  }, [currentTrack?.url, isPlaying])

  if (!hasTracks) {
    return null
  }

  const content = (
    <Card className={compact ? "p-2 bg-card/60 backdrop-blur-sm border-primary/20" : "p-4 md:p-6 bg-card/50 backdrop-blur-sm border-primary/20"}>
      <div className={compact ? "flex items-center gap-2" : "flex flex-col gap-4"}>
        <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prev} aria-label="Anterior" disabled={controlsDisabled}>
                <SkipBack className="h-5 w-5" />
              </Button>
              {isPlaying ? (
                <Button variant="default" size="icon" onClick={pause} aria-label="Pausar" disabled={controlsDisabled}>
                  <Pause className="h-6 w-6" />
                </Button>
              ) : (
                <Button variant="default" size="icon" onClick={play} aria-label="Tocar" disabled={controlsDisabled}>
                  <Play className="h-6 w-6" />
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={next} aria-label="Próximo" disabled={controlsDisabled}>
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant={isShuffled ? "default" : "outline"}
                size="icon"
                onClick={() => setIsShuffled((s) => !s)}
                aria-label="Alternar aleatório"
                title={isShuffled ? "Aleatório ativo" : "Aleatório inativo"}
                disabled={controlsDisabled}
              >
                <Shuffle className="h-5 w-5" />
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  disabled={controlsDisabled}
                />
              </div>
        </div>

        {!compact && (
          <div className="text-sm text-muted-foreground truncate">
            {hasTracks ? (currentTrack?.title ?? currentTrack?.url) : "Adicione músicas em lib/config.ts (RADIO_PLAYLIST)"}
          </div>
        )}

        <audio ref={audioRef} src={currentTrack?.url} preload="auto" />
      </div>
    </Card>
  )

  if (compact) return content

  return (
    <section className="py-10 px-4">
      <div className="max-w-2xl mx-auto">{content}</div>
    </section>
  )
}


