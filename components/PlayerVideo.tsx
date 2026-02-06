"use client";

import React from "react";
import Image from "next/image";

export function PlayerVideo() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-sm bg-[var(--theme-primary)]">
      <Image
        src="/images/poolsuite.png"
        alt="Poolsuite FM"
        fill
        className="object-cover opacity-80"
        style={{ imageRendering: "auto" }}
        priority
      />
      <div className="absolute inset-0 bg-[var(--theme-primary)] opacity-20" />
    </div>
  );
}
