<template>
  <div class="form-group" :class="{ 'form-group-inline': inline }">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    
    <div class="input-container" :class="{ 'has-error': hasError }">
      <slot></slot>
      
      <div v-if="errorMessage" class="error-text">
        <i class="pi pi-exclamation-circle"></i>
        {{ errorMessage }}
      </div>
      
      <div v-if="helpText && !errorMessage" class="help-text">
        {{ helpText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormGroup',
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    helpText: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    inputId: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasError() {
      return !!this.errorMessage;
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--spacing-xl);
}

.form-group-inline {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.form-group-inline .form-label {
  margin-bottom: 0;
  flex-shrink: 0;
  min-width: 120px;
}

.form-label {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
}

.required-indicator {
  color: var(--color-error);
  margin-left: 2px;
}

.input-container {
  width: 100%;
}

.input-container.has-error :deep(.input),
.input-container.has-error :deep(.form-input),
.input-container.has-error :deep(.date-display) {
  border-color: var(--color-error);
}

.error-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  color: var(--color-error);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.help-text {
  margin-top: var(--spacing-xs);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  line-height: 1.4;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .form-group-inline {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .form-group-inline .form-label {
    min-width: auto;
    width: 100%;
  }
}
</style>
