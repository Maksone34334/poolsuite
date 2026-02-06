export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface AppThemes {
  [themeName: string]: Theme;
}

export const appThemes: AppThemes = {
  "Poolsuite FM": {
    name: "Poolsuite FM",
    colors: { secondary: "#faeed9", primary: "#000" },
  },
  "Pink Lemonade": {
    name: "Pink Lemonade",
    colors: { secondary: "#f1b1ff", primary: "#292d70" },
  },
  Poolwater: {
    name: "Poolwater",
    colors: { secondary: "#56faaf", primary: "#2229ab" },
  },
  "Seashore Resort": {
    name: "Seashore Resort",
    colors: { secondary: "#f5d298", primary: "#164967" },
  },
  "Bubba Hubba": {
    name: "Bubba Hubba",
    colors: { secondary: "#ea0e49", primary: "#0f1448" },
  },
  "Peach Meringue": {
    name: "Peach Meringue",
    colors: { secondary: "#e1955e", primary: "#0a107a" },
  },
  "Green New Deal": {
    name: "Green New Deal",
    colors: { secondary: "#3ec558", primary: "#063814" },
  },
  "Commodore 69": {
    name: "Commodore 69",
    colors: { secondary: "#b2cbd5", primary: "#31373b" },
  },
};

export const appThemesList = Object.values(appThemes);
export const defaultThemeName = "Poolsuite FM";

export function applyTheme(themeName: string) {
  const theme = appThemes[themeName];
  if (!theme) return;

  const root = document.documentElement;
  const p = theme.colors.primary;
  const s = theme.colors.secondary;

  root.style.setProperty("--theme-primary", p);
  root.style.setProperty("--theme-secondary", s);

  // Update Tailwind design tokens
  root.style.setProperty("--color-background", s);
  root.style.setProperty("--color-foreground", p);
  root.style.setProperty("--color-card", s);
  root.style.setProperty("--color-card-foreground", p);
  root.style.setProperty("--color-primary", p);
  root.style.setProperty("--color-primary-foreground", s);
  root.style.setProperty("--color-border", p);
  root.style.setProperty("--color-ring", p);

  try {
    localStorage.setItem("poolsuite-theme", themeName);
  } catch {}
}

export function getStoredTheme(): string {
  try {
    return localStorage.getItem("poolsuite-theme") || defaultThemeName;
  } catch {
    return defaultThemeName;
  }
}
