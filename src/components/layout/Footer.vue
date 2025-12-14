<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <div class="footer-logo">
          <h3>
            <span>{{ t('home.project_name_part1') }}</span> 
            {{ t('home.project_name_part2') }}
          </h3>
          <p>{{ t('home.hero_subtitle') }}</p>
        </div>
        
        <div class="footer-links">
          <div class="link-column">
            <h4>{{ t('nav.biography') }}</h4>
            <router-link to="/biography">{{ t('biography.period_birth') }}</router-link>
            <router-link to="/biography">{{ t('biography.period_prophethood') }}</router-link>
            <router-link to="/biography">{{ t('biography.period_migration') }}</router-link>
          </div>
          
          <div class="link-column">
            <h4>{{ t('nav.about') }}</h4>
            <router-link to="/about">{{ t('about.mission_title') }}</router-link>
            <router-link to="/about">{{ t('about.features_title') }}</router-link>
            <router-link to="/contribute">{{ t('nav.contribute') }}</router-link>
          </div>
          
          <div class="link-column">
            <h4>{{ t('common.follow_us') }}</h4>
            <a href="#" target="_blank">Facebook</a>
            <a href="#" target="_blank">Twitter</a>
            <a href="#" target="_blank">YouTube</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} {{ t('footer.copyright') }}
        </div>
        <div class="footer-actions">
          <button @click="scrollToTop" class="back-to-top">
            {{ t('footer.back_to_top') }}
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const currentYear = computed(() => new Date().getFullYear());

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.footer {
  background-color: $dark-secondary;
  border-top: 1px solid $dark-border;
  padding: $spacing-xl 0 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-md;
}

.footer-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: $spacing-xl;
  padding-bottom: $spacing-xl;
  border-bottom: 1px solid $dark-border;
  
  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.footer-logo {
  h3 {
    font-size: $font-size-xl;
    color: $dark-text;
    margin-bottom: $spacing-sm;
    
    span {
      color: $dark-accent;
    }
  }
  
  p {
    font-size: $font-size-md;
    color: $dark-text-secondary;
    line-height: 1.6;
  }
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $spacing-lg;
  
  .link-column {
    h4 {
      font-size: $font-size-lg;
      color: $dark-text;
      margin-bottom: $spacing-md;
    }
    
    a {
      display: block;
      color: $dark-text-secondary;
      text-decoration: none;
      font-size: $font-size-md;
      margin-bottom: $spacing-sm;
      transition: color $duration-fast $ease-in-out;
      
      &:hover {
        color: $dark-accent;
      }
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md 0;
  
  .copyright {
    color: $dark-text-secondary;
    font-size: $font-size-sm;
  }
  
  .back-to-top {
    background: transparent;
    border: 1px solid $dark-border;
    color: $dark-text-secondary;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-sm;
    cursor: pointer;
    transition: all $duration-fast $ease-in-out;
    
    &:hover {
      background-color: $dark-accent;
      color: $dark-primary;
      border-color: $dark-accent;
    }
  }
}

@media (max-width: $breakpoint-mobile) {
  .footer-bottom {
    flex-direction: column;
    gap: $spacing-md;
    text-align: center;
  }
}
</style>