"use client"

import { useEffect, useRef, useCallback } from "react"

export function VideoDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const w = parent.offsetWidth
    const h = parent.offsetHeight
    if (w === 0 || h === 0) return

    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const style = getComputedStyle(document.documentElement)
    const primary = style.getPropertyValue("--theme-primary").trim()
    const secondary = style.getPropertyValue("--theme-secondary").trim()

    ctx.fillStyle = primary
    ctx.fillRect(0, 0, w, h)

    // Draw a retro dithered pattern that subtly animates
    const time = frameRef.current * 0.02
    const pixelSize = 4

    for (let x = 0; x < w; x += pixelSize) {
      for (let y = 0; y < h; y += pixelSize) {
        const cx = w / 2
        const cy = h / 2
        const dx = x - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = Math.sqrt(cx * cx + cy * cy)
        const normalizedDist = dist / maxDist

        // Create concentric wave pattern
        const wave = Math.sin(normalizedDist * 8 - time) * 0.5 + 0.5
        const threshold = 0.3 + wave * 0.4

        if (Math.random() > threshold) {
          ctx.fillStyle = secondary
          ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1)
        }
      }
    }

    // Draw "Poolsuite FM" text in the center
    ctx.fillStyle = secondary
    ctx.font = "bold 20px Chicago, Geneva, Tahoma, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Poolsuite FM", w / 2, h / 2)

    frameRef.current++
  }, [])

  useEffect(() => {
    let animationId: number

    const animate = () => {
      draw()
      animationId = requestAnimationFrame(animate)
    }

    // Small delay to ensure parent is sized
    const timer = setTimeout(() => {
      animate()
    }, 50)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animationId)
    }
  }, [draw])

  return (
    <div className="relative flex-1 overflow-hidden" style={{ minHeight: 180 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Poolsuite FM animated display"
      />
    </div>
  )
}
