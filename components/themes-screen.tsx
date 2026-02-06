"use client";

import { Check } from "lucide-react";
import { RetroCard } from "@/components/retro-card";
import { NoiseOverlay } from "@/components/noise-overlay";
import { appThemesList, applyTheme, Theme } from "@/lib/theme";

interface ThemesScreenProps {
  currentThemeName: string;
  onThemeChange: (name: string) => void;
}

export function ThemesScreen({
  currentThemeName,
  onThemeChange,
}: ThemesScreenProps) {
  return (
    <div className="relative flex-1 overflow-y-auto bg-background">
      <NoiseOverlay density={0.05} inverted />
      <div className="relative z-10 flex flex-col gap-2 p-2">
        {appThemesList.map((theme) => (
          <ThemeCard
            key={theme.name}
            theme={theme}
            isSelected={theme.name === currentThemeName}
            onSelect={() => {
              applyTheme(theme.name);
              onThemeChange(theme.name);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <RetroCard shadowSize="big" containerClassName="w-full" onClick={onSelect}>
      <div className="relative h-24 overflow-hidden rounded-[var(--radius)]">
        {/* Preview background with theme colors */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-full w-px"
                style={{ backgroundColor: theme.colors.primary }}
              />
            ))}
          </div>
          <NoiseOverlay density={0.1} />
        </div>

        {/* Theme name badge */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-2">
          <div
            className="flex items-center gap-1.5 rounded-[var(--radius)] border px-3 py-1"
            style={{
              backgroundColor: isSelected
                ? theme.colors.primary
                : theme.colors.secondary,
              borderColor: theme.colors.primary,
              color: isSelected
                ? theme.colors.secondary
                : theme.colors.primary,
            }}
          >
            {isSelected && <Check className="h-3 w-3" />}
            <span className="text-xs font-bold font-sans">{theme.name}</span>
          </div>
        </div>
      </div>
    </RetroCard>
  );
}
