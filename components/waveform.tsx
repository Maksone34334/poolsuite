"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePlayerStore } from "@/lib/player-store"

interface WaveformProps {
  waveformUrl: string
  progress: number
  duration: number
}

function joinWaveformData(samples: number[], bars: number): number[] {
  const groupSize = Math.max(1, Math.floor(samples.length / bars))
  const result: number[] = []
  for (let i = 0; i < bars; i++) {
    const start = i * groupSize
    let sum = 0
    let count = 0
    for (let j = start; j < start + groupSize && j < samples.length; j++) {
      sum += samples[j]
      count++
    }
    result.push(count > 0 ? sum / count : 0)
  }
  return result
}

export function Waveform({ waveformUrl, progress, duration }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [referenceHeight, setReferenceHeight] = useState(140)
  const seekTo = usePlayerStore((s) => s.seekTo)

  useEffect(() => {
    let cancelled = false
    fetch(waveformUrl)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setReferenceHeight(data.height || 140)
          setWaveformData(data.samples || [])
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [waveformUrl])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const w = container.offsetWidth
    const h = 60
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const style = getComputedStyle(document.documentElement)
    const primary = style.getPropertyValue("--theme-primary").trim()
    const secondary = style.getPropertyValue("--theme-secondary").trim()

    ctx.fillStyle = primary
    ctx.fillRect(0, 0, w, h)

    const barWidth = 2
    const barGap = 1
    const barsCount = Math.floor(w / (barWidth + barGap))

    const data =
      waveformData.length > 0
        ? joinWaveformData(waveformData, barsCount)
        : Array.from({ length: barsCount }, () => referenceHeight * 0.2)

    const progressRatio = duration > 0 ? progress / duration : 0
    const progressBar = Math.floor(progressRatio * barsCount)

    for (let i = 0; i < barsCount; i++) {
      const barHeight = Math.max(2, (data[i] / referenceHeight) * h)
      const x = i * (barWidth + barGap)
      const y = h - barHeight

      if (i < progressBar) {
        ctx.fillStyle = secondary
      } else {
        ctx.globalAlpha = 0.25
        ctx.fillStyle = secondary
      }
      ctx.fillRect(x, y, barWidth, barHeight)
      ctx.globalAlpha = 1
    }
  }, [waveformData, progress, duration, referenceHeight])

  useEffect(() => {
    draw()
  }, [draw])

  // Also redraw on resize
  useEffect(() => {
    const observer = new ResizeObserver(() => draw())
    const container = containerRef.current
    if (container) observer.observe(container)
    return () => observer.disconnect()
  }, [draw])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || duration <= 0) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / rect.width
    seekTo(ratio * duration)
  }

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full cursor-pointer"
        style={{ height: 60 }}
        onClick={handleClick}
        role="slider"
        aria-label="Waveform progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
      />
    </div>
  )
}
