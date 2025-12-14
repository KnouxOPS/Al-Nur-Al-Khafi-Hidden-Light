<template>
  <div class="about-view container">
    <header class="section-header">
      <h1 class="page-title">{{ $t('about.title') }}</h1>
    </header>
    <div class="content-block">
      <h3>{{ $t('about.mission') }}</h3>
      <p>To reveal the hidden light of the Prophet ﷺ to the world.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.content-block {
  background: rgba($dark-secondary, 0.2);
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  max-width: 800px;
  margin: 0 auto;
}
</style>