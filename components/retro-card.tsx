"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface RetroCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  inverted?: boolean;
  shadowSize?: "small" | "big";
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "div" | "button";
}

const shadowConfig = { small: 1, big: 3 };

export function RetroCard({
  inverted = false,
  shadowSize = "small",
  children,
  className,
  containerClassName,
  as = "div",
  onClick,
  ...props
}: RetroCardProps) {
  const offset = shadowConfig[shadowSize];
  const Wrapper = as === "button" || onClick ? "button" : "div";

  return (
    <div
      className={cn("relative", containerClassName)}
      style={{ paddingRight: offset, paddingBottom: offset }}
    >
      {/* Placeholder shadow */}
      <div
        className={cn(
          "absolute rounded-[var(--radius)]",
          inverted ? "bg-secondary" : "bg-primary"
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
          "absolute rounded-[var(--radius)]",
          inverted ? "bg-secondary" : "bg-primary"
        )}
        style={{
          top: offset,
          left: offset,
          right: 0,
          bottom: 0,
        }}
      />
      <Wrapper
        className={cn(
          "relative z-10 rounded-[var(--radius)] border",
          inverted
            ? "border-secondary bg-primary text-secondary"
            : "border-primary bg-secondary text-primary",
          onClick && "cursor-pointer active:translate-x-[var(--shadow-offset)] active:translate-y-[var(--shadow-offset)]",
          className
        )}
        style={
          {
            "--shadow-offset": `${offset}px`,
          } as React.CSSProperties
        }
        onClick={onClick}
        {...(Wrapper === "button" ? props : {})}
      >
        {children}
      </Wrapper>
    </div>
  );
}
