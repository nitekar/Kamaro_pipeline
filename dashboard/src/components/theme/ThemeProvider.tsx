import React, { useEffect, useState, createContext, useContext } from 'react';
type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'teal';
interface ThemeContextType {
  currentTheme: ThemeColor;
  changeTheme: (theme: ThemeColor) => void;
  getColorClass: (type: 'bg' | 'text' | 'border', variant?: 'light' | 'medium' | 'dark') => string;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const themeColors = {
  blue: {
    bg: {
      light: 'bg-blue-50',
      medium: 'bg-blue-100',
      dark: 'bg-blue-600'
    },
    text: {
      light: 'text-blue-500',
      medium: 'text-blue-600',
      dark: 'text-blue-700'
    },
    border: {
      light: 'border-blue-200',
      medium: 'border-blue-500',
      dark: 'border-blue-600'
    }
  },
  green: {
    bg: {
      light: 'bg-green-50',
      medium: 'bg-green-100',
      dark: 'bg-green-600'
    },
    text: {
      light: 'text-green-500',
      medium: 'text-green-600',
      dark: 'text-green-700'
    },
    border: {
      light: 'border-green-200',
      medium: 'border-green-500',
      dark: 'border-green-600'
    }
  },
  purple: {
    bg: {
      light: 'bg-purple-50',
      medium: 'bg-purple-100',
      dark: 'bg-purple-600'
    },
    text: {
      light: 'text-purple-500',
      medium: 'text-purple-600',
      dark: 'text-purple-700'
    },
    border: {
      light: 'border-purple-200',
      medium: 'border-purple-500',
      dark: 'border-purple-600'
    }
  },
  orange: {
    bg: {
      light: 'bg-orange-50',
      medium: 'bg-orange-100',
      dark: 'bg-orange-600'
    },
    text: {
      light: 'text-orange-500',
      medium: 'text-orange-600',
      dark: 'text-orange-700'
    },
    border: {
      light: 'border-orange-200',
      medium: 'border-orange-500',
      dark: 'border-orange-600'
    }
  },
  teal: {
    bg: {
      light: 'bg-teal-50',
      medium: 'bg-teal-100',
      dark: 'bg-teal-600'
    },
    text: {
      light: 'text-teal-500',
      medium: 'text-teal-600',
      dark: 'text-teal-700'
    },
    border: {
      light: 'border-teal-200',
      medium: 'border-teal-500',
      dark: 'border-teal-600'
    }
  }
};
export function ThemeProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('blue');
  const changeTheme = (theme: ThemeColor) => {
    setCurrentTheme(theme);
    localStorage.setItem('dashboard-theme', theme);
  };
  const getColorClass = (type: 'bg' | 'text' | 'border', variant: 'light' | 'medium' | 'dark' = 'dark') => {
    return themeColors[currentTheme][type][variant];
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme') as ThemeColor | null;
    if (savedTheme && Object.keys(themeColors).includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);
  return <ThemeContext.Provider value={{
    currentTheme,
    changeTheme,
    getColorClass
  }}>
      {children}
    </ThemeContext.Provider>;
}
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};