<template>
  <div class="companions-view container">
    <header class="section-header">
      <h1 class="page-title">{{ $t('companions.title') }}</h1>
      <p class="page-subtitle">{{ $t('companions.subtitle') }}</p>
    </header>

    <div class="companions-grid">
      <div class="companion-card" v-for="name in ['Abu Bakr', 'Umar', 'Uthman', 'Ali']" :key="name">
        <div class="card-icon">⭐</div>
        <h3>{{ name }}</h3>
        <p>Description placeholder...</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.companions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-lg;
}

.companion-card {
  background: rgba($dark-secondary, 0.3);
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  text-align: center;
  border: 1px solid transparent;
  
  &:hover {
    border-color: $dark-accent;
  }
}
</style>