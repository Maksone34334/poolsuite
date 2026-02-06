"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface NoiseOverlayProps {
  className?: string;
  density?: number;
  inverted?: boolean;
}

export function NoiseOverlay({
  className,
  density = 0.18,
  inverted = false,
}: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < density) {
        const val = inverted ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
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
