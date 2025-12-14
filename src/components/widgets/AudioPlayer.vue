<template>
  <div v-if="currentTrack" class="audio-player" :class="{ 'expanded': isExpanded }">
    <!-- Mini Player -->
    <div class="mini-player" @click="toggleExpand" v-show="!isExpanded">
      <div class="track-info">
        <div class="track-icon">🎵</div>
        <div class="track-details">
          <h4 class="track-title">{{ currentTrack.title }}</h4>
          <p class="track-artist">{{ currentTrack.artist }}</p>
        </div>
      </div>
      
      <div class="player-controls-mini">
        <button @click.stop="togglePlay" class="control-button" :aria-label="isPlaying ? $t('audio.pause') : $t('audio.play')">
          <span>{{ isPlaying ? '⏸' : '▶' }}</span>
        </button>
        <button @click.stop="toggleExpand" class="control-button">
          <span>🔼</span>
        </button>
      </div>
    </div>

    <!-- Expanded Player -->
    <div v-if="isExpanded" class="expanded-player">
      <button class="close-btn" @click="toggleExpand">✕</button>
      
      <div class="cover-section">
        <div class="album-cover">
          <div class="cover-icon">🕌</div>
        </div>
      </div>

      <div class="track-info-expanded">
        <h2 class="track-title-large">{{ currentTrack.title }}</h2>
        <p class="track-artist-large">{{ currentTrack.artist }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="time-display">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          :max="duration" 
          v-model="currentTime" 
          @input="seek"
          class="seek-slider"
        />
      </div>

      <!-- Controls -->
      <div class="main-controls">
        <button class="control-btn" @click="prevTrack">⏮</button>
        <button class="control-btn play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="control-btn" @click="nextTrack">⏭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const isExpanded = ref(false);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(180); // Mock duration

const currentTrack = ref({
  title: 'تلاوة عطرة',
  artist: 'الشيخ مشاري العفاسي',
  src: 'mock.mp3'
});

let interval = null;

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    interval = setInterval(() => {
      if (currentTime.value < duration.value) {
        currentTime.value++;
      } else {
        isPlaying.value = false;
        clearInterval(interval);
      }
    }, 1000);
  } else {
    clearInterval(interval);
  }
};

const seek = (e) => {
  currentTime.value = parseInt(e.target.value);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const prevTrack = () => {
  currentTime.value = 0;
};

const nextTrack = () => {
  currentTime.value = 0;
};

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.audio-player {
  position: fixed;
  bottom: $spacing-md;
  right: $spacing-md;
  width: 320px;
  background: rgba($dark-primary, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba($dark-accent, 0.3);
  border-radius: $border-radius-lg;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: $z-modal;
  color: $dark-text;
  transition: all $duration-normal ease;
  overflow: hidden;

  &.expanded {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .theme-light & {
    background: rgba($light-primary, 0.95);
    color: $light-text;
  }
}

.mini-player {
  padding: $spacing-sm $spacing-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.track-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.track-icon {
  width: 40px;
  height: 40px;
  background: rgba($dark-accent, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.track-details {
  h4 { margin: 0; font-size: 0.9rem; }
  p { margin: 0; font-size: 0.75rem; opacity: 0.7; }
}

.player-controls-mini {
  display: flex;
  gap: $spacing-sm;
}

.control-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  &:hover { color: $dark-accent; }
}

/* Expanded Styles */
.expanded-player {
  width: 100%;
  max-width: 500px;
  padding: $spacing-xl;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: inherit;
  cursor: pointer;
}

.album-cover {
  width: 200px;
  height: 200px;
  margin: 0 auto $spacing-xl;
  background: linear-gradient(135deg, $dark-secondary, $dark-primary);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  
  .cover-icon { font-size: 4rem; }
}

.track-info-expanded {
  margin-bottom: $spacing-xl;
  
  .track-title-large { font-size: 1.5rem; margin-bottom: 0.5rem; font-family: 'Amiri', serif; }
  .track-artist-large { opacity: 0.7; }
}

.progress-container {
  margin-bottom: $spacing-xl;
  
  .time-display {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    margin-bottom: 8px;
    opacity: 0.7;
  }
}

.seek-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba($dark-text, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $dark-accent;
    cursor: pointer;
  }
}

.main-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-xl;
}

.control-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover { transform: scale(1.1); color: $dark-accent; }
  
  &.play-btn {
    width: 60px;
    height: 60px;
    background: $dark-accent;
    color: $dark-primary;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    
    &:hover { transform: scale(1.05); }
  }
}
</style>