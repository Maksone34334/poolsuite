"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { themes, defaultThemeName, type Theme } from "@/lib/theme"

interface ThemeContextValue {
  theme: Theme
  themeName: string
  changeTheme: (name: string) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes[defaultThemeName],
  themeName: defaultThemeName,
  changeTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function applyThemeToDOM(theme: Theme) {
  document.documentElement.style.setProperty("--theme-primary", theme.colors.primary)
  document.documentElement.style.setProperty("--theme-secondary", theme.colors.secondary)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState(defaultThemeName)
  const theme = themes[themeName] || themes[defaultThemeName]

  useEffect(() => {
    const saved = localStorage.getItem("poolsuite-theme")
    if (saved && themes[saved]) {
      setThemeName(saved)
      applyThemeToDOM(themes[saved])
    }
  }, [])

  const changeTheme = useCallback((name: string) => {
    if (themes[name]) {
      setThemeName(name)
      applyThemeToDOM(themes[name])
      localStorage.setItem("poolsuite-theme", name)
    }
  }, [])

  useEffect(() => {
    applyThemeToDOM(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
