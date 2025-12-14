import React, { createContext, useContext, useState, useEffect } from 'react';

interface StoreState {
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  loading: boolean;
  audioPlaying: boolean;
  setTheme: (t: 'dark' | 'light') => void;
  setLanguage: (l: 'ar' | 'en') => void;
  setLoading: (l: boolean) => void;
  setAudioPlaying: (p: boolean) => void;
  toggleAudio: () => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'ar' | 'en'>('en'); // Default to EN for now, can switch
  const [loading, setLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    // Load preferences
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    const savedLang = localStorage.getItem('language') as 'ar' | 'en';
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
    
    // Simulate initial loading
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    // document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; 
    // Keeping LTR structure for now to avoid breaking layout until full RTL support is verified
  }, [language]);

  const toggleAudio = () => setAudioPlaying(!audioPlaying);

  return (
    <StoreContext.Provider value={{
      theme,
      language,
      loading,
      audioPlaying,
      setTheme,
      setLanguage,
      setLoading,
      setAudioPlaying,
      toggleAudio
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};