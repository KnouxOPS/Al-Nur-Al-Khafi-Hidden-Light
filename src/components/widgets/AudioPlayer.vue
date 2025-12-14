<template>
  <div v-if="currentTrack" class="audio-player" :class="{ 'expanded': isExpanded }">
    <!-- Mini Player -->
    <div 
      class="mini-player" 
      @click="toggleExpand" 
      v-show="!isExpanded"
      role="button"
      tabindex="0"
      @keydown.enter="toggleExpand"
      @keydown.space.prevent="toggleExpand"
      :aria-label="t('audio.expand') || 'Expand Audio Player'"
    >
      <div class="track-info">
        <div class="track-info-inner">
          <div class="track-cover" :style="{ backgroundImage: `url(${currentTrack.cover || defaultCover})` }" aria-hidden="true"></div>
          <div class="track-details">
            <h4 class="track-title">{{ truncateText(currentTrack.title, 30) }}</h4>
            <p class="track-artist">{{ truncateText(currentTrack.artist, 25) }}</p>
          </div>
        </div>
      </div>
      
      <div class="player-controls-mini">
        <button @click.stop="togglePlay" class="control-button" :aria-label="isPlaying ? t('audio.pause') : t('audio.play')">
          <svg v-if="!isPlaying" class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 5V19M14 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button @click.stop="closePlayer" class="control-button close-button" :aria-label="t('common.close')">
          <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Expanded Player -->
    <div v-if="isExpanded" class="expanded-player" role="dialog" :aria-label="t('audio.player') || 'Audio Player'">
      <!-- Back/Collapse Button -->
      <button class="collapse-btn" @click="toggleExpand" :aria-label="t('common.close')">
        <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Track Cover -->
      <div class="cover-section">
        <div class="album-cover" :style="{ backgroundImage: `url(${currentTrack.cover || defaultCover})` }" aria-hidden="true">
          <div class="cover-overlay">
            <div class="visualizer">
              <div v-for="i in 20" :key="i" class="bar" :style="{
                height: `${getBarHeight(i)}px`,
                animationDelay: `${i * 0.05}s`
              }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Track Info -->
      <div class="track-info-expanded">
        <h2 class="track-title-large">{{ currentTrack.title }}</h2>
        <p class="track-artist-large">{{ currentTrack.artist }}</p>
        <p v-if="currentTrack.album" class="track-album">{{ currentTrack.album }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
        <div 
          class="progress-bar-container" 
          @click="seekToPosition" 
          role="slider" 
          :aria-valuenow="currentTime" 
          :aria-valuemin="0" 
          :aria-valuemax="duration" 
          :aria-label="t('audio.seek') || 'Seek slider'"
          tabindex="0"
          @keydown.left.prevent="seekRelative(-5)"
          @keydown.right.prevent="seekRelative(5)"
        >
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
            <div class="progress-handle" :style="{ left: `${progressPercent}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Player Controls -->
      <div class="player-controls-expanded">
        <button @click="skipBackward" class="control-button" :aria-label="t('audio.previous') || 'Previous Track'">
          <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 19L5 12L11 5M19 5L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button @click="togglePlay" class="play-pause-button" :aria-label="isPlaying ? t('audio.pause') : t('audio.play')">
          <svg v-if="!isPlaying" class="icon large" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="icon large" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 5V19M14 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button @click="skipForward" class="control-button" :aria-label="t('audio.next') || 'Next Track'">
          <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5L11 12L5 19M13 5L19 12L13 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Additional Controls -->
      <div class="additional-controls">
        <button @click="toggleMute" class="control-button small" :aria-label="isMuted ? t('audio.unmute') : t('audio.mute')">
          <svg v-if="!isMuted" class="icon small" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5L6 9H2V15H6L11 19V5ZM15.54 8.46C16.4731 9.39249 17.008 10.509 17.008 11.7C17.008 12.891 16.4731 14.0075 15.54 14.94M14.12 15.81C14.6424 15.2798 15.0455 14.6348 15.2956 13.91C15.5457 13.1852 15.6337 12.41 15.552 11.66" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="icon small" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5L6 9H2V15H6L11 19V5ZM21 9L15 15M15 9L21 15" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="volume-control">
          <input 
            type="range" 
            v-model="volume"
            min="0" 
            max="1" 
            step="0.01"
            @input="setVolume"
            class="volume-slider"
            :aria-label="t('audio.volume')"
          />
        </div>
        
        <button @click="toggleShuffle" class="control-button small" :class="{ 'active': isShuffled }" :aria-label="t('audio.shuffle') || 'Shuffle'">
          <svg class="icon small" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 3H21V8M4 20L21 3M21 16V21H16M15 15L21 21M4 4L9 9" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button @click="toggleLoop" class="control-button small" :class="{ 'active': isLooped }" :aria-label="t('audio.repeat') || 'Repeat'">
          <svg class="icon small" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 2L21 6L17 10M7 22L3 18L7 14M21 6H10C7.23858 6 5 8.23858 5 11V11C5 13.7614 7.23858 16 10 16H13" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
// Assuming useAudio is available or mocking it if not fully implemented in provided files
// import { useAudio } from '../../composables/useAudio'; 
import { truncateText, formatTime } from '../../utils/helpers';

// Mock composable for now since useAudio.js wasn't fully provided in prompt
const useAudio = () => {
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(300);
  const volume = ref(1);
  const audioState = ref({});
  const togglePlay = () => isPlaying.value = !isPlaying.value;
  const stop = () => isPlaying.value = false;
  const seekTo = (t) => currentTime.value = t;
  const setVolumeVal = (v) => volume.value = v;
  return { isPlaying, currentTime, duration, volume, audioState, togglePlay, stop, seekTo, setVolume: setVolumeVal };
};

const { t } = useI18n();
const { 
  isPlaying, 
  currentTime, 
  duration, 
  volume: audioVolume, 
  audioState,
  togglePlay,
  stop,
  seekTo,
  setVolume
} = useAudio();

// State
const isExpanded = ref(false);
const isMuted = ref(false);
const isShuffled = ref(false);
const isLooped = ref(false);
const volume = ref(1);
const defaultCover = ref('/assets/images/default-audio-cover.jpg');

// Mock current track data
const currentTrack = ref({
  id: 1,
  title: 'تلاوة سورة يس',
  artist: 'القارئ أحمد العجمي',
  album: 'القرآن الكريم',
  cover: '', // default
  src: '/assets/audio/surah-yaseen.mp3',
  duration: 360
});

// Computed
const progressPercent = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Methods
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const closePlayer = () => {
  isExpanded.value = false;
  stop();
};

const skipBackward = () => {
  console.log('Skip backward');
};

const skipForward = () => {
  console.log('Skip forward');
};

const seekToPosition = (event) => {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  const time = percent * duration.value;
  seekTo(time);
};

const seekRelative = (seconds) => {
  let newTime = currentTime.value + seconds;
  if (newTime < 0) newTime = 0;
  if (newTime > duration.value) newTime = duration.value;
  seekTo(newTime);
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  // Implement actual mute logic
};

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value;
};

