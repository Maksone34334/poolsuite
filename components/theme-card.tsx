"use client"

import { RetroCard } from "@/components/retro-card"
import { useThemeStore, type AppTheme } from "@/lib/theme-store"
import { Check } from "lucide-react"

interface ThemeCardProps {
  theme: AppTheme
  isSelected: boolean
}

export function ThemeCard({ theme, isSelected }: ThemeCardProps) {
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <RetroCard
      shadowSize="big"
      containerClassName="h-20"
      className="flex h-full flex-1 items-center justify-center overflow-hidden"
      onClick={() => setTheme(theme)}
    >
      {/* Background with theme colors */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: theme.colors.secondary }}
      >
        {/* Dithered checkerboard pattern */}
        <svg className="h-full w-full opacity-30" aria-hidden="true">
          <defs>
            <pattern
              id={`dither-${theme.name.replace(/\s/g, "-")}`}
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <rect width="2" height="2" fill={theme.colors.primary} />
              <rect
                x="2"
                y="2"
                width="2"
                height="2"
                fill={theme.colors.primary}
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#dither-${theme.name.replace(/\s/g, "-")})`}
          />
        </svg>
      </div>

      <span
        className="relative z-10 flex items-center gap-2 rounded-[var(--radius)] px-2 py-1 text-sm font-bold"
        style={{
          backgroundColor: isSelected
            ? theme.colors.primary
            : theme.colors.secondary,
          color: isSelected
            ? theme.colors.secondary
            : theme.colors.primary,
        }}
      >
        {isSelected && <Check className="h-3 w-3" />}
        {theme.name}
      </span>
    </RetroCard>
  )
}
