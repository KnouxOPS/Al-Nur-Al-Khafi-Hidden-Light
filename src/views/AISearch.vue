<template>
  <div class="ai-search-view container">
    <div class="ai-header">
      <div class="icon-glow" aria-hidden="true">✨</div>
      <h1 class="page-title">{{ $t('ai.title') || 'AI Spiritual Guide' }}</h1>
      <p class="page-subtitle">{{ $t('ai.subtitle') || 'Powered by Gemini • Knowledge from authentic sources' }}</p>
    </div>

    <!-- Chat Interface -->
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer" aria-live="polite" role="log" aria-label="Chat messages">
        <div 
          v-for="(msg, idx) in messages" 
          :key="idx" 
          class="message-row"
          :class="msg.role"
        >
          <div class="message-bubble">
            <div v-if="msg.role === 'assistant'" class="bot-label">
              <span aria-hidden="true">🤖</span> Hidden Light AI
            </div>
            <p class="message-text">{{ msg.content }}</p>
          </div>
        </div>
        
        <div v-if="isLoading" class="message-row assistant">
          <div class="message-bubble loading">
            <div class="dots" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <span class="loading-text">{{ t('common.loading') || 'Consulting knowledge base...' }}</span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <form @submit.prevent="handleSubmit" class="input-form">
          <input
            v-model="query"
            type="text"
            :placeholder="$t('ai.placeholder') || 'Ask about the Prophet\'s patience, his family, or battles...'"
            class="chat-input"
            :disabled="isLoading"
            :aria-label="$t('ai.placeholder') || 'Ask a question'"
          />
          <button 
            type="submit" 
            class="send-btn" 
            :disabled="isLoading || !query.trim()"
            :aria-label="t('common.send') || 'Send message'"
          >
            <span aria-hidden="true">➤</span>
          </button>
        </form>
        <div class="disclaimer">
          <span aria-hidden="true">⚠️</span> AI can make mistakes. Please verify important religious rulings with qualified scholars.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { generateResponse } from '@/services/gemini.js';

const { t } = useI18n();
const query = ref('');
const messages = ref([
  { role: 'assistant', content: 'Peace be upon you. I am your spiritual assistant for the "Hidden Light" project. Ask me anything about the life, character, or teachings of Prophet Muhammad ﷺ.' }
]);
const isLoading = ref(false);
const messagesContainer = ref(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleSubmit = async () => {
  if (!query.value.trim() || isLoading.value) return;

  const userQuery = query.value;
  messages.value.push({ role: 'user', content: userQuery });
  query.value = '';
  isLoading.value = true;
  await scrollToBottom();

  const responseText = await generateResponse(userQuery);

  messages.value.push({ role: 'assistant', content: responseText });
  isLoading.value = false;
  await scrollToBottom();
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.ai-search-view {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - #{$header-height} - #{$footer-height} - 40px);
}

.ai-header {
  text-align: center;
  margin-bottom: $spacing-lg;
  
  .icon-glow {
    font-size: 2rem;
    margin-bottom: $spacing-xs;
    text-shadow: 0 0 15px $dark-accent;
  }
}

.chat-container {
  flex: 1;
  background: rgba($dark-secondary, 0.5);
  border: 1px solid rgba($dark-border, 0.5);
  border-radius: $border-radius-lg;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  
  .theme-light & {
    background: rgba($light-secondary, 0.5);
    border-color: rgba($light-border, 0.5);
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.message-row {
  display: flex;
  
  &.user {
    justify-content: flex-end;
    
    .message-bubble {
      background: $dark-accent;
      color: $dark-primary;
      border-bottom-right-radius: 2px;
    }
  }
  
  &.assistant {
    justify-content: flex-start;
    
    .message-bubble {
      background: rgba(255,255,255,0.1);
      color: $dark-text;
      border-bottom-left-radius: 2px;
      border: 1px solid rgba(255,255,255,0.05);
      
      .theme-light & {
        background: rgba(0,0,0,0.05);
        color: $light-text;
        border-color: rgba(0,0,0,0.05);
      }
    }
  }
}

.message-bubble {
  max-width: 85%;
  padding: $spacing-md;
  border-radius: $border-radius-lg;
  line-height: 1.6;
  position: relative;
}

.bot-label {
  font-size: 0.75rem;
  color: $dark-accent;
  font-weight: bold;
  margin-bottom: $spacing-xs;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chat-input-area {
  padding: $spacing-md;
  background: rgba($dark-primary, 0.8);
  border-top: 1px solid rgba($dark-border, 0.3);
  
  .theme-light & {
    background: rgba($light-primary, 0.8);
    border-top-color: rgba($light-border, 0.3);
  }
}

.input-form {
  display: flex;
  gap: $spacing-sm;
}

.chat-input {
  flex: 1;
  background: rgba($dark-secondary, 0.5);
  border: 1px solid rgba($dark-border, 0.5);
  border-radius: $border-radius-md;
  padding: $spacing-md;
  color: $dark-text;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: $dark-accent;
  }
  
  .theme-light & {
    background: rgba($light-secondary, 0.5);
    color: $light-text;
    border-color: rgba($light-border, 0.5);
  }
}

.send-btn {
  background: $dark-accent;
  color: $dark-primary;
  border: none;
  border-radius: $border-radius-md;
  width: 50px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.disclaimer {
  font-size: 0.75rem;
  color: $dark-text-secondary;
  margin-top: $spacing-xs;
  text-align: center;
}

.loading {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.dots {
  display: flex;
  gap: 4px;
  
  span {
    width: 6px;
    height: 6px;
    background: $dark-accent;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>