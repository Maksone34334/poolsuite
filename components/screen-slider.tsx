"use client"

import { useState, type FC } from "react"
import { NavigationBar } from "@/components/navigation-bar"
import { PlayerBar } from "@/components/player-bar"

interface ScreenSlide {
  id: string
  name: string
  Component: FC
}

interface ScreenSliderProps {
  screens: ScreenSlide[]
}

export function ScreenSlider({ screens }: ScreenSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToPrevious = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => Math.min(screens.length - 1, prev + 1))
  }

  const ActiveComponent = screens[activeIndex].Component

  return (
    <div className="flex h-dvh flex-col" style={{ backgroundColor: "var(--theme-primary)" }}>
      <NavigationBar
        screens={screens}
        activeIndex={activeIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <ActiveComponent />
        {activeIndex !== 0 && (
          <PlayerBar onPress={() => setActiveIndex(0)} />
        )}
      </div>
    </div>
  )
}
