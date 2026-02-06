"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Screen {
  id: string
  name: string
}

interface NavigationBarProps {
  screens: Screen[]
  activeIndex: number
  onPrevious: () => void
  onNext: () => void
}

export function NavigationBar({
  screens,
  activeIndex,
  onPrevious,
  onNext,
}: NavigationBarProps) {
  return (
    <div style={{ backgroundColor: "var(--theme-secondary)" }}>
      <div
        className="relative flex h-9 items-center overflow-hidden"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        <button
          onClick={onPrevious}
          className={cn(
            "flex items-center justify-center px-2 transition-transform duration-200",
            activeIndex === 0 && "-translate-x-8 opacity-0"
          )}
          style={{ color: "var(--theme-secondary)" }}
          aria-label="Previous screen"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 items-center justify-center gap-1 overflow-hidden">
          <span
            className="text-xs"
            style={{ color: "var(--theme-secondary)" }}
          >
            {`0${activeIndex + 1}`}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: "var(--theme-secondary)" }}
          >
            {screens[activeIndex]?.name}
          </span>
        </div>

        <button
          onClick={onNext}
          className={cn(
            "flex items-center justify-center px-2 transition-transform duration-200",
            activeIndex === screens.length - 1 && "translate-x-8 opacity-0"
          )}
          style={{ color: "var(--theme-secondary)" }}
          aria-label="Next screen"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="relative flex py-0.5"
        style={{ backgroundColor: "var(--theme-primary)" }}
      >
        <div
          className="h-0.5 transition-all duration-300"
          style={{
            backgroundColor: "var(--theme-secondary)",
            width: `${100 / screens.length}%`,
            marginLeft: `${(activeIndex * 100) / screens.length}%`,
          }}
        />
      </div>
    </div>
  )
}
