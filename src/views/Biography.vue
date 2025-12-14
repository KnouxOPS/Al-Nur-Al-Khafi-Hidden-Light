<template>
  <div class="biography-view">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ t('nav.biography') }}</h1>
        <p>{{ t('biography.subtitle') }}</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="timeline-navigation">
          <button 
            v-for="period in periods" 
            :key="period.key"
            :class="['nav-btn', { active: activePeriod === period.key }]"
            @click="setActivePeriod(period.key)"
          >
            {{ period.label }}
          </button>
        </div>

        <div class="period-content">
          <h2>{{ getCurrentPeriod().title }}</h2>
          <p>{{ getCurrentPeriod().description }}</p>
          
          <div class="events-grid">
            <div 
              v-for="event in getCurrentPeriod().events" 
              :key="event.id"
              class="event-card"
            >
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
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

const activePeriod = ref('birth');

const periods = [
  { key: 'birth', label: t('biography.period_birth') },
  { key: 'youth', label: t('biography.period_youth') },
  { key: 'prophethood', label: t('biography.period_prophethood') },
  { key: 'migration', label: t('biography.period_migration') },
  { key: 'medina', label: t('biography.period_medina') },
  { key: 'death', label: t('biography.period_death') }
];

const biographyData = {
  birth: {
    title: t('biography.birth_title'),
    description: t('biography.birth_description'),
    events: [
      {
        id: 1,
        title: t('biography.event_birth_year'),
        description: t('biography.event_birth_year_desc')
      },
      {
        id: 2,
        title: t('biography.event_father_death'),
        description: t('biography.event_father_death_desc')
      }
    ]
  },
  youth: {
    title: t('biography.youth_title'),
    description: t('biography.youth_description'),
    events: [
      {
        id: 1,
        title: t('biography.event_shepherd'),
        description: t('biography.event_shepherd_desc')
      }
    ]
  },
  prophethood: {
    title: t('biography.prophethood_title'),
    description: t('biography.prophethood_description'),
    events: [
      {
        id: 1,
        title: t('biography.event_first_revelation'),
        description: t('biography.event_first_revelation_desc')
      }
    ]
  },
  migration: {
    title: t('biography.migration_title'),
    description: t('biography.migration_description'),
    events: [
      {
        id: 1,
        title: t('biography.event_hijrah'),
        description: t('biography.event_hijrah_desc')
      }
    ]
  },
  medina: {
    title: t('biography.medina_title'),
    description: t('biography.medina_description'),
    events: [
      {
        id: 1,
        title: t('biography.event_constitution'),
        description: t('biography.event_constitution_desc')
      }
    ]
  },
  death: {
    title: t('biography.death_title'),
    description: t('biography.death_description'),
    events: [
      {
        id: 1,
        title: t('biography.event_farewell'),
        description: t('biography.event_farewell_desc')
      }
    ]
  }
};

function setActivePeriod(period) {
  activePeriod.value = period;
}

function getCurrentPeriod() {
  return biographyData[activePeriod.value] || biographyData.birth;
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.biography-view {
  .hero-section {
    position: relative;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(rgba($dark-primary, 0.8), rgba($dark-secondary, 0.8)), 
                url('/images/biography-hero.jpg');
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

  .content-section {
    padding: $spacing-xxl 0;

    .timeline-navigation {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: $spacing-sm;
      margin-bottom: $spacing-xl;

      .nav-btn {
        padding: $spacing-sm $spacing-md;
        background-color: $dark-secondary;
        border: 1px solid $dark-border;
        border-radius: $border-radius-pill;
        color: $dark-text;
        cursor: pointer;
        transition: all $duration-fast $ease-in-out;

        &.active,
        &:hover {
          background-color: $dark-accent;
          color: $dark-primary;
          border-color: $dark-accent;
        }
      }
    }

    .period-content {
      max-width: 800px;
      margin: 0 auto;

      h2 {
        font-size: $font-size-xxl;
        margin-bottom: $spacing-md;
        color: $dark-text;
      }

      p {
        font-size: $font-size-lg;
        color: $dark-text-secondary;
        line-height: 1.6;
        margin-bottom: $spacing-xl;
      }

      .events-grid {
        display: grid;
        gap: $spacing-lg;

        .event-card {
          background-color: $dark-secondary;
          padding: $spacing-lg;
          border-radius: $border-radius-md;
          box-shadow: $shadow-sm;

          h3 {
            font-size: $font-size-lg;
            color: $dark-text;
            margin-bottom: $spacing-sm;
          }

          p {
            font-size: $font-size-md;
            color: $dark-text-secondary;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>