<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1542640244-7e672d6bd4e8?q=80&w=2667&auto=format&fit=crop" 
          alt="Islamic Architecture" 
          class="bg-image"
        />
        <div class="overlay"></div>
      </div>

      <div class="hero-content">
        <div class="title-container fade-in-slow">
          <h1 class="title">وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ</h1>
          <div class="ornament"></div>
        </div>
        
        <p class="subtitle fade-in-up delay-1">{{ $t('heroSubtitle') }}</p>
        
        <div class="hero-buttons fade-in-up delay-2">
          <router-link to="/biography" class="btn btn-primary">
            {{ $t('startJourney') }}
          </router-link>
          <router-link to="/about" class="btn btn-outline">
            {{ $t('aboutUs') }}
          </router-link>
        </div>
      </div>
      
      <div class="scroll-indicator fade-in delay-3">
        <span></span>
      </div>
    </section>

    <!-- Daily Hadith Section -->
    <section class="daily-section container fade-in-up delay-3">
      <DailyHadith />
    </section>

    <!-- Quick Access Grid -->
    <section class="grid-section container fade-in-up delay-4">
      <router-link to="/biography" class="grid-card">
        <div class="card-icon">📖</div>
        <h3>{{ $t('biography') }}</h3>
        <p>{{ $t('biographyDesc') }}</p>
      </router-link>
      
      <router-link to="/battles" class="grid-card">
        <div class="card-icon">⚔️</div>
        <h3>{{ $t('battles') }}</h3>
        <p>{{ $t('battlesDesc') }}</p>
      </router-link>
      
      <router-link to="/companions" class="grid-card">
        <div class="card-icon">👥</div>
        <h3>{{ $t('companions') }}</h3>
        <p>{{ $t('companionsDesc') }}</p>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import DailyHadith from '@/components/widgets/DailyHadith.vue';
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.home-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-xxl;
  padding-bottom: $spacing-xxl;
}

.hero {
  height: 90vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  margin-top: -$spacing-lg; // Offset main padding
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: slowZoom 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba($dark-background, 0.6) 0%, rgba($dark-background, 0.9) 100%);
    
    .theme-light & {
      background: radial-gradient(circle at center, rgba($light-background, 0.4) 0%, rgba($light-background, 0.8) 100%);
    }
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  padding: 0 $spacing-md;
}

.title-container {
  margin-bottom: $spacing-lg;
  position: relative;
}

.title {
  font-family: 'Amiri', serif;
  font-size: 3.5rem;
  line-height: 1.6;
  // Use a gold gradient
  background: linear-gradient(to bottom, #FFD700, #DAA520);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // Fallback color
  color: $dark-accent;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin: 0;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 2.2rem;
  }
}

.ornament {
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, $dark-accent, transparent);
  margin: $spacing-md auto;
  opacity: 0.8;
}

.subtitle {
  font-size: $font-size-xl;
  color: #e2e8f0; // Hardcoded readable light gray for dark overlay
  margin-bottom: $spacing-xl;
  font-weight: 300;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  
  .theme-light & {
    color: $light-text;
    text-shadow: 0 1px 2px rgba(255,255,255,0.8);
    font-weight: 500;
  }
}

.hero-buttons {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
}

.btn {
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-pill;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  backdrop-filter: blur(4px);
  
  &.btn-primary {
    background: linear-gradient(135deg, $dark-accent, darken($dark-accent, 15%));
    color: $dark-primary;
    box-shadow: 0 4px 15px rgba($dark-accent, 0.3);
    border: 1px solid rgba(255,255,255,0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($dark-accent, 0.5);
    }
  }
  
  &.btn-outline {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    
    .theme-light & {
      border-color: $light-accent;
      color: $light-text;
      background: rgba(255,255,255,0.6);
    }
    
    &:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }
  }
}

.scroll-indicator {
  position: absolute;
  bottom: $spacing-xl;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  
  span {
    display: block;
    width: 24px;
    height: 40px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 12px;
    position: relative;
    
    .theme-light & {
      border-color: rgba(0,0,0,0.4);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: $dark-accent;
      border-radius: 50%;
      animation: scroll 2s infinite;
    }
  }
}

// Animations
@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@keyframes scroll {
  0% { transform: translate(-50%, 0); opacity: 1; }
  100% { transform: translate(-50%, 15px); opacity: 0; }
}

.fade-in-slow {
  animation: fadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}

.fade-in {
  animation: fadeIn 1s ease-out forwards;
  opacity: 0;
}

.delay-1 { animation-delay: 0.3s; }
.delay-2 { animation-delay: 0.6s; }
.delay-3 { animation-delay: 0.9s; }
.delay-4 { animation-delay: 1.2s; }

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
  position: relative;
  z-index: 1;
}

.grid-card {
  background: rgba($dark-secondary, 0.3);
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba($dark-accent, 0.1);
  text-decoration: none;
  backdrop-filter: blur(10px);
  
  .theme-light & {
    background: rgba($light-secondary, 0.5);
    border-color: rgba($light-accent, 0.2);
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: $dark-accent;
    background: rgba($dark-secondary, 0.5);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
  
  .card-icon {
    font-size: 3rem;
    margin-bottom: $spacing-md;
    filter: drop-shadow(0 0 10px rgba($dark-accent, 0.2));
  }
  
  h3 {
    color: $dark-accent;
    margin-bottom: $spacing-xs;
    font-size: $font-size-lg;
  }
  
  p {
    font-size: $font-size-sm;
    color: $dark-text-secondary;
    
    .theme-light & {
      color: $light-text-secondary;
    }
  }
}
</style>