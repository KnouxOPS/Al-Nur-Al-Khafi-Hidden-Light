<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="parallax-sky">
        <div class="clouds">
          <div class="cloud cloud-sm" style="left: 12%;"></div>
          <div class="cloud cloud-m" style="left: 18%;"></div>
          <div class="cloud cloud-m" style="right: 15%;"></div>
          <div class="clouds-delay" style="left: 32%;"></div>
        </div>
      </div>

      <div class="hero-content">
        <figure class="fire">
          <div class="fire-ribbon"></div>
        </figure>

        <header>
          <h1 class="hero-title text-elite">
            <span>{{ t('home.project_name_part1') }}</span> {{ t('home.project_name_part2') }}
          </h1>
        </header>

        <p class="hero-subtitle">{{ t('home.hero_subtitle') }}</p>

        <div class="action-bar">
          <router-link to="/biography" class="btn btn-primary">
            {{ t('home.start_biography') }}
          </router-link>
          <button @click="beginLightJourney" class="btn btn-outline">
            {{ t('home.explore_journey') }}
          </button>
        </div>
      </div>

      <div class="logo-placeholder">
        <svg class="q-logo-paw" viewBox="0 0 100 100">
          <path d="M50,15 L65,35 L85,30 L75,50 L85,70 L65,65 L50,85 L35,65 L15,70 L25,50 L15,30 L35,35 Z" fill="#FFD700"/>
        </svg>
      </div>
    </section>

    <!-- Daily Hadith -->
    <section v-if="dailyHadith.id !== 'empty'" class="daily-hadith-section">
      <div class="container">
        <h2 class="section-title">{{ t('home.daily_hadith') }}</h2>
        <div class="hadith-card">
          <blockquote class="hadith-text">
            "{{ dailyHadith.text }}"
          </blockquote>
          <footer class="hadith-source">
            — {{ dailyHadith.reference }}
          </footer>
          <div class="hadith-actions">
            <button @click="shareHadith(dailyHadith)" class="btn btn-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 6L12 2L8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 2V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ t('common.share') }}
            </button>
            <button @click="bookmarkHadith(dailyHadith)" class="btn btn-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none">
                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ t('common.bookmark') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Content -->
    <section class="featured-section">
      <div class="container">
        <h2 class="section-title">{{ t('home.featured_content') }}</h2>
        <div class="featured-grid">
          <div v-for="item in featuredContent" :key="item.id" class="featured-card">
            <router-link :to="item.path" class="card-link">
              <div class="card-image" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="card-content">
                <span class="card-category">{{ item.category }}</span>
                <h3 class="card-title">{{ item.title }}</h3>
                <p class="card-description">{{ item.description }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Preview -->
    <section class="timeline-section">
      <div class="container">
        <h2 class="section-title">{{ t('home.timeline_preview') }}</h2>
        <div class="timeline-preview">
          <div class="timeline-container">
            <div class="timeline-line"></div>
            <div v-for="(event, index) in timelineEvents" :key="index" 
                 :class="['timeline-event', { 'left': index % 2 === 0, 'right': index % 2 !== 0 }]">
              <div class="event-dot"></div>
              <div class="event-card">
                <h4 class="event-year">{{ event.year }}</h4>
                <h3 class="event-title">{{ event.title }}</h3>
                <p class="event-description">{{ event.description }}</p>
              </div>
            </div>
          </div>
          <router-link to="/timeline" class="btn btn-primary">
            {{ t('home.view_full_timeline') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">{{ t('home.cta_title') }}</h2>
          <p class="cta-text">{{ t('home.cta_text') }}</p>
          <div class="cta-actions">
            <router-link to="/about" class="btn btn-light">
              {{ t('nav.about') }}
            </router-link>
            <router-link to="/contribute" class="btn btn-outline-light">
              {{ t('home.contribute') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMainStore } from '@/store'; // Corrected from useStore to useMainStore

const { t } = useI18n();
const store = useMainStore();

// Mock data - replace with store or API later
const dailyHadith = ref({
  id: 1,
  text: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.',
  reference: 'رواه البخاري ومسلم'
});

const featuredContent = ref([
  {
    id: 1,
    title: t('home.feature_1_title'),
    description: t('home.feature_1_desc'),
    category: t('home.category_battles'),
    path: '/battles/badr',
    image: '/images/badr-battle.jpg'
  },
  {
    id: 2,
    title: t('home.feature_2_title'),
    description: t('home.feature_2_desc'),
    category: t('home.category_sirah'),
    path: '/biography/ethics',
    image: '/images/prophet-ethics.jpg'
  }
]);

const timelineEvents = ref([
  {
    year: '571 م',
    title: t('home.event_birth'),
    description: t('home.event_birth_desc')
  },
  {
    year: '610 م',
    title: t('home.event_revelation'),
    description: t('home.event_revelation_desc')
  },
  {
    year: '622 م',
    title: t('home.event_hijrah'),
    description: t('home.event_hijrah_desc')
  },
  {
    year: '632 م',
    title: t('home.event_death'),
    description: t('home.event_death_desc')
  }
]);

function beginLightJourney() {
  alert(t('home.journey_started'));
}

function shareHadith(hadith) {
  if (navigator.share) {
    navigator.share({
      title: t('home.daily_hadith'),
      text: `${hadith.text} — ${hadith.reference}`,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(`${hadith.text} — ${hadith.reference}`);
    alert(t('common.copied_to_clipboard'));
  }
}

function bookmarkHadith(hadith) {
  console.log("Bookmarked:", hadith);
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.home-view {
  padding-bottom: $spacing-xl;
}

.hero-section {
  position: relative;
  height: 80vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(to bottom, rgba($dark-primary, 0.9), rgba($dark-secondary, 0.7));

  .parallax-sky {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #0f2027, #203a43, #2c5364);
    z-index: -1;
  }

  .cloud {
    position: absolute;
    width: 100px;
    height: 40px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    filter: blur(10px);
  }

  .cloud-sm {
    width: 60px;
    height: 30px;
  }

  .cloud-m {
    width: 100px;
    height: 40px;
  }

  .clouds-delay {
    animation: float 10s infinite ease-in-out;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .fire {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -70%);
    width: 80px;
    height: 80px;
    opacity: 0.7;

    .fire-ribbon {
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, #ff512f, #dd2476);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
  }
}

.hero-content {
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 0 $spacing-md;

  .hero-title {
    font-size: $font-size-xxxl;
    color: $dark-text;
    margin-bottom: $spacing-md;
    line-height: 1.2;
    span {
      color: $dark-accent;
    }
  }

  .hero-subtitle {
    font-size: $font-size-xl;
    color: $dark-text-secondary;
    margin-bottom: $spacing-xl;
    line-height: 1.6;
  }

  .action-bar {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    flex-wrap: wrap;
  }
}

.logo-placeholder {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  opacity: 0.4;
  .q-logo-paw {
    width: 100%;
    height: 100%;
  }
}

.container {
  width: 100%;
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.section-title {
  font-size: $font-size-xxl;
  color: $dark-text;
  margin-bottom: $spacing-xl;
  text-align: center;
}

.hadith-card {
  background-color: $dark-secondary;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  box-shadow: $shadow-md;
  margin: 0 auto;
  max-width: 800px;

  .hadith-text {
    font-size: $font-size-lg;
    color: $dark-text;
    font-style: italic;
    margin-bottom: $spacing-md;
  }

  .hadith-source {
    color: $dark-text-secondary;
    margin-bottom: $spacing-lg;
  }

  .hadith-actions {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
  }
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
}

.featured-card {
  background-color: $dark-secondary;
  border-radius: $border-radius-md;
  overflow: hidden;
  box-shadow: $shadow-md;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .card-image {
    height: 180px;
    background-size: cover;
    background-position: center;
    background-color: #333; // Fallback
  }

  .card-content {
    padding: $spacing-md;

    .card-category {
      font-size: $font-size-sm;
      color: $dark-accent;
    }

    .card-title {
      font-size: $font-size-lg;
      margin: $spacing-xs 0;
    }

    .card-description {
      font-size: $font-size-md;
      color: $dark-text-secondary;
    }
  }
}

.timeline-preview {
  position: relative;
  padding: $spacing-xl 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .timeline-container {
    width: 100%;
    position: relative;
    padding-bottom: $spacing-xl;
  }

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
    margin-bottom: $spacing-xl;
    width: 50%;

    .event-dot {
      position: absolute;
      width: 16px;
      height: 16px;
      background-color: $dark-accent;
      border-radius: 50%;
      top: 0;
    }

    .event-card {
      background-color: $dark-secondary;
      padding: $spacing-md;
      border-radius: $border-radius-md;
      box-shadow: $shadow-sm;
      
      .event-year {
        font-size: $font-size-md;
        color: $dark-accent;
      }

      .event-title {
        font-size: $font-size-lg;
        margin: $spacing-xs 0;
      }

      .event-description {
        font-size: $font-size-sm;
        color: $dark-text-secondary;
      }
    }

    &.left {
      margin-left: 0;
      margin-right: auto;
      padding-right: 30px;
      text-align: right;
      
      .event-dot {
        right: -8px;
      }
      
      // For RTL, left means right side visually if text-align is right? 
      // Simplified for RTL context where left implies left side of the line.
      [dir="rtl"] & {
        text-align: left;
        margin-right: 0;
        margin-left: auto;
        padding-right: 0;
        padding-left: 30px;
        
        .event-dot {
            right: auto;
            left: -8px;
        }
      }
    }

    &.right {
      margin-left: auto;
      margin-right: 0;
      padding-left: 30px;
      text-align: left;
      
      .event-dot {
        left: -8px;
      }

      [dir="rtl"] & {
        text-align: right;
        margin-left: 0;
        margin-right: auto;
        padding-left: 0;
        padding-right: 30px;
        
        .event-dot {
            left: auto;
            right: -8px;
        }
      }
    }
  }
}

.cta-section {
  background: linear-gradient(135deg, $dark-accent, darken($dark-accent, 10%));
  padding: $spacing-xxl 0;
  text-align: center;
  color: $dark-primary;

  .cta-content {
    max-width: 700px;
    margin: 0 auto;

    .cta-title {
      font-size: $font-size-xxl;
      margin-bottom: $spacing-md;
    }

    .cta-text {
      font-size: $font-size-lg;
      margin-bottom: $spacing-xl;
    }

    .cta-actions {
      display: flex;
      justify-content: center;
      gap: $spacing-md;
      flex-wrap: wrap;
    }
  }
}

.btn {
  padding: 10px 24px;
  border-radius: $border-radius-pill;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all $duration-normal;

  &.btn-primary {
    background-color: $dark-accent;
    color: $dark-primary;
    &:hover {
      background-color: lighten($dark-accent, 10%);
    }
  }

  &.btn-outline {
    background-color: transparent;
    border: 2px solid $dark-accent;
    color: $dark-accent;
    &:hover {
      background-color: $dark-accent;
      color: $dark-primary;
    }
  }

  &.btn-light {
    background-color: $light-background;
    color: $dark-primary;
    &:hover {
      background-color: darken($light-background, 10%);
    }
  }

  &.btn-outline-light {
    background-color: transparent;
    border: 2px solid $dark-primary;
    color: $dark-primary;
    &:hover {
      background-color: $dark-primary;
      color: $light-text;
    }
  }

  &.btn-icon {
    background-color: transparent;
    border: 1px solid rgba($dark-text, 0.2);
    color: $dark-text;
    &:hover {
      border-color: $dark-accent;
      color: $dark-accent;
    }
    
    .icon {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