const toggleLoop = () => {
  isLooped.value = !isLooped.value;
};

const getBarHeight = (index) => {
  if (isPlaying.value) {
    return Math.random() * 30 + 10;
  }
  return 15;
};

// Set initial volume
onMounted(() => {
  volume.value = parseFloat(localStorage.getItem('audioVolume') || '1');
  setVolume(volume.value);
});

// Cleanup
onUnmounted(() => {
  stop();
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: $z-fixed;
  transition: all $duration-normal $ease-in-out;
  
  &.expanded {
    bottom: 0;
    height: 100%; // Full screen on mobile usually
    top: 0;
    background-color: $dark-primary;
    
    @media (min-width: $breakpoint-tablet) {
      height: auto;
      top: auto;
      border-top: 1px solid $dark-border;
    }
  }
}

.mini-player {
  background-color: $dark-primary;
  border-top: 1px solid $dark-border;
  padding: $spacing-sm $spacing-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all $duration-fast $ease-in-out;
  
  &:hover, &:focus-visible {
    background-color: lighten($dark-primary, 5%);
    outline: none;
  }
  
  &:focus-visible {
    box-shadow: inset 0 0 0 2px $dark-accent;
  }
}

.track-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex: 1;
  min-width: 0;
}

.track-info-inner {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  overflow: hidden;
}

.track-cover {
  width: 40px;
  height: 40px;
  border-radius: $border-radius-sm;
  background-size: cover;
  background-position: center;
  background-color: $dark-secondary;
  flex-shrink: 0;
}

