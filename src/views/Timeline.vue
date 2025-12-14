<template>
  <div class="timeline-view">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ t('nav.timeline') }}</h1>
        <p>{{ t('timeline.subtitle') }}</p>
      </div>
    </section>

    <section class="timeline-section">
      <div class="container">
        <div class="timeline-container">
          <div class="timeline-line"></div>
          
          <div 
            v-for="(event, index) in timelineEvents" 
            :key="event.id"
            :class="['timeline-event', { 'left': index % 2 === 0, 'right': index % 2 !== 0 }]"
          >
            <div class="event-dot"></div>
            <div class="event-card">
              <div class="event-year">{{ event.year }}</div>
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const timelineEvents = ref([
  {
    id: 1,
    year: '570 م',
    title: t('timeline.event_birth'),
    description: t('timeline.event_birth_desc')
  },
  {
    id: 2,
    year: '610 م',
    title: t('timeline.event_revelation'),
    description: t('timeline.event_revelation_desc')
  },
  {
    id: 3,
    year: '622 م',
    title: t('timeline.event_hijrah'),
    description: t('timeline.event_hijrah_desc')
  },
  {
    id: 4,
    year: '630 م',
    title: t('timeline.event_conquest'),
    description: t('timeline.event_conquest_desc')
  },
  {
    id: 5,
    year: '632 م',
    title: t('timeline.event_death'),
    description: t('timeline.event_death_desc')
  }
]);
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.timeline-view {
  .hero-section {
    position: relative;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(rgba($dark-primary, 0.8), rgba($dark-secondary, 0.8)), 
                url('/images/timeline-hero.jpg');
    background-size: cover;
    background-position: center;
    text-align: center;
    color: white;

    .hero-content h1 {
      font-size: $font-size-xxxl;
      margin-bottom: $spacing-md;
    }

    .hero-content p {
      font-size: $font-size-lg;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .timeline-section {
    padding: $spacing-xxl 0;
    background-color: $dark-primary;

    .timeline-container {
      position: relative;
      max-width: 800px;
      margin: 0 auto;

      .timeline-line {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: $dark-accent;
        transform: translateX(-50%);
      }

      .timeline-event {
        position: relative;
        margin-bottom: $spacing-xxl;
        width: 100%;

        .event-dot {
          position: absolute;
          width: 16px;
          height: 16px;
          background-color: $dark-accent;
          border-radius: 50%;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .event-card {
          background-color: $dark-secondary;
          padding: $spacing-lg;
          border-radius: $border-radius-md;
          box-shadow: $shadow-md;
          max-width: calc(50% - 40px);

          .event-year {
            font-size: $font-size-md;
            color: $dark-accent;
            font-weight: bold;
          }

          .event-title {
            font-size: $font-size-lg;
            color: $dark-text;
            margin: $spacing-xs 0;
          }

          .event-description {
            font-size: $font-size-md;
            color: $dark-text-secondary;
            line-height: 1.5;
          }
        }

        &.left {
          .event-card {
            margin-right: auto;
            margin-left: 60px;
          }
        }

        &.right {
          .event-card {
            margin-left: auto;
            margin-right: 60px;
          }
        }
      }
    }
  }
}
</style>