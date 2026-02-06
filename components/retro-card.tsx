"use client"

import { cn } from "@/lib/utils"
import { type ReactNode, type MouseEventHandler } from "react"

interface RetroCardProps {
  inverted?: boolean
  shadowSize?: "small" | "big"
  children: ReactNode
  className?: string
  containerClassName?: string
  onClick?: MouseEventHandler<HTMLElement>
}

const shadowConfig = { small: 1, big: 3 }

export function RetroCard({
  inverted = false,
  shadowSize = "small",
  children,
  className,
  containerClassName,
  onClick,
}: RetroCardProps) {
  const offset = shadowConfig[shadowSize]
  const Tag = onClick ? "button" : "div"

  return (
    <div
      className={cn("relative", containerClassName)}
      style={{ paddingRight: offset, paddingBottom: offset }}
    >
      {/* Placeholder shadow */}
      <div
        className="absolute rounded-[var(--radius)]"
        style={{
          top: 0,
          right: offset,
          bottom: offset,
          left: 0,
          backgroundColor: inverted
            ? "var(--theme-secondary)"
            : "var(--theme-primary)",
        }}
      />
      {/* Offset shadow */}
      <div
        className="absolute rounded-[var(--radius)]"
        style={{
          top: offset,
          left: offset,
          right: 0,
          bottom: 0,
          backgroundColor: inverted
            ? "var(--theme-secondary)"
            : "var(--theme-primary)",
        }}
      />
      <Tag
        className={cn(
          "relative z-10 rounded-[var(--radius)] border",
          onClick &&
            "cursor-pointer active:translate-x-[var(--shadow-offset)] active:translate-y-[var(--shadow-offset)]",
          className
        )}
        style={
          {
            "--shadow-offset": `${offset}px`,
            backgroundColor: inverted
              ? "var(--theme-primary)"
              : "var(--theme-secondary)",
            borderColor: inverted
              ? "var(--theme-secondary)"
              : "var(--theme-primary)",
            color: inverted
              ? "var(--theme-secondary)"
              : "var(--theme-primary)",
          } as React.CSSProperties
        }
        onClick={onClick}
      >
        {children}
      </Tag>
    </div>
  )
}
