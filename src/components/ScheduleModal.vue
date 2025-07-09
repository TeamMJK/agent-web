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
        color: '#4A90E2'
      },
      availableColors: ['#4A90E2', '#7ED321', '#F5A623', '#D0021B', '#9013FE', '#50E3C2'],
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
        color: '#4A90E2'
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
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #232323;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
}

.modal-header h3 {
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    color: #A0A0A0;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    
}

.close-btn:hover {
    color: #fff;
}

.schedule-form {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-weight: 500;
    color: #fff;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.form-group.half {
    flex: 1;
}

.form-input, .form-textarea {
    width: 100%;
    padding: 12px;
    background: #2D2D2D;
    border: 1px solid #3A3A3A;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #4A90E2;
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.color-picker {
    display: flex;
    gap: 8px;
}

.color-option {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    
}

.color-option.selected {
    border-color: #fff;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

.cancel-btn {
    background: #3A3A3A;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    
}

.cancel-btn:hover {
    background: #4A4A4A;
}

.submit-btn {
    background: #4A90E2;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    
}

.submit-btn:hover {
    background: #357ABD;
}
</style>
