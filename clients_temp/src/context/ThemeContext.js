import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [highContrast, setHighContrast] = useState(() => {
    const savedHighContrast = localStorage.getItem('high-contrast');
    return savedHighContrast === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    localStorage.setItem('theme', theme);
    localStorage.setItem('high-contrast', highContrast);
  }, [theme, highContrast]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prevHighContrast => !prevHighContrast);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, highContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);