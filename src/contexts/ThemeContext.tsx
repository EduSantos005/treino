import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colors: ColorScheme;
  restTime: number;
  setRestTime: (seconds: number) => Promise<void>;
}

interface ColorScheme {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  primary: string;
  success: string;
  error: string;
  border: string;
  borderLight: string;
  placeholder: string;
  disabled: string;
  shadow: string;
}

const lightColors: ColorScheme = {
  background: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceVariant: '#F0F0F0',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#007AFF',
  success: '#34C759',
  error: '#FF3B30',
  border: '#DDDDDD',
  borderLight: '#EEEEEE',
  placeholder: '#999999',
  disabled: '#CCCCCC',
  shadow: '#000000',
};

const darkColors: ColorScheme = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  primary: '#0A84FF',
  success: '#30D158',
  error: '#FF453A',
  border: '#38383A',
  borderLight: '#48484A',
  placeholder: '#636366',
  disabled: '#48484A',
  shadow: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';
const REST_TIME_STORAGE_KEY = '@app_rest_time';
const DEFAULT_REST_TIME = 60; // 60 segundos

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('auto');
  const [restTime, setRestTimeState] = useState<number>(DEFAULT_REST_TIME);

  // Determina se deve usar dark mode
  const isDark = theme === 'auto'
    ? systemColorScheme === 'dark'
    : theme === 'dark';

  const colors = isDark ? darkColors : lightColors;

  // Carrega o tema e tempo de descanso salvos ao iniciar
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedTheme, savedRestTime] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(REST_TIME_STORAGE_KEY),
        ]);

        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto') {
          setThemeState(savedTheme);
        }

        if (savedRestTime) {
          const time = parseInt(savedRestTime, 10);
          if (!isNaN(time) && time > 0) {
            setRestTimeState(time);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };
    loadSettings();
  }, []);

  // Salva o tema quando alterado
  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  // Salva o tempo de descanso quando alterado
  const setRestTime = async (seconds: number) => {
    try {
      if (seconds > 0) {
        await AsyncStorage.setItem(REST_TIME_STORAGE_KEY, seconds.toString());
        setRestTimeState(seconds);
      }
    } catch (error) {
      console.error('Erro ao salvar tempo de descanso:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colors, restTime, setRestTime }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}