.track-details {
  min-width: 0;
  flex: 1;
  
  .track-title {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $dark-text;
    margin: 0 0 $spacing-xs 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .track-artist {
    font-size: $font-size-xs;
    color: $dark-text-secondary;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.player-controls-mini {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.control-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid $dark-border;
  border-radius: 50%;
  color: $dark-text;
  cursor: pointer;
  transition: all $duration-fast $ease-in-out;
  
  &:hover {
    background-color: rgba($dark-accent, 0.1);
    border-color: $dark-accent;
    color: $dark-accent;
  }
  
  &:focus-visible {
    outline: 2px solid $dark-accent;
    outline-offset: 2px;
  }
  
  &.small {
    width: 28px;
    height: 28px;
  }
  
  &.active {
    background-color: rgba($dark-accent, 0.2);
    border-color: $dark-accent;
    color: $dark-accent;
  }
}

.icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  
  &.small {
    width: 14px;
    height: 14px;
  }
  
  &.large {
    width: 24px;
    height: 24px;
  }
}

.close-button {
  &:hover {
    background-color: rgba(#ff4757, 0.1);
    border-color: #ff4757;
    color: #ff4757;
  }
}

.expanded-player {
  background-color: $dark-primary;
  padding: $spacing-lg $spacing-md;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  @media (min-width: $breakpoint-tablet) {
    height: auto;
    border-top: 1px solid $dark-border;
  }
}

.collapse-btn {
  position: absolute;
  top: $spacing-md;
  left: $spacing-md; // LTR
  background: none;
  border: none;
  color: $dark-text-secondary;
  cursor: pointer;
  
  [dir="rtl"] & {
    left: auto;
    right: $spacing-md;
  }
  
  &:hover {
    color: $dark-accent;
  }
}

.cover-section {
  display: flex;
  justify-content: center;
  margin-bottom: $spacing-lg;
  margin-top: $spacing-xl;
}

.album-cover {
  width: 200px;
  height: 200px;
  border-radius: $border-radius-lg;
  background-size: cover;
  background-position: center;
  background-color: $dark-secondary;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  
  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: $spacing-md;
  }
}

.visualizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  height: 60px;
  width: 100%;
  
  .bar {
    width: 4px;
    background: linear-gradient(to top, $dark-accent, lighten($dark-accent, 20%));
    border-radius: $border-radius-sm;
    animation: pulse 0.5s ease-in-out infinite alternate;
  }
}

@keyframes pulse {
  0% { opacity: 0.4; }
  100% { opacity: 1; }
}

.track-info-expanded {
  text-align: center;
  margin-bottom: $spacing-lg;
  
  .track-title-large {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $dark-text;
    margin: 0 0 $spacing-xs 0;
  }
  
  .track-artist-large {
    font-size: $font-size-md;
    color: $dark-accent;
    margin: 0 0 $spacing-xs 0;
  }
  
  .track-album {
    font-size: $font-size-sm;
    color: $dark-text-secondary;
    margin: 0;
  }
}

.progress-section {
  margin-bottom: $spacing-lg;
}

.time-display {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
  
  .current-time,
  .total-time {
    font-size: $font-size-sm;
    color: $dark-text-secondary;
  }
}

.progress-bar-container {
  cursor: pointer;
  padding: $spacing-sm 0;
  outline: none;
  
  &:focus-visible .progress-handle {
    transform: translate(-50%, -50%) scale(1.5);
    box-shadow: 0 0 0 4px rgba($dark-accent, 0.3);
  }
}

.progress-bar {
  height: 4px;
  background-color: $dark-border;
  border-radius: $border-radius-sm;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: $dark-accent;
  border-radius: $border-radius-sm;
  transition: width $duration-fast $ease-in-out;
}

.progress-handle {
  width: 12px;
  height: 12px;
  background-color: $dark-accent;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left $duration-fast $ease-in-out, transform 0.2s;
}

.player-controls-expanded {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xl;
  margin-bottom: $spacing-lg;
}

.play-pause-button {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $dark-accent;
  border: none;
  border-radius: 50%;
  color: $dark-primary;
  cursor: pointer;
  transition: all $duration-fast $ease-in-out;
  
  &:hover {
    background-color: lighten($dark-accent, 10%);
    transform: scale(1.05);
  }
  
  &:focus-visible {
    outline: 2px solid $dark-text;
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.additional-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-lg;
}

.volume-control {
  width: 100px;
  
  .volume-slider {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: $dark-border;
    border-radius: $border-radius-sm;
    outline: none;
    
    &:focus-visible {
      box-shadow: 0 0 0 2px $dark-accent;
    }
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: $dark-accent;
      border-radius: 50%;
      cursor: pointer;
    }
    
    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: $dark-accent;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
  }
}

// Light theme overrides
.theme-light .mini-player {
  background-color: $light-primary;
  border-top-color: $light-border;
  
  &:hover {
    background-color: darken($light-primary, 5%);
  }
  
  .track-title {
    color: $light-text;
  }
  
  .track-artist {
    color: $light-text-secondary;
  }
  
  .control-button {
    border-color: $light-border;
    color: $light-text;
    
    &:hover {
      background-color: rgba($light-accent, 0.1);
      border-color: $light-accent;
      color: $light-accent;
    }
  }
}

.theme-light .expanded-player {
  background-color: $light-primary;
  border-top-color: $light-border;
}

.theme-light .album-cover {
  background-color: $light-secondary;
}

.theme-light .progress-bar {
  background-color: $light-border;
}

.theme-light .progress-fill {
  background-color: $light-accent;
}

.theme-light .progress-handle {
  background-color: $light-accent;
}

.theme-light .track-title-large {
  color: $light-text;
}

.theme-light .track-artist-large {
  color: $light-accent;
}

.theme-light .track-album {
  color: $light-text-secondary;
}

.theme-light .time-display {
  .current-time,
  .total-time {
    color: $light-text-secondary;
  }
}

.theme-light .play-pause-button {
  background-color: $light-accent;
  color: $light-primary;
  
  &:hover {
    background-color: darken($light-accent, 10%);
  }
}

.theme-light .volume-slider {
  background: $light-border;
  
  &::-webkit-slider-thumb {
    background: $light-accent;
  }
  
  &::-moz-range-thumb {
    background: $light-accent;
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-mobile) {
  .album-cover {
    width: 150px;
    height: 150px;
  }
  
  .player-controls-expanded {
    gap: $spacing-lg;
  }
  
  .play-pause-button {
    width: 50px;
    height: 50px;
  }
  
  .track-title-large {
    font-size: $font-size-lg;
  }
  
  .track-artist-large {
    font-size: $font-size-md;
  }
}
</style>