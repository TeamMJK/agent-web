<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled || loading"
    @click="handleClick"
    :type="type"
  >
    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
    <i v-else-if="icon" :class="`pi pi-${icon}`"></i>
    <span v-if="$slots.default || text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'ghost', 'cancel', 'confirm'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    }
  },
  emits: ['click'],
  computed: {
    buttonClasses() {
      return [
        'base-btn',
        `btn-${this.variant}`,
        `btn-${this.size}`,
        {
          'btn-loading': this.loading,
          'btn-disabled': this.disabled
        }
      ];
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event);
      }
    }
  }
}
</script>

<style scoped>
.base-btn {
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--font-size-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  box-sizing: border-box;
  transition: all var(--transition-fast);
  outline: none;
  position: relative;
}

/* 크기 변형 */
.btn-small {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.btn-medium {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-base);
}

.btn-large {
  padding: var(--spacing-lg) var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

/* 변형 스타일 */
.btn-primary {
  background: var(--gradient-accent);
  color: var(--color-text-primary);
  border: 1px solid transparent;
}

.btn-primary:hover:not(.btn-disabled):not(.btn-loading) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-secondary);
}

.btn-secondary:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: var(--color-bg-card-hover);
  border-color: var(--color-border-hover);
}

.btn-ghost {
  background: none;
  color: var(--color-text-muted);
  border: 1px solid transparent;
}

.btn-ghost:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
}

.btn-cancel {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-secondary);
}

.btn-cancel:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: var(--color-bg-card-hover);
}

.btn-confirm {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid transparent;
}

.btn-confirm:hover:not(.btn-disabled):not(.btn-loading) {
  background-color: var(--color-primary-hover);
}

/* 상태 스타일 */
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-loading {
  cursor: wait;
  opacity: 0.8;
}

.btn-loading .pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 포커스 스타일 */
.base-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
