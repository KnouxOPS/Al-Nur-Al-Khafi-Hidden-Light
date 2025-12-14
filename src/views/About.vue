<template>
  <div class="about-view">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ t('nav.about') }}</h1>
        <p>{{ t('about.subtitle') }}</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="mission-section">
          <h2>{{ t('about.mission_title') }}</h2>
          <p>{{ t('about.mission_desc') }}</p>
        </div>

        <div class="features-section">
          <h2>{{ t('about.features_title') }}</h2>
          <div class="features-grid">
            <div class="feature-card" v-for="feature in features" :key="feature.title">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>

        <div class="message-section">
          <blockquote>
            "{{ t('about.quote') }}"
          </blockquote>
          <cite>- {{ t('about.quote_author') }}</cite>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const features = [
  {
    icon: 'fas fa-book',
    title: t('about.feature_sirah'),
    description: t('about.feature_sirah_desc')
  },
  {
    icon: 'fas fa-comment',
    title: t('about.feature_hadith'),
    description: t('about.feature_hadith_desc')
  },
  {
    icon: 'fas fa-globe',
    title: t('about.feature_multilingual'),
    description: t('about.feature_multilingual_desc')
  },
  {
    icon: 'fas fa-brain',
    title: t('about.feature_ai'),
    description: t('about.feature_ai_desc')
  }
];
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.about-view {
  .hero-section {
    position: relative;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(rgba($dark-primary, 0.8), rgba($dark-secondary, 0.8)), 
                url('/images/about-hero.jpg');
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

    .mission-section,
    .features-section,
    .message-section {
      max-width: 800px;
      margin: 0 auto $spacing-xxl;

      h2 {
        font-size: $font-size-xxl;
        color: $dark-text;
        margin-bottom: $spacing-md;
        text-align: center;
      }

      p {
        font-size: $font-size-lg;
        color: $dark-text-secondary;
        line-height: 1.6;
        text-align: center;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $spacing-lg;
      margin-top: $spacing-xl;

      .feature-card {
        text-align: center;
        padding: $spacing-lg;
        background-color: $dark-secondary;
        border-radius: $border-radius-md;
        box-shadow: $shadow-sm;

        .feature-icon {
          font-size: $font-size-xxxl;
          color: $dark-accent;
          margin-bottom: $spacing-md;
        }

        h3 {
          font-size: $font-size-lg;
          color: $dark-text;
          margin-bottom: $spacing-sm;
        }

        p {
          font-size: $font-size-md;
          color: $dark-text-secondary;
          text-align: center;
        }
      }
    }

    .message-section {
      blockquote {
        font-size: $font-size-xl;
        font-style: italic;
        color: $dark-text;
        text-align: center;
        margin-bottom: $spacing-md;
        position: relative;

        &::before,
        &::after {
          content: '"';
          font-size: $font-size-xxxl;
          color: $dark-accent;
        }
      }

      cite {
        display: block;
        text-align: center;
        color: $dark-text-secondary;
        font-size: $font-size-md;
      }
    }
  }
}
</style>