import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

function getInitialDark() {
  const stored = localStorage.getItem("dark");
  if (stored !== null) return stored === "true";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    localStorage.setItem("dark", String(dark));
  }, [dark]);

  const toggleDark = () => setDark((d) => !d);

  return <ThemeContext.Provider value={{ dark, toggleDark }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- standard context+hook pairing, not worth a second file
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
