import { ref } from 'vue';
import { useMainStore } from '../store/index.js';

export function useTheme() {
  const store = useMainStore();
  const currentTheme = ref(store.preferences.theme);

  return { currentTheme };
}