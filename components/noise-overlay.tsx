"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NoiseOverlayProps {
  density?: number;
  inverted?: boolean;
  className?: string;
}

export function NoiseOverlay({
  density = 0.18,
  inverted = false,
  className,
}: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < density) {
        const v = inverted ? 255 : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 40;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [density, inverted]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "noise-overlay",
        inverted && "noise-overlay-inverted",
        className
      )}
    />
  );
}
