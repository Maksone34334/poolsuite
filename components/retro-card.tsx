"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, type MouseEventHandler } from "react";

interface RetroCardProps {
  inverted?: boolean;
  shadowSize?: "small" | "big";
  containerClassName?: string;
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
}

const shadowSizeMap = { small: 3, big: 5 };

export function RetroCard({
  inverted = false,
  shadowSize = "small",
  containerClassName,
  className,
  children,
  onClick,
}: RetroCardProps) {
  const offset = shadowSizeMap[shadowSize];
  const Tag = onClick ? "button" : "div";

  const shadowColor = inverted ? "var(--theme-secondary)" : "var(--theme-primary)";
  const bgColor = inverted ? "var(--theme-primary)" : "var(--theme-secondary)";
  const borderColor = inverted ? "var(--theme-secondary)" : "var(--theme-primary)";

  return (
    <div
      className={cn("relative", containerClassName)}
      style={{ paddingBottom: offset, paddingRight: offset }}
    >
      {/* Shadow */}
      <div
        className="absolute rounded-sm"
        style={{
          top: offset,
          left: offset,
          right: 0,
          bottom: 0,
          backgroundColor: shadowColor,
        }}
      />

      {/* Card */}
      <Tag
        onClick={onClick}
        className={cn(
          "relative rounded-sm border",
          onClick && "cursor-pointer active:translate-x-px active:translate-y-px",
          className
        )}
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          color: inverted ? "var(--theme-secondary)" : "var(--theme-primary)",
        }}
      >
        {children}
      </Tag>
    </div>
  );
}
