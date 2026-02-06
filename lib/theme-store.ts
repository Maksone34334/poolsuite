import { create } from "zustand";

export interface AppTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const appThemes: AppTheme[] = [
  { name: "Poolsuite FM", colors: { primary: "#000000", secondary: "#faeed9" } },
  { name: "Pink Lemonade", colors: { primary: "#292d70", secondary: "#f1b1ff" } },
  { name: "Poolwater", colors: { primary: "#2229ab", secondary: "#56faaf" } },
  { name: "Seashore Resort", colors: { primary: "#164967", secondary: "#f5d298" } },
  { name: "Bubba Hubba", colors: { primary: "#0f1448", secondary: "#ea0e49" } },
  { name: "Peach Meringue", colors: { primary: "#0a107a", secondary: "#e1955e" } },
  { name: "Green New Deal", colors: { primary: "#063814", secondary: "#3ec558" } },
  { name: "Commodore 69", colors: { primary: "#31373b", secondary: "#b2cbd5" } },
];

interface ThemeState {
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: appThemes[0],
  setTheme: (theme) => {
    set({ currentTheme: theme });
    document.documentElement.style.setProperty("--theme-primary", theme.colors.primary);
    document.documentElement.style.setProperty("--theme-secondary", theme.colors.secondary);
  },
}));
