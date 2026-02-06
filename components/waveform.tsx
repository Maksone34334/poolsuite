"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { seekTo } from "@/lib/store/player";

interface WaveformProps {
  waveformUrl: string;
  progress: number;
  duration: number;
}

const BAR_WIDTH = 2;
const GAP = 1;
const HEIGHT = 48;

export function Waveform({ waveformUrl, progress, duration }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);

  // Measure container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCanvasWidth(Math.floor(entry.contentRect.width));
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const barsNumber = Math.floor(canvasWidth / (BAR_WIDTH + GAP));

  // Fetch waveform data
  useEffect(() => {
    if (!waveformUrl || barsNumber <= 0) return;
    let cancelled = false;

    fetch(waveformUrl)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const samples: number[] = data.samples;
        const referenceHeight: number = data.height;
        const grouped = joinWaveformData(samples, barsNumber);
        setWaveformData(
          grouped.map((bar) => Math.round((bar * HEIGHT) / referenceHeight))
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [waveformUrl, barsNumber]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData.length || canvasWidth <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // Get theme colors from CSS
    const style = getComputedStyle(document.documentElement);
    const primaryColor = style.getPropertyValue("--theme-primary").trim();
    const secondaryColor = style.getPropertyValue("--theme-secondary").trim();

    // Background
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, canvasWidth, HEIGHT);

    const progressRatio = duration > 0 ? progress / duration : 0;
    const highlightedBars = Math.floor(progressRatio * waveformData.length);

    // Draw bars
    for (let i = 0; i < waveformData.length; i++) {
      const barHeight = waveformData[i] / (BAR_WIDTH + GAP);
      const isHighlighted = i < highlightedBars;

      ctx.fillStyle = isHighlighted
        ? secondaryColor
        : `${secondaryColor}55`;

      for (let j = 0; j < barHeight; j++) {
        ctx.fillRect(
          i * (BAR_WIDTH + GAP),
          HEIGHT - j * (BAR_WIDTH + GAP) - GAP,
          BAR_WIDTH,
          BAR_WIDTH
        );
      }

      // Fill solid overlay for highlighted
      if (isHighlighted) {
        const h = waveformData[i];
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(
          i * (BAR_WIDTH + GAP),
          HEIGHT - h,
          BAR_WIDTH,
          h
        );
      }
    }
  }, [waveformData, progress, duration, canvasWidth]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!duration || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      seekTo(ratio * duration);
    },
    [duration]
  );

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full cursor-pointer"
        style={{ height: HEIGHT }}
      />
    </div>
  );
}

function joinWaveformData(arr: number[], m: number): number[] {
  const n = arr.length;
  if (m > n || m <= 0) return arr;

  const result: number[] = [];
  const groupSize = n / m;

  for (let i = 0; i < m; i++) {
    const start = Math.floor(i * groupSize);
    const end = i === m - 1 ? n : Math.floor((i + 1) * groupSize);

    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += arr[j];
    }
    result.push(sum / (end - start));
  }

  return result;
}
