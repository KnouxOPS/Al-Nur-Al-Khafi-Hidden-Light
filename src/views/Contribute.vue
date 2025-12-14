<template>
  <div class="contribute-view">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ t('nav.contribute') }}</h1>
        <p>{{ t('contribute.subtitle') }}</p>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="ways-to-contribute">
          <h2>{{ t('contribute.ways_title') }}</h2>
          <div class="contribution-options">
            <div class="option-card" v-for="option in contributionOptions" :key="option.title">
              <div class="option-icon">
                <i :class="option.icon"></i>
              </div>
              <h3>{{ option.title }}</h3>
              <p>{{ option.description }}</p>
              <button class="btn btn-primary">{{ option.button }}</button>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <h2>{{ t('contribute.contact_title') }}</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">{{ t('contribute.name') }}</label>
              <input type="text" id="name" v-model="form.name" required>
            </div>
            <div class="form-group">
              <label for="email">{{ t('contribute.email') }}</label>
              <input type="email" id="email" v-model="form.email" required>
            </div>
            <div class="form-group">
              <label for="message">{{ t('contribute.message') }}</label>
              <textarea id="message" v-model="form.message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">{{ t('contribute.send') }}</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const form = ref({
  name: '',
  email: '',
  message: ''
});

const contributionOptions = [
  {
    icon: 'fas fa-code',
    title: t('contribute.option_development'),
    description: t('contribute.option_development_desc'),
    button: t('contribute.learn_more')
  },
  {
    icon: 'fas fa-paint-brush',
    title: t('contribute.option_design'),
    description: t('contribute.option_design_desc'),
    button: t('contribute.learn_more')
  },
  {
    icon: 'fas fa-book',
    title: t('contribute.option_content'),
    description: t('contribute.option_content_desc'),
    button: t('contribute.learn_more')
  },
  {
    icon: 'fas fa-donate',
    title: t('contribute.option_donation'),
    description: t('contribute.option_donation_desc'),
    button: t('contribute.donate')
  }
];

function submitForm() {
  alert(t('contribute.form_submitted'));
  form.value = { name: '', email: '', message: '' };
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.contribute-view {
  .hero-section {
    position: relative;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(rgba($dark-primary, 0.8), rgba($dark-secondary, 0.8)), 
                url('/images/contribute-hero.jpg');
    background-size: cover;
    background-position: center;
    text-align: center;
    color: white;

    .hero-content h1 {
      font-size: $font-size-xxxl;
      margin-bottom: $spacing-md;
    }

    .hero-content p {
      font-size: $font-size-lg;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .content-section {
    padding: $spacing-xxl 0;

    .ways-to-contribute {
      margin-bottom: $spacing-xxl;

      h2 {
        font-size: $font-size-xxl;
        color: $dark-text;
        text-align: center;
        margin-bottom: $spacing-xl;
      }

      .contribution-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: $spacing-lg;

        .option-card {
          background-color: $dark-secondary;
          padding: $spacing-lg;
          border-radius: $border-radius-md;
          text-align: center;
          box-shadow: $shadow-sm;
          border: 1px solid rgba($dark-border, 0.5);

          .option-icon {
            font-size: $font-size-xxxl;
            color: $dark-accent;
            margin-bottom: $spacing-md;
          }

          h3 {
            font-size: $font-size-lg;
            color: $dark-text;
            margin-bottom: $spacing-sm;
          }

          p {
            font-size: $font-size-md;
            color: $dark-text-secondary;
            margin-bottom: $spacing-md;
          }

          .btn {
            width: 100%;
          }
        }
      }
    }

    .contact-form {
      max-width: 600px;
      margin: 0 auto;

      h2 {
        font-size: $font-size-xxl;
        color: $dark-text;
        text-align: center;
        margin-bottom: $spacing-xl;
      }

      form {
        .form-group {
          margin-bottom: $spacing-lg;

          label {
            display: block;
            font-size: $font-size-md;
            color: $dark-text;
            margin-bottom: $spacing-sm;
          }

          input,
          textarea {
            width: 100%;
            padding: $spacing-md;
            background-color: $dark-secondary;
            border: 1px solid $dark-border;
            border-radius: $border-radius-md;
            color: $dark-text;
            font-size: $font-size-md;

            &:focus {
              border-color: $dark-accent;
              outline: none;
            }
          }

          textarea {
            resize: vertical;
            min-height: 120px;
          }
        }

        .btn {
          width: 100%;
          padding: 12px;
          background-color: $dark-accent;
          color: $dark-primary;
          border: none;
          border-radius: $border-radius-pill;
          font-weight: bold;
          cursor: pointer;
          
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  }
}
</style>