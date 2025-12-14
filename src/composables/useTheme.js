import { ref, watch } from 'vue';
import { useMainStore } from '@/store';

export function useTheme() {
  const store = useMainStore();
  const currentTheme = ref(store.preferences.theme || 'dark');

  const applyTheme = (theme) => {
    // Remove previous theme classes
    document.body.classList.remove('theme-dark', 'theme-light');
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    // Update store
    store.updatePreference('theme', theme);
    currentTheme.value = theme;
  };

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };

  // Watch for changes in store (if updated from settings)
  watch(() => store.preferences.theme, (newVal) => {
    if (newVal !== currentTheme.value) {
      applyTheme(newVal);
    }
  });

  // Initial application
  applyTheme(currentTheme.value);

  return {
    currentTheme,
    toggleTheme,
    applyTheme
  };
}