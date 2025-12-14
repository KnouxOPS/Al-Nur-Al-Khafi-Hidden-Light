<template>
  <div v-if="loading" class="loading-overlay" :class="{ 'fullscreen': fullscreen }">
    <div class="loading-content">
      <div class="spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    default: ''
  },
  fullscreen: {
    type: Boolean,
    default: true
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($dark-background, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal;
  backdrop-filter: blur(5px);
  
  &.fullscreen {
    position: fixed;
  }
  
  .theme-light & {
    background-color: rgba($light-background, 0.9);
  }
}

.loading-content {
  text-align: center;
  color: $dark-text;
  
  .theme-light & {
    color: $light-text;
  }
}

.spinner {
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: $dark-accent;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  
  .theme-light & {
    border-top-color: $light-accent;
  }
  
  &:nth-child(1) { animation-delay: -0.45s; }
  &:nth-child(2) { animation-delay: -0.3s; width: 80%; height: 80%; top: 10%; left: 10%; }
  &:nth-child(3) { animation-delay: -0.15s; width: 60%; height: 60%; top: 20%; left: 20%; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-message {
  font-family: 'Amiri', serif;
  font-size: 1.2rem;
  margin-top: $spacing-md;
}
</style>