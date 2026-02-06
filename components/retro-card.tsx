"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface RetroCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  inverted?: boolean;
  shadowSize?: "small" | "big";
  as?: "button" | "div";
  containerClassName?: string;
}

const shadowSizeMap = {
  small: 3,
  big: 5,
};

export const RetroCard = forwardRef<HTMLButtonElement, RetroCardProps>(
  (
    {
      inverted = false,
      shadowSize = "small",
      as = "div",
      containerClassName,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const offset = shadowSizeMap[shadowSize];
    const Comp = onClick ? "button" : (as as any);

    return (
      <div
        className={cn("relative", containerClassName)}
        style={{ paddingBottom: offset, paddingRight: offset }}
      >
        {/* Shadow layers */}
        <div
          className={cn(
            "absolute rounded-[var(--radius)]",
            inverted ? "bg-primary-foreground" : "bg-foreground"
          )}
          style={{
            inset: 0,
            top: offset,
            left: offset,
            right: 0,
            bottom: 0,
          }}
        />
        <div
          className={cn(
            "absolute rounded-[var(--radius)]",
            inverted ? "bg-primary-foreground" : "bg-foreground"
          )}
          style={{
            top: offset,
            left: offset,
            right: -offset,
            bottom: -offset,
          }}
        />

        {/* Main card */}
        <Comp
          ref={ref}
          onClick={onClick}
          className={cn(
            "relative rounded-[var(--radius)] border transition-transform",
            inverted
              ? "border-primary-foreground bg-foreground text-primary-foreground"
              : "border-foreground bg-card text-card-foreground",
            onClick && "cursor-pointer",
            className
          )}
          style={{} as React.CSSProperties}
          {...props}
        >
          {children}
        </Comp>
      </div>
    );
  }
);
RetroCard.displayName = "RetroCard";
