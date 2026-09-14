import { createContext, useContext, useLayoutEffect, useState } from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "modimal_theme";

/**
 * Wrap your app with this provider so any component can read the current
 * theme or call toggleTheme(). The choice is saved to localStorage so a
 * page refresh keeps the theme the user picked, and it's applied as a
 * "dark" class on <html> so plain CSS (see src/darkMode.css) can theme
 * every page from one central place.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "dark" ? "dark" : "light";
  });

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
};

export default ThemeContext;
