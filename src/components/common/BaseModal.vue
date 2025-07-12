<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div v-if="showHeader" class="modal-header">
        <div class="header-info">
          <h3 class="modal-title">{{ title }}</h3>
          <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
        </div>
        <button v-if="showCloseButton" class="close-btn" @click="handleClose">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <slot></slot>
      </div>
      
      <div v-if="$slots.actions" class="modal-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showCloseButton: {
      type: Boolean,
      default: true
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  methods: {
    handleOverlayClick() {
      if (this.closeOnOverlayClick) {
        this.handleClose();
      }
    },
    handleClose() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  backdrop-filter: blur(12px);
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-2xl);
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid var(--color-border-secondary);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-3xl);
  border-bottom: 1px solid var(--color-border-secondary);
}

.header-info {
  flex: 1;
  min-width: 0;
}

.modal-title {
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
}

.modal-subtitle {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: 1.4;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-body {
  padding: var(--spacing-3xl);
  max-height: calc(85vh - 120px);
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-3xl);
  border-top: 1px solid var(--color-border-secondary);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-md);
  }
  
  .modal-content {
    max-width: 100%;
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding: var(--spacing-2xl);
  }
  
  .modal-title {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .modal-header,
  .modal-body,
  .modal-actions {
    padding: var(--spacing-xl);
  }
  
  .modal-title {
    font-size: var(--font-size-base);
  }
}
</style>
