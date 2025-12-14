<template>
  <div class="hadith-view container">
    <header class="section-header">
      <h1 class="page-title">{{ $t('hadith.title') }}</h1>
      <p class="page-subtitle">{{ $t('hadith.subtitle') }}</p>
    </header>

    <div class="hadith-grid">
      <div v-for="i in 6" :key="i" class="hadith-card">
        <div class="card-body">
          <p class="hadith-text">"المسلم من سلم المسلمون من لسانه ويده"</p>
        </div>
        <div class="card-footer">
          <span class="source">رواه البخاري</span>
          <span class="tag">الأخلاق</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.hadith-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;
}

.hadith-card {
  background: rgba($dark-secondary, 0.2);
  border: 1px solid rgba($dark-accent, 0.1);
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba($dark-accent, 0.3);
  }
}

.hadith-text {
  font-family: 'Amiri', serif;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: $dark-text-secondary;
  border-top: 1px solid rgba($dark-text, 0.1);
  padding-top: $spacing-sm;
}
</style>