<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop" 
          alt="Starry Night Background" 
          class="bg-image"
        />
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="content-wrapper">
          <header class="animate-fade-up delay-1">
            <h1 class="hero-title">
              <span class="highlight">{{ t('home.project_name_part1') }}</span> 
              <span class="text-white">{{ t('home.project_name_part2') }}</span>
            </h1>
          </header>

          <p class="hero-subtitle animate-fade-up delay-2">
            {{ t('home.hero_subtitle') }}
          </p>

          <div class="action-bar animate-fade-up delay-3">
            <router-link to="/biography" class="btn btn-primary glow-effect">
              <span>{{ t('home.start_biography') }}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
            <button @click="beginLightJourney" class="btn btn-outline glass-effect">
              {{ t('home.explore_journey') }}
            </button>
          </div>
        </div>
      </div>

      <div class="scroll-indicator animate-fade-in delay-4">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <div class="arrows">
          <span></span><span></span><span></span>
        </div>
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
import { useMainStore } from '@/store';

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
  const el = document.querySelector('.timeline-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
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
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: zoomEffect 20s infinite alternate ease-in-out;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba($dark-primary, 0.4),
      rgba($dark-primary, 0.7) 60%,
      $dark-primary
    );
  }
}

@keyframes zoomEffect {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

.hero-content {
  text-align: center;
  z-index: 2;
  width: 100%;
  padding: 0 $spacing-md;
  
  .content-wrapper {
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: $dark-text;
    margin-bottom: $spacing-lg;
    line-height: 1.1;
    font-family: 'Amiri', serif;
    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    
    @media (min-width: $breakpoint-tablet) {
      font-size: 5rem;
    }

    .highlight {
      color: $dark-accent;
      display: inline-block;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 10px;
        left: 0;
        width: 100%;
        height: 10px;
        background-color: rgba($dark-accent, 0.3);
        z-index: -1;
        border-radius: 4px;
      }
    }
    
    .text-white {
      color: #fff;
    }
  }

  .hero-subtitle {
    font-size: $font-size-xl;
    color: rgba($dark-text, 0.9);
    margin-bottom: $spacing-xxl;
    line-height: 1.6;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    font-weight: 300;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }

  .action-bar {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
    flex-wrap: wrap;
  }
}

// Animations
.animate-fade-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.5s; }
.delay-3 { animation-delay: 0.8s; }
.delay-4 { animation-delay: 1.5s; }

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.7;
  
  .mouse {
    width: 26px;
    height: 40px;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 13px;
    position: relative;
    
    .wheel {
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: wheelDrop 1.5s infinite;
    }
  }
  
  .arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -5px;
    
    span {
      display: block;
      width: 10px;
      height: 10px;
      border-bottom: 2px solid rgba(255,255,255,0.5);
      border-right: 2px solid rgba(255,255,255,0.5);
      transform: rotate(45deg);
      margin: -3px;
      animation: arrowScroll 1.5s infinite;
      
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
}

@keyframes wheelDrop {
  0% { top: 8px; opacity: 1; }
  100% { top: 20px; opacity: 0; }
}

@keyframes arrowScroll {
  0% { opacity: 0; transform: rotate(45deg) translate(-5px, -5px); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: rotate(45deg) translate(5px, 5px); }
}

