'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'gold' | 'blue';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'gold',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('gold');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'gold' ? 'blue' : 'gold'));
  };

  // ✅ update body class whenever theme changes
  useEffect(() => {
    document.body.classList.remove('gold-theme', 'blue-theme');
    document.body.classList.add(theme === 'gold' ? 'gold-theme' : 'blue-theme');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
