import { ref } from 'vue';

const showParticles = ref(true);

export function useParticles() {
  const toggleParticles = () => {
    showParticles.value = !showParticles.value;
    // Save to local storage if needed
    localStorage.setItem('showParticles', showParticles.value);
  };

  const initParticlesPreference = () => {
    const saved = localStorage.getItem('showParticles');
    if (saved !== null) {
      showParticles.value = saved === 'true';
    }
  };

  // Initialize on load
  initParticlesPreference();

  return {
    showParticles,
    toggleParticles
  };
}