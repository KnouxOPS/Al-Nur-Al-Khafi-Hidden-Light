<template>
  <div class="battles-view container">
    <header class="section-header">
      <h1 class="page-title">{{ $t('battles.title') }}</h1>
    </header>
    <div class="battle-list">
      <div class="battle-item" v-for="battle in ['Badr', 'Uhud', 'Trench']" :key="battle">
        <div class="battle-info">
          <h2>{{ battle }}</h2>
          <p>Strategic details...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.battle-item {
  background: rgba($dark-secondary, 0.2);
  margin-bottom: $spacing-lg;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
  border-left: 4px solid $dark-accent;
}
</style>