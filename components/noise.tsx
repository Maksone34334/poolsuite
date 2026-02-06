"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface NoiseProps {
  className?: string;
  density?: number;
  inverted?: boolean;
}

export function Noise({ className, density = 0.18, inverted = false }: NoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue("--theme-primary").trim();
    const secondary = style.getPropertyValue("--theme-secondary").trim();
    const fg = inverted ? secondary : primary;
    const bg = inverted ? primary : secondary;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = fg;

    for (let x = 0; x < w; x += 2) {
      for (let y = 0; y < h; y += 2) {
        if (Math.random() < density) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
  }, [density, inverted]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}
