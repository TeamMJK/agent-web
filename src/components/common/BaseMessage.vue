<template>
  <div v-if="$slots.default || message" :class="messageClasses">
    <i :class="iconClass"></i>
    <span class="message-text">
      <slot>{{ message }}</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BaseMessage',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  computed: {
    messageClasses() {
      return [
        'base-message',
        `message-${this.type}`,
        `message-${this.size}`
      ];
    },
    iconClass() {
      const icons = {
        success: 'pi pi-check-circle',
        error: 'pi pi-times-circle',
        warning: 'pi pi-exclamation-triangle',
        info: 'pi pi-info-circle'
      };
      return icons[this.type];
    }
  }
}
</script>

<style scoped>
.base-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  margin: var(--spacing-md) 0;
}

/* 크기 변형 */
.message-small {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.message-medium {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
}

.message-large {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: var(--font-size-lg);
}

/* 타입별 스타일 */
.message-success {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.message-error {
  background-color: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
}

.message-warning {
  background-color: rgba(245, 166, 35, 0.1);
  color: var(--color-warning);
  border: 1px solid rgba(245, 166, 35, 0.3);
}

.message-info {
  background-color: rgba(80, 227, 194, 0.1);
  color: var(--color-info);
  border: 1px solid rgba(80, 227, 194, 0.3);
}

.message-text {
  flex: 1;
  line-height: 1.4;
}

/* 아이콘 스타일 */
.base-message i {
  flex-shrink: 0;
  font-size: 1.1em;
}
</style>
