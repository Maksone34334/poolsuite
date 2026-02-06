"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <div className="bg-secondary">
      <div className="relative flex h-9 items-center bg-primary overflow-hidden">
        <button
          onClick={onPrevious}
          className={cn(
            "flex items-center justify-center px-2 text-secondary transition-transform",
            activeIndex === 0 && "-translate-x-8"
          )}
          aria-label="Previous screen"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 items-center justify-center gap-1 overflow-hidden">
          <span className="text-sm text-secondary">
            {`0${activeIndex + 1}`}
          </span>
          <span className="text-sm font-bold text-secondary">
            {screens[activeIndex]?.name}
          </span>
        </div>

        <button
          onClick={onNext}
          className={cn(
            "flex items-center justify-center px-2 text-secondary transition-transform",
            activeIndex === screens.length - 1 && "translate-x-8"
          )}
          aria-label="Next screen"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative flex bg-primary py-0.5">
        <div
          className="h-0.5 bg-secondary transition-all duration-300"
          style={{
            width: `${100 / screens.length}%`,
            marginLeft: `${(activeIndex * 100) / screens.length}%`,
          }}
        />
      </div>
    </div>
  );
}
