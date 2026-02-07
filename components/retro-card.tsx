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

  return (
    <div
      className={cn("relative", containerClassName)}
      style={{ paddingBottom: offset, paddingRight: offset }}
    >
      {/* Shadow */}
      <div
        className={cn(
          "absolute rounded-sm",
          inverted ? "bg-primary-foreground" : "bg-foreground"
        )}
        style={{ top: offset, left: offset, right: 0, bottom: 0 }}
      />

      {/* Card */}
      <Tag
        onClick={onClick}
        className={cn(
          "relative rounded-sm border",
          inverted
            ? "border-primary-foreground bg-foreground text-primary-foreground"
            : "border-foreground bg-card text-card-foreground",
          onClick && "cursor-pointer active:translate-x-px active:translate-y-px",
          className
        )}
      >
        {children}
      </Tag>
    </div>
  );
}
