import { ref } from 'vue';
export function useParticles() {
  const showParticles = ref(true);
  return { showParticles };
}