"use client"

import { Noise } from "@/components/noise"

export function AboutScreen() {
  return (
    <div
      className="relative flex flex-1 flex-col gap-6 p-2"
      style={{ backgroundColor: "var(--theme-secondary)" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Noise className="absolute inset-0" density={0.05} inverted />
      </div>
      <div className="relative z-10 flex flex-col gap-6 p-4 pb-16">
        <h2 className="text-lg font-bold">About</h2>
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed">
            Poolsuite FM (formerly Poolside FM) is the ultra-summer digital
            leisure brand. We make music players, sunscreen, and good vibes.
          </p>
          <p className="text-sm leading-relaxed">
            Grand Leisure, Inc. All rights reserved. Kick back, relax, and
            enjoy the good life.
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-xs">Built with love and sunshine.</p>
            <a
              href="https://poolsuite.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold underline"
            >
              poolsuite.net
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
