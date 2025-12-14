<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-text">
        <p>© {{ new Date().getFullYear() }} النور الخفي - Hidden Light</p>
        <p class="subtitle">{{ $t('footerPrayer') || 'اللهم صل وسلم على نبينا محمد' }}</p>
      </div>
      
      <div class="footer-links">
        <router-link to="/about">عن المشروع</router-link>
        <a href="#" target="_blank">المصادر</a>
        <a href="#" target="_blank">Github</a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.app-footer {
  height: $footer-height;
  background: rgba($dark-secondary, 0.3);
  border-top: 1px solid rgba($dark-accent, 0.1);
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
  
  .theme-light & {
    background: rgba($light-secondary, 0.1);
  }
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 $spacing-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  text-align: center;
  
  @media (min-width: $breakpoint-mobile) {
    flex-direction: row;
    justify-content: space-between;
    text-align: inherit;
  }
}

.subtitle {
  color: $dark-accent;
  font-family: 'Amiri', serif;
  margin-top: 4px;
}

.footer-links {
  display: flex;
  gap: $spacing-md;
  
  a {
    color: $dark-text-secondary;
    &:hover {
      color: $dark-accent;
    }
  }
}
</style>