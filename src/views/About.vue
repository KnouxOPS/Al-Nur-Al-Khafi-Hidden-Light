<template>
  <div class="about-view container">
    <header class="section-header fade-in-up">
      <h1 class="page-title">{{ t('about.title') }}</h1>
      <p class="page-subtitle">{{ t('app.description') }}</p>
    </header>

    <div class="content-wrapper fade-in-up delay-1">
      <div class="content-block">
        <h3>{{ t('about.mission') }}</h3>
        <p>To create a sacred digital sanctuary that honors the blessed life of our Prophet Muhammad ﷺ with utmost dignity, academic rigor, and spiritual reverence.</p>
        <p>نهدف إلى إنشاء ملاذ رقمي مقدس يكرم الحياة المباركة لنبينا محمد ﷺ بمنتهى الوقار والدقة العلمية والروحانية.</p>
      </div>

      <div class="content-block">
        <h3>{{ t('about.vision') }}</h3>
        <p>Bridging hearts with the light of the Prophet ﷺ through modern technology and authentic knowledge.</p>
        <p>مد جسور بين القلوب ونور النبي ﷺ من خلال التكنولوجيا الحديثة والمعرفة الموثقة.</p>
      </div>

      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">📚</div>
          <h4>Authentic Sources</h4>
          <p>Verified from Quran and Sahih Hadith.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">✨</div>
          <h4>Sacred Design</h4>
          <p>Respectful aesthetics and user experience.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🤖</div>
          <h4>AI Powered</h4>
          <p>Intelligent search for spiritual guidance.</p>
        </div>
      </div>
      
      <div class="support-block">
         <h3>{{ t('about.support') }}</h3>
         <p>{{ t('about.donate') }}</p>
         <button class="btn btn-primary">{{ t('common.subscribe') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.about-view {
  padding-bottom: $spacing-xxl;
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-xxl;
}

.page-title {
  font-family: 'Amiri', serif;
  font-size: 2.5rem;
  color: $dark-accent;
  margin-bottom: $spacing-xs;
  
  .theme-light & {
    color: $light-text;
  }
}

.page-subtitle {
  color: $dark-text-secondary;
  font-size: 1.1rem;
  
  .theme-light & {
    color: $light-text-secondary;
  }
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.content-block {
  background: rgba($dark-secondary, 0.3);
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  border: 1px solid rgba($dark-border, 0.5);
  
  .theme-light & {
    background: rgba($light-secondary, 0.3);
    border-color: rgba($light-border, 0.5);
  }

  h3 {
    color: $dark-accent;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: $spacing-md;
    font-family: 'Amiri', serif;
  }

  p {
    line-height: 1.8;
    color: $dark-text;
    margin-bottom: $spacing-sm;
    
    .theme-light & {
      color: $light-text;
    }
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
  margin: $spacing-lg 0;
}

.feature-item {
  text-align: center;
  padding: $spacing-lg;
  background: rgba($dark-primary, 0.5);
  border-radius: $border-radius-lg;
  border: 1px solid rgba($dark-accent, 0.1);
  
  .theme-light & {
    background: rgba($light-primary, 0.5);
    border-color: rgba($light-accent, 0.1);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: $spacing-md;
  }

  h4 {
    color: $dark-text;
    margin-bottom: $spacing-xs;
    .theme-light & { color: $light-text; }
  }

  p {
    font-size: 0.9rem;
    color: $dark-text-secondary;
    .theme-light & { color: $light-text-secondary; }
  }
}

.support-block {
  text-align: center;
  padding: $spacing-xl;
  background: linear-gradient(135deg, rgba($dark-accent, 0.1), transparent);
  border-radius: $border-radius-lg;
  border: 1px solid rgba($dark-accent, 0.2);
  
  h3 {
    color: $dark-accent;
    font-family: 'Amiri', serif;
    margin-bottom: $spacing-md;
  }
  
  p {
    margin-bottom: $spacing-lg;
    color: $dark-text;
    .theme-light & { color: $light-text; }
  }
}

.btn {
  padding: 10px 24px;
  border-radius: $border-radius-pill;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &.btn-primary {
    background: $dark-accent;
    color: $dark-primary;
    
    &:hover {
      background: lighten($dark-accent, 10%);
      transform: translateY(-2px);
    }
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-1 { animation-delay: 0.2s; }

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}
</style>