<template>
  <div class="wisdom-view container">
    <header class="section-header">
      <h1 class="page-title">{{ $t('wisdom.title') }}</h1>
    </header>
    <div class="quotes-list">
      <blockquote class="quote-card" v-for="i in 4" :key="i">
        "Kindness is a mark of faith."
      </blockquote>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.quote-card {
  background: rgba($dark-secondary, 0.2);
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  border-radius: $border-radius-lg;
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  text-align: center;
  position: relative;
  
  &::before {
    content: '"';
    font-size: 4rem;
    color: rgba($dark-accent, 0.2);
    position: absolute;
    top: -10px;
    left: 20px;
  }
}
</style>