.btn {
  padding: 14px 32px;
  border-radius: $border-radius-pill;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.btn-primary {
    background-color: $dark-accent;
    color: $dark-primary;
    border: none;
    
    &:hover {
      background-color: lighten($dark-accent, 10%);
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba($dark-accent, 0.4);
    }
    
    &.glow-effect {
      box-shadow: 0 0 15px rgba($dark-accent, 0.5);
    }
  }

  &.btn-outline {
    background-color: transparent;
    border: 2px solid rgba(255,255,255,0.3);
    color: #fff;
    
    &:hover {
      background-color: rgba(255,255,255,0.1);
      border-color: #fff;
      transform: translateY(-3px);
    }
    
    &.glass-effect {
      backdrop-filter: blur(5px);
    }
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
  font-family: 'Amiri', serif;
}

.hadith-card {
  background-color: $dark-secondary;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  text-align: center;
  box-shadow: $shadow-md;
  margin: 0 auto;
  max-width: 800px;
  border: 1px solid rgba($dark-accent, 0.1);

  .hadith-text {
    font-size: 1.5rem;
    color: $dark-text;
    margin-bottom: $spacing-md;
    font-family: 'Amiri', serif;
    line-height: 1.8;
  }

  .hadith-source {
    color: $dark-text-secondary;
    margin-bottom: $spacing-lg;
    font-weight: 500;
  }

  .hadith-actions {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
  }
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.featured-card {
  background-color: $dark-secondary;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
  transition: transform 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  }

  .card-link {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-image {
    height: 220px;
    background-size: cover;
    background-position: center;
    background-color: #333; // Fallback
    transition: transform 0.5s ease;
  }
  
  &:hover .card-image {
    transform: scale(1.05);
  }

  .card-content {
    padding: $spacing-lg;
    flex: 1;
    display: flex;
    flex-direction: column;

    .card-category {
      font-size: $font-size-xs;
      color: $dark-accent;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: $spacing-xs;
    }

    .card-title {
      font-size: $font-size-lg;
      margin: $spacing-xs 0;
      color: $dark-text;
      font-weight: 700;
    }

    .card-description {
      font-size: $font-size-md;
      color: $dark-text-secondary;
      line-height: 1.5;
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
    max-width: 900px;
  }

  .timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, $dark-accent, rgba($dark-accent, 0.1));
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
      background-color: $dark-primary;
      border: 3px solid $dark-accent;
      border-radius: 50%;
      top: 20px;
      z-index: 2;
      transition: transform 0.3s ease;
    }
    
    &:hover .event-dot {
      transform: scale(1.3);
      background-color: $dark-accent;
    }

    .event-card {
      background-color: $dark-secondary;
      padding: $spacing-lg;
      border-radius: $border-radius-md;
      box-shadow: $shadow-sm;
      border: 1px solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba($dark-accent, 0.3);
        transform: translateY(-2px);
      }
      
      .event-year {
        font-size: $font-size-md;
        color: $dark-accent;
        font-weight: 700;
      }

      .event-title {
        font-size: $font-size-lg;
        margin: $spacing-xs 0;
        color: $dark-text;
      }

      .event-description {
        font-size: $font-size-sm;
        color: $dark-text-secondary;
      }
    }

    &.left {
      margin-left: 0;
      margin-right: auto;
      padding-right: 40px;
      text-align: right;
      
      .event-dot {
        right: -8px;
      }
      
      [dir="rtl"] & {
        text-align: left;
        margin-right: 0;
        margin-left: auto;
        padding-right: 0;
        padding-left: 40px;
        
        .event-dot {
            right: auto;
            left: -8px;
        }
      }
    }

    &.right {
      margin-left: auto;
      margin-right: 0;
      padding-left: 40px;
      text-align: left;
      
      .event-dot {
        left: -8px;
      }

      [dir="rtl"] & {
        text-align: right;
        margin-left: 0;
        margin-right: auto;
        padding-left: 0;
        padding-right: 40px;
        
        .event-dot {
            left: auto;
            right: -8px;
        }
      }
    }
  }
}

.cta-section {
  background: linear-gradient(135deg, $dark-accent, darken($dark-accent, 20%));
  padding: 100px 0;
  text-align: center;
  color: $dark-primary;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
  }

  .cta-content {
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    z-index: 2;

    .cta-title {
      font-size: 2.5rem;
      margin-bottom: $spacing-md;
      font-weight: 800;
    }

    .cta-text {
      font-size: $font-size-lg;
      margin-bottom: $spacing-xl;
      opacity: 0.9;
    }

    .cta-actions {
      display: flex;
      justify-content: center;
      gap: $spacing-md;
      flex-wrap: wrap;
    }
  }
}

.btn-icon {
  background-color: transparent;
  border: 1px solid rgba($dark-text, 0.2);
  color: $dark-text;
  padding: 8px 16px;
  font-size: $font-size-sm;
  
  &:hover {
    border-color: $dark-accent;
    color: $dark-accent;
  }
  
  .icon {
    width: 18px;
    height: 18px;
  }
}

// Light Theme Adjustments
.theme-light {
  .hero-title {
    color: #fff; // Keep hero text white over image
  }
  
  .hero-subtitle {
    color: rgba(255,255,255,0.9);
  }
  
  .hadith-card {
    background-color: $light-primary;
    border-color: $light-border;
    
    .hadith-text { color: $light-text; }
    .hadith-source { color: $light-text-secondary; }
  }
  
  .featured-card {
    background-color: $light-primary;
    
    .card-title { color: $light-text; }
    .card-description { color: $light-text-secondary; }
  }
  
  .timeline-event .event-card {
    background-color: $light-primary;
    
    .event-title { color: $light-text; }
    .event-description { color: $light-text-secondary; }
  }
}
</style>