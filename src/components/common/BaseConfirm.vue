<template>
  <BaseModal 
    :show="show" 
    :title="title" 
    :subtitle="subtitle"
    :close-on-overlay-click="false"
    :show-close-button="false"
    @close="handleCancel"
  >
    <div class="confirm-content">
      <div class="confirm-message">
        <div v-if="iconType" class="confirm-icon">
          <i :class="iconClass"></i>
        </div>
        <p class="confirm-text">{{ message }}</p>
      </div>
    </div>
    
    <template #actions>
      <BaseButton 
        variant="cancel" 
        @click="handleCancel"
        :disabled="isLoading"
      >
        {{ cancelText }}
      </BaseButton>
      <BaseButton 
        :variant="confirmVariant" 
        @click="handleConfirm"
        :loading="isLoading"
      >
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';

export default {
  name: 'BaseConfirm',
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '확인'
    },
    subtitle: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: '확인'
    },
    cancelText: {
      type: String,
      default: '취소'
    },
    confirmVariant: {
      type: String,
      default: 'confirm',
      validator: (value) => ['primary', 'confirm', 'danger'].includes(value)
    },
    iconType: {
      type: String,
      default: 'question',
      validator: (value) => ['question', 'warning', 'danger', 'info', ''].includes(value)
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel', 'close'],
  computed: {
    iconClass() {
      const icons = {
        question: 'pi pi-question-circle',
        warning: 'pi pi-exclamation-triangle',
        danger: 'pi pi-exclamation-triangle',
        info: 'pi pi-info-circle'
      };
      return icons[this.iconType] || '';
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    },
    handleCancel() {
      if (!this.isLoading) {
        this.$emit('cancel');
        this.$emit('close');
      }
    }
  }
}
</script>

<style scoped>
.confirm-content {
  padding: var(--spacing-lg) 0;
}

.confirm-message {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  text-align: left;
}

.confirm-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-bg-tertiary);
}

.confirm-icon i {
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
}

.confirm-icon i.pi-exclamation-triangle {
  color: var(--color-warning);
}

.confirm-text {
  flex: 1;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  line-height: 1.5;
  margin: 0;
  padding-top: var(--spacing-sm);
}

/* 아이콘이 없는 경우 */
.confirm-message:not(:has(.confirm-icon)) {
  justify-content: center;
  text-align: center;
}

.confirm-message:not(:has(.confirm-icon)) .confirm-text {
  text-align: center;
  padding-top: 0;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .confirm-message {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-md);
  }
  
  .confirm-icon {
    width: 40px;
    height: 40px;
  }
  
  .confirm-icon i {
    font-size: var(--font-size-xl);
  }
  
  .confirm-text {
    font-size: var(--font-size-base);
    text-align: center;
    padding-top: 0;
  }
}
</style>
