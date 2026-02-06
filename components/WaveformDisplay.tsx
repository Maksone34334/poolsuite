"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useThemeStore } from "@/theme";
import { seekTo } from "@/store/player";

interface WaveformDisplayProps {
  waveformUrl: string;
  progress: number;
  duration: number;
}

const BAR_WIDTH = 2;
const GAP = 1;

export function WaveformDisplay({
  waveformUrl,
  progress,
  duration,
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const theme = useThemeStore((s) => s.theme);

  const WAVEFORM_HEIGHT = 40;
  const barsCount = Math.floor(canvasWidth / (BAR_WIDTH + GAP));

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCanvasWidth(entry.contentRect.width);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Fetch waveform data
  useEffect(() => {
    if (!waveformUrl) return;

    let cancelled = false;
    fetch(waveformUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.samples) {
          const referenceHeight: number = data.height;
          const samples: number[] = data.samples;
          const grouped = joinWaveformData(samples, barsCount || 100);
          const normalizedData = grouped.map((bar) =>
            Math.round((bar * WAVEFORM_HEIGHT) / referenceHeight)
          );
          setWaveformData(normalizedData);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [waveformUrl, barsCount]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = WAVEFORM_HEIGHT;

    ctx.fillStyle = theme.colors.primary;
    ctx.fillRect(0, 0, canvasWidth, WAVEFORM_HEIGHT);

    const data =
      waveformData.length > 0
        ? waveformData
        : new Array(barsCount).fill(WAVEFORM_HEIGHT / 2);

    const progressBars =
      duration > 0 ? Math.floor((progress * barsCount) / duration) : 0;

    // Draw background bars
    ctx.fillStyle = theme.colors.secondary;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < Math.min(data.length, barsCount); i++) {
      const height = data[i] || 1;
      ctx.fillRect(
        i * (BAR_WIDTH + GAP),
        WAVEFORM_HEIGHT - height,
        BAR_WIDTH,
        height
      );
    }

    // Draw progress bars
    ctx.globalAlpha = 1;
    for (let i = 0; i < Math.min(progressBars, data.length, barsCount); i++) {
      const height = data[i] || 1;
      ctx.fillRect(
        i * (BAR_WIDTH + GAP),
        WAVEFORM_HEIGHT - height,
        BAR_WIDTH,
        height
      );
    }
  }, [
    waveformData,
    progress,
    duration,
    canvasWidth,
    barsCount,
    theme.colors.primary,
    theme.colors.secondary,
  ]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || duration <= 0) return;
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
        className="w-full cursor-pointer"
        style={{ height: WAVEFORM_HEIGHT }}
        onClick={handleClick}
      />
    </div>
  );
}

function joinWaveformData(arr: number[], m: number): number[] {
  const n = arr.length;
  if (m <= 0 || n === 0) return [];
  if (m > n) m = n;

  const result: number[] = [];
  const groupSize = n / m;

  for (let i = 0; i < m; i++) {
    const start = Math.floor(i * groupSize);
    const end = Math.floor((i + 1) * groupSize);
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += arr[j];
    }
    result.push(sum / (end - start));
  }

  return result;
}
