<template>
  <div class="biography-view container">
    <header class="section-header">
      <h1 class="page-title">{{ $t('biography.title') }}</h1>
      <p class="page-subtitle">{{ $t('biography.subtitle') }}</p>
    </header>

    <div class="timeline">
      <div v-for="(event, index) in events" :key="index" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="date">{{ event.year }}</div>
          <h3 class="title">{{ event.title }}</h3>
          <p class="description">{{ event.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const events = ref([
  { year: '570 CE', title: 'The Year of the Elephant', description: 'Birth of Muhammad ﷺ in Mecca.' },
  { year: '610 CE', title: 'The First Revelation', description: 'Receiving the first verses of Quran in Cave Hira.' },
  { year: '622 CE', title: 'The Hijrah', description: 'Migration to Medina and establishment of the first Islamic state.' },
  { year: '630 CE', title: 'Conquest of Mecca', description: 'Peaceful entry into Mecca.' },
  { year: '632 CE', title: 'Farewell Sermon', description: 'The final sermon emphasizing equality and rights.' }
]);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.biography-view {
  max-width: 800px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-xxl;
}

.page-title {
  font-family: 'Amiri', serif;
  font-size: 2.5rem;
  color: $dark-accent;
}

.timeline {
  position: relative;
  padding: $spacing-lg 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%; // Center for LTR/RTL agnostic logic, adjusted below
    width: 2px;
    height: 100%;
    background: rgba($dark-accent, 0.3);
    transform: translateX(-50%);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: $spacing-xl;
  width: 50%;
  
  &:nth-child(odd) {
    left: 0;
    padding-right: $spacing-xl;
    text-align: right;
    
    .timeline-dot { right: -6px; }
  }
  
  &:nth-child(even) {
    left: 50%;
    padding-left: $spacing-xl;
    text-align: left;
    
    .timeline-dot { left: -6px; }
  }
}

.timeline-dot {
  position: absolute;
  top: 0;
  width: 12px;
  height: 12px;
  background: $dark-accent;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba($dark-accent, 0.5);
}

.timeline-content {
  background: rgba($dark-secondary, 0.3);
  padding: $spacing-lg;
  border-radius: $border-radius-md;
  border: 1px solid rgba($dark-accent, 0.1);
  
  .date {
    color: $dark-accent;
    font-weight: bold;
    margin-bottom: $spacing-xs;
  }
  
  .title {
    margin: 0 0 $spacing-sm;
    font-family: 'Amiri', serif;
  }
}

// RTL Adjustments
:root[dir="rtl"] .timeline-item {
  &:nth-child(odd) {
    left: 0; // In RTL, "left" visually becomes right if we don't handle direction carefully. 
             // Ideally we swap sides. 
             // Simplified: keep centered line.
    text-align: left; 
    padding-right: 0; 
    padding-left: $spacing-xl;
    .timeline-dot { left: -6px; right: auto; }
  }
  
  &:nth-child(even) {
    left: auto;
    right: 0;
    text-align: right;
    padding-left: 0;
    padding-right: $spacing-xl;
    .timeline-dot { right: -6px; left: auto; }
  }
}
</style>