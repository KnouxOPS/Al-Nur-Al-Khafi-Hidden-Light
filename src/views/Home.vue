<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="bg-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2574&auto=format&fit=crop" 
            alt="Islamic Art Detail" 
            class="bg-image"
          />
        </div>
        <div class="overlay"></div>
        <div class="texture-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="title-wrapper">
          <h1 class="title reveal-text">وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ</h1>
        </div>
        
        <div class="ornament-container fade-in delay-1">
          <div class="ornament-line"></div>
          <div class="ornament-symbol">۞</div>
          <div class="ornament-line"></div>
        </div>
        
        <p class="subtitle fade-in-up delay-2">{{ $t('home.heroSubtitle') || $t('heroSubtitle') }}</p>
        
        <div class="hero-buttons fade-in-up delay-3">
          <router-link to="/biography" class="btn btn-primary">
            <span>{{ $t('home.startJourney') || $t('startJourney') }}</span>
          </router-link>
          <router-link to="/about" class="btn btn-outline">
            <span>{{ $t('home.aboutUs') || $t('aboutUs') }}</span>
          </router-link>
        </div>
      </div>
      
      <div class="scroll-indicator fade-in delay-4">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
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
        <h3>{{ $t('nav.biography') || $t('biography') }}</h3>
        <p>{{ $t('home.biographyDesc') || $t('biographyDesc') }}</p>
      </router-link>
      
      <router-link to="/battles" class="grid-card">
        <div class="card-icon">⚔️</div>
        <h3>{{ $t('nav.battles') || $t('battles') }}</h3>
        <p>{{ $t('home.battlesDesc') || $t('battlesDesc') }}</p>
      </router-link>
      
      <router-link to="/companions" class="grid-card">
        <div class="card-icon">👥</div>
        <h3>{{ $t('nav.companions') || $t('companions') }}</h3>
        <p>{{ $t('home.companionsDesc') || $t('companionsDesc') }}</p>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import DailyHadith from '@/components/widgets/DailyHadith.vue';
import { onMounted } from 'vue';

// Parallax effect on mouse move
onMounted(() => {
  const hero = document.querySelector('.hero');
  const bgImage = document.querySelector('.bg-image');
  
  if (hero && bgImage) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      bgImage.style.transform = `scale(1.1) translate(${x * 10}px, ${y * 10}px)`;
    });
  }
});
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
  height: 95vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  margin-top: -$header-height; // Full screen feel
  padding-top: $header-height;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  .bg-image-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.1);
    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    // Fallback animation if JS fails or for mobile
    @media (hover: none) {
      animation: breathe 20s infinite alternate ease-in-out;
    }
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba($dark-background, 0.4) 0%, rgba($dark-background, 0.85) 90%);
    mix-blend-mode: multiply;
  }
  
  .texture-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    opacity: 0.4;
    pointer-events: none;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1000px;
  padding: 0 $spacing-md;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-wrapper {
  overflow: hidden;
  margin-bottom: $spacing-md;
}

.title {
  font-family: 'Amiri', serif;
  font-size: 4rem;
  line-height: 1.4;
  background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: $dark-accent;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0 10px; // Prevent clipping of calligraphic ends
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 2.5rem;
  }
}

.ornament-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  opacity: 0.8;
  width: 100%;
  max-width: 400px;
}

.ornament-line {
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent, $dark-accent, transparent);
}

.ornament-symbol {
  color: $dark-accent;
  font-size: 1.5rem;
  text-shadow: 0 0 10px rgba($dark-accent, 0.5);
}

.subtitle {
  font-size: 1.25rem;
  color: #e2e8f0;
  margin-bottom: $spacing-xl;
  font-weight: 300;
  letter-spacing: 0.5px;
  max-width: 700px;
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.hero-buttons {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-pill;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }

  &.btn-primary {
    background: linear-gradient(135deg, $dark-accent 0%, darken($dark-accent, 20%) 100%);
    color: $dark-primary;
    box-shadow: 0 4px 20px rgba($dark-accent, 0.4);
    border: 1px solid rgba(255,215,0, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba($dark-accent, 0.6);
    }
  }
  
  &.btn-outline {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    
    &:hover {
      background: rgba(255,255,255,0.15);
      border-color: rgba(255,255,255,0.5);
      transform: translateY(-3px);
    }
  }
}

.scroll-indicator {
  position: absolute;
  bottom: $spacing-xl;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  
  .mouse {
    width: 26px;
    height: 40px;
    border: 2px solid rgba(255,255,255,0.4);
    border-radius: 20px;
    position: relative;
    
    .wheel {
      width: 4px;
      height: 6px;
      background: $dark-accent;
      border-radius: 2px;
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      animation: wheel-scroll 1.5s infinite;
    }
  }
}

// Animations
@keyframes breathe {
  0% { transform: scale(1.1); }
  100% { transform: scale(1.15); }
}

@keyframes wheel-scroll {
  0% { transform: translateX(-50%) translateY(0); opacity: 1; }
  100% { transform: translateX(-50%) translateY(10px); opacity: 0; }
}

.reveal-text {
  animation: revealUp 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards;
  opacity: 0;
  transform: translateY(50px);
}

.fade-in {
  animation: fadeIn 1.2s ease-out forwards;
  opacity: 0;
}

.fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards;
  opacity: 0;
  transform: translateY(30px);
}

.delay-1 { animation-delay: 0.3s; }
.delay-2 { animation-delay: 0.6s; }
.delay-3 { animation-delay: 0.9s; }
.delay-4 { animation-delay: 1.5s; }

@keyframes revealUp {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}

// Other Sections
.grid-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-lg;
  position: relative;
  z-index: 1;
}

.grid-card {
  background: rgba($dark-secondary, 0.3);
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba($dark-accent, 0.1);
  text-decoration: none;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: $dark-accent;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba($dark-accent, 0.3);
    background: rgba($dark-secondary, 0.6);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    
    &::after {
      transform: scaleX(1);
    }
    
    .card-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  .card-icon {
    font-size: 3.5rem;
    margin-bottom: $spacing-lg;
    display: inline-block;
    transition: transform 0.4s ease;
    filter: drop-shadow(0 0 15px rgba($dark-accent, 0.3));
  }
  
  h3 {
    color: $dark-accent;
    margin-bottom: $spacing-xs;
    font-size: 1.4rem;
    font-weight: 700;
  }
  
  p {
    font-size: 1rem;
    color: $dark-text-secondary;
    line-height: 1.6;
  }
}
</style>