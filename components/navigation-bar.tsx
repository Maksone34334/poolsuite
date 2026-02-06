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
    <div className="bg-foreground text-primary-foreground">
      <div className="flex items-center">
        <button
          onClick={onPrevious}
          className="flex h-10 w-12 items-center justify-center text-primary-foreground transition-opacity hover:opacity-70"
          aria-label="Previous screen"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-center gap-2 py-2">
            <span className="text-sm font-sans text-primary-foreground">
              {`0${activeIndex + 1}`}
            </span>
            <span className="text-sm font-sans font-bold text-primary-foreground">
              {screens[activeIndex]?.name}
            </span>
          </div>
        </div>

        <button
          onClick={onNext}
          className="flex h-10 w-12 items-center justify-center text-primary-foreground transition-opacity hover:opacity-70"
          aria-label="Next screen"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative h-0.5 bg-primary-foreground/30">
        <div
          className="absolute h-full bg-primary-foreground transition-all duration-300"
          style={{
            width: `${100 / screens.length}%`,
            left: `${(activeIndex * 100) / screens.length}%`,
          }}
        />
      </div>
    </div>
  );
}
