import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'ascent' | 'classic' | 'emerald' | 'sunset' | 'cyber';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  description: string;
  badge?: string;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    card: string;
  };
  hasArtwork?: boolean;
}

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: 'ascent',
    name: 'Ascent (Teal & Amber)',
    subtitle: 'Growth, Teamwork & Illuminated Vision',
    description: 'Deep forest petrol teal, luminous turquoise, and glowing golden amber inspired by collective civic achievement.',
    badge: 'Uploaded Theme',
    previewColors: {
      primary: '#0a3c40',
      secondary: '#0d9488',
      accent: '#f59e0b',
      bg: '#f2faf9',
      card: '#ffffff',
    },
    hasArtwork: true,
  },
  {
    id: 'classic',
    name: 'Classic Monochrome',
    subtitle: 'High-Contrast Architectural Slate',
    description: 'Clean monochrome blacks, architectural slates, and crisp whites for focused minimal aesthetics.',
    previewColors: {
      primary: '#09090b',
      secondary: '#52525b',
      accent: '#0284c7',
      bg: '#f8fafc',
      card: '#ffffff',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald Civic',
    subtitle: 'Sustainable, Living Greenery',
    description: 'Botanical jade, deep forest emerald, and mint tints reflecting clean, thriving community infrastructure.',
    badge: 'Eco',
    previewColors: {
      primary: '#065f46',
      secondary: '#059669',
      accent: '#f59e0b',
      bg: '#f0fdf4',
      card: '#ffffff',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Amber',
    subtitle: 'Solar Heat & Urgent Civic Action',
    description: 'Terracotta orange, sunset coral, and solar gold for high-visibility public alerts and quick fixes.',
    previewColors: {
      primary: '#9a3412',
      secondary: '#ea580c',
      accent: '#eab308',
      bg: '#fff7ed',
      card: '#ffffff',
    },
  },
  {
    id: 'cyber',
    name: 'Cyber Indigo',
    subtitle: 'Futuristic AI & Quantum Cyan',
    description: 'Deep royal indigo, electric violet, and vivid neon cyan representing cutting-edge Gemini Vision AI.',
    badge: 'AI Tech',
    previewColors: {
      primary: '#3730a3',
      secondary: '#4f46e5',
      accent: '#06b6d4',
      bg: '#f5f3ff',
      card: '#ffffff',
    },
  },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  customAccent: string | null;
  setCustomAccent: (color: string | null) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  activeThemeConfig: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_THEME_KEY = 'spotfix_active_theme';
const STORAGE_DARK_KEY = 'spotfix_dark_mode';
const STORAGE_CUSTOM_ACCENT_KEY = 'spotfix_custom_accent';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to the user's requested theme: 'ascent'!
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved && AVAILABLE_THEMES.some((t) => t.id === saved)) {
        return saved as ThemeId;
      }
    } catch {
      // ignore
    }
    return 'ascent';
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DARK_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // ignore
    }
    // Default to false (clean crisp light mode, but user can easily toggle)
    return false;
  });

  const [customAccent, setCustomAccentState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_CUSTOM_ACCENT_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Apply theme & dark mode to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Apply data-theme attribute
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // ignore
    }

    // Apply or remove dark class
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_DARK_KEY, String(darkMode));
    } catch {
      // ignore
    }

    // Apply custom accent if specified
    if (customAccent) {
      root.style.setProperty('--brand-accent', customAccent);
      try {
        localStorage.setItem(STORAGE_CUSTOM_ACCENT_KEY, customAccent);
      } catch {
        // ignore
      }
    } else {
      root.style.removeProperty('--brand-accent');
      try {
        localStorage.removeItem(STORAGE_CUSTOM_ACCENT_KEY);
      } catch {
        // ignore
      }
    }
  }, [theme, darkMode, customAccent]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
  };

  const setDarkMode = (val: boolean) => {
    setDarkModeState(val);
  };

  const toggleDarkMode = () => {
    setDarkModeState((prev) => !prev);
  };

  const setCustomAccent = (color: string | null) => {
    setCustomAccentState(color);
  };

  const activeThemeConfig = AVAILABLE_THEMES.find((t) => t.id === theme) || AVAILABLE_THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        customAccent,
        setCustomAccent,
        isCustomizerOpen,
        setIsCustomizerOpen,
        activeThemeConfig,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
