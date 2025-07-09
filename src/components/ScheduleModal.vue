<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>일정 추가</h3>
        <button class="close-btn" @click="closeModal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <form @submit.prevent="addSchedule" class="schedule-form">
        <div class="form-group">
          <label>제목</label>
          <input
              type="text"
              v-model="newSchedule.title"
              placeholder="일정 제목을 입력하세요"
              required
              class="form-input"
          />
        </div>
        <div class="form-row">
          <div class="form-group half">
            <label>시작 날짜</label>
            <input
                type="date"
                v-model="newSchedule.startDate"
                required
                class="form-input"
            />
          </div>
          <div class="form-group half">
            <label>종료 날짜</label>
            <input
                type="date"
                v-model="newSchedule.endDate"
                required
                class="form-input"
            />
          </div>
        </div>
        <div class="form-group">
          <label>설명 (선택사항)</label>
          <textarea
              v-model="newSchedule.description"
              placeholder="일정에 대한 설명을 입력하세요"
              class="form-textarea"
              rows="3"
          ></textarea>
        </div>
        <div class="form-group">
          <label>색상</label>
          <div class="color-picker">
            <div
                v-for="color in availableColors"
                :key="color"
                :class="['color-option', { selected: newSchedule.color === color }]"
                :style="{ backgroundColor: color }"
                @click="newSchedule.color = color"
            ></div>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeModal">취소</button>
          <button type="submit" class="submit-btn">추가</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduleModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      newSchedule: {
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        color: '#8b5cf6'
      },
      availableColors: ['#8b5cf6', '#7ED321', '#F5A623', '#D0021B', '#9013FE', '#50E3C2'],
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    addSchedule() {
      if (!this.newSchedule.title.trim()) return;
      if (!this.newSchedule.startDate) return;
      if (!this.newSchedule.endDate) return;
      if (this.newSchedule.startDate > this.newSchedule.endDate) {
        alert('종료 날짜는 시작 날짜보다 늦어야 합니다.');
        return;
      }

      const newEvent = {
        id: Date.now(), // 임시 ID
        ...this.newSchedule
      };

      this.$emit('add-schedule', newEvent);
      this.resetNewSchedule();
    },
    resetNewSchedule() {
      this.newSchedule = {
        title: '',
        startDate: '',
        endDate: '',
        description: '',
        color: '#8b5cf6'
      };
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
    background: var(--color-bg-modal);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--z-modal);
}

.modal-content {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-xl);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xl) var(--spacing-xl) 0 var(--spacing-xl);
}

.modal-header h3 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
}

.close-btn:hover {
    color: var(--color-text-primary);
}

.schedule-form {
    padding: var(--spacing-xl);
}

.form-group {
    margin-bottom: var(--spacing-xl);
}

.form-group label {
    display: block;
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-sm);
}

.form-row {
    display: flex;
    gap: var(--spacing-lg);
}

.form-group.half {
    flex: 1;
}

.form-input, .form-textarea {
    width: 100%;
    padding: var(--spacing-md);
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--color-primary);
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.color-picker {
    display: flex;
    gap: var(--spacing-sm);
}

.color-option {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
}

.color-option.selected {
    border-color: var(--color-text-primary);
}

.form-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    margin-top: var(--spacing-2xl);
}

.cancel-btn {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border: none;
    padding: var(--spacing-md) var(--spacing-2xl);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    cursor: pointer;
}

.cancel-btn:hover {
    background: var(--color-bg-card-hover);
}

.submit-btn {
    background: var(--color-primary);
    color: var(--color-text-primary);
    border: none;
    padding: var(--spacing-md) var(--spacing-2xl);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
}

.submit-btn:hover {
    background: var(--color-primary-hover);
}
</style>
