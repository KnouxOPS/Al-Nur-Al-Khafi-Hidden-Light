<template>
  <div class="daily-hadith-widget" v-if="hadith">
    <div class="widget-header">
      <div class="icon-wrapper">
        <span class="icon">✨</span>
      </div>
      <h3>{{ $t('dailyHadith') }}</h3>
    </div>
    
    <div class="widget-content">
      <blockquote class="hadith-text">
        "{{ currentLang === 'ar' ? hadith.text : (hadith.textEn || hadith.text) }}"
      </blockquote>
      <div class="hadith-source">
        — {{ currentLang === 'ar' ? hadith.source : (hadith.sourceEn || hadith.source) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/store';

const store = useMainStore();
const hadith = computed(() => store.content.dailyHadith);
const currentLang = computed(() => store.preferences.language);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.daily-hadith-widget {
  background: rgba($dark-secondary, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($dark-accent, 0.2);
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform $duration-normal;
  max-width: 800px;
  margin: 0 auto;

  &:hover {
    border-color: rgba($dark-accent, 0.4);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, transparent, $dark-accent, transparent);
  }
  
  .theme-light & {
    background: rgba($light-secondary, 0.1);
    border-color: rgba($light-accent, 0.3);
  }
}

.widget-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;

  h3 {
    font-family: 'Amiri', serif;
    font-size: $font-size-xl;
    color: $dark-accent;
    margin: 0;
  }
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba($dark-accent, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon {
    font-size: 1.2rem;
  }
}

.widget-content {
  position: relative;
}

.hadith-text {
  font-family: 'Amiri', serif;
  font-size: $font-size-xl;
  line-height: 1.8;
  color: $dark-text;
  margin: 0 0 $spacing-md 0;
  
  .theme-light & {
    color: $light-text;
  }
}

.hadith-source {
  font-size: $font-size-sm;
  color: $dark-text-secondary;
  font-weight: 500;
  
  .theme-light & {
    color: $light-text-secondary;
  }
}
</style>