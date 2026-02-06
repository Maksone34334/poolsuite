"use client";

import { appThemes, useThemeStore } from "@/lib/theme-store";
import { ThemeCard } from "@/components/theme-card";

export function ThemesScreen() {
  const currentTheme = useThemeStore((s) => s.currentTheme);

  return (
    <div className="flex-1 overflow-y-auto bg-secondary p-2">
      <div className="flex flex-col gap-2 pb-16">
        {appThemes.map((theme) => (
          <ThemeCard
            key={theme.name}
            theme={theme}
            isSelected={theme.name === currentTheme.name}
          />
        ))}
      </div>
    </div>
  );
}
