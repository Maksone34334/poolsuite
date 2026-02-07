"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Screen {
  id: string;
  name: string;
}

interface NavigationBarProps {
  screens: Screen[];
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationBar({
  screens,
  activeIndex,
  onPrevious,
  onNext,
}: NavigationBarProps) {
  return (
    <div style={{ backgroundColor: "var(--theme-primary)", color: "var(--theme-secondary)" }}>
      <div className="flex items-center">
        <button
          onClick={onPrevious}
          className="flex h-10 w-12 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="Previous screen"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-center gap-2 py-2">
            <span className="text-sm font-sans">
              {`0${activeIndex + 1}`}
            </span>
            <span className="text-sm font-sans font-bold">
              {screens[activeIndex]?.name}
            </span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="flex h-10 w-12 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="Next screen"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="relative h-0.5" style={{ backgroundColor: "var(--theme-secondary)", opacity: 0.3 }}>
        <div
          className="absolute h-full transition-all duration-300"
          style={{
            backgroundColor: "var(--theme-secondary)",
            width: `${100 / screens.length}%`,
            left: `${(activeIndex * 100) / screens.length}%`,
          }}
        />
      </div>
    </div>
  );
}
