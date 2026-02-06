import { create } from "zustand";
import { appThemes, defaultTheme } from "./themes";
import { Theme } from "./types";

interface ThemeState {
  currentThemeName: string;
  theme: Theme;
}

export const useThemeStore = create<ThemeState>()(() => ({
  currentThemeName: defaultTheme,
  theme: appThemes[defaultTheme],
}));

export const changeTheme = (themeName: string) => {
  const theme = appThemes[themeName];
  if (theme) {
    useThemeStore.setState({ currentThemeName: themeName, theme });
    // Update CSS custom properties
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--theme-primary",
        theme.colors.primary
      );
      document.documentElement.style.setProperty(
        "--theme-secondary",
        theme.colors.secondary
      );
    }
  }
};

export const getTheme = () => useThemeStore.getState().theme;
