"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RetroCardProps {
  children: React.ReactNode;
  inverted?: boolean;
  shadowSize?: "small" | "big";
  className?: string;
  onClick?: () => void;
}

const shadowSizeConfig = {
  small: 1,
  big: 3,
};

export function RetroCard({
  children,
  inverted = false,
  shadowSize = "small",
  className,
  onClick,
}: RetroCardProps) {
  const offset = shadowSizeConfig[shadowSize];

  return (
    <div
      className="relative"
      style={{ paddingRight: offset, paddingBottom: offset }}
    >
      {/* Placeholder shadow */}
      <div
        className={cn(
          "absolute rounded-sm",
          inverted ? "bg-[var(--theme-secondary)]" : "bg-[var(--theme-primary)]"
        )}
        style={{
          top: 0,
          right: offset,
          bottom: offset,
          left: 0,
        }}
      />
      {/* Offset shadow */}
      <div
        className={cn(
          "absolute rounded-sm",
          inverted ? "bg-[var(--theme-secondary)]" : "bg-[var(--theme-primary)]"
        )}
        style={{
          top: offset,
          left: offset,
          right: 0,
          bottom: 0,
        }}
      />
      {/* Main card */}
      <button
        type="button"
        disabled={!onClick}
        onClick={onClick}
        className={cn(
          "relative z-[1] w-full rounded-sm border text-left",
          inverted
            ? "border-[var(--theme-secondary)] bg-[var(--theme-primary)]"
            : "border-[var(--theme-primary)] bg-[var(--theme-secondary)]",
          onClick &&
            "cursor-pointer active:translate-x-[var(--shadow-offset)] active:translate-y-[var(--shadow-offset)]",
          !onClick && "cursor-default",
          className
        )}
        style={
          {
            "--shadow-offset": `${offset}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </button>
    </div>
  );
}
