"use client";

import { NoiseOverlay } from "@/components/noise-overlay";
import { RetroCard } from "@/components/retro-card";
import { Lines } from "@/components/lines";

export function AboutScreen() {
  return (
    <div className="relative flex-1 overflow-y-auto bg-background">
      <NoiseOverlay density={0.05} inverted />
      <div className="relative z-10 flex flex-col gap-3 p-2">
        <RetroCard shadowSize="big" containerClassName="w-full">
          <div className="flex flex-col gap-4 p-5">
            <h2 className="text-lg font-bold font-sans text-foreground">
              About
            </h2>
            <Lines />
            <p className="text-sm font-sans leading-relaxed text-foreground">
              Poolsuite (formerly Poolside FM) is ultra-summer music for the
              modern leisure class. A retro internet radio station playing the
              finest selection of summer jams, poolside grooves, and beachside
              beats.
            </p>
            <Lines />
            <p className="text-sm font-sans leading-relaxed text-foreground">
              Originally launched as a weekend project, Poolsuite has grown into
              a full lifestyle brand celebrating the golden age of leisure. From
              curated playlists to Grand Leisure NFTs, we are on a mission to
              bring back the spirit of endless summers.
            </p>
            <Lines />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-sans text-muted-foreground">
                Version 1.0 - Web Edition
              </span>
              <a
                href="https://poolsuite.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold font-sans text-foreground underline"
              >
                poolsuite.net
              </a>
            </div>
          </div>
        </RetroCard>
      </div>
    </div>
  );
}
