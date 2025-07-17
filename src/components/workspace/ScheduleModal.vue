<template>
  <BaseModal 
    :show="show" 
    title="일정 추가"
    @close="closeModal"
  >
    <form @submit.prevent="addSchedule" class="schedule-form">
      <!-- 에러 메시지 -->
      <BaseMessage v-if="errorMessage" type="error" size="small">
        {{ errorMessage }}
      </BaseMessage>
      
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
          <ModernDatePicker
            v-model="newSchedule.startDate"
            placeholder="시작 날짜를 선택하세요"
            required
          />
        </div>
        <div class="form-group half">
          <label>종료 날짜</label>
          <ModernDatePicker
            v-model="newSchedule.endDate"
            placeholder="종료 날짜를 선택하세요"
            required
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
    </form>
    
    <template #actions>
      <BaseButton variant="cancel" @click="closeModal">취소</BaseButton>
      <BaseButton variant="confirm" @click="addSchedule">추가</BaseButton>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from '../common/BaseModal.vue';
import BaseButton from '../common/BaseButton.vue';
import BaseMessage from '../common/BaseMessage.vue';
import ModernDatePicker from '../common/ModernDatePicker.vue';

export default {
  name: 'ScheduleModal',
  components: {
    BaseModal,
    BaseButton,
    BaseMessage,
    ModernDatePicker
  },
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
      errorMessage: ''
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    addSchedule() {
      this.errorMessage = '';
      
      if (!this.newSchedule.title.trim()) {
        this.errorMessage = '일정 제목을 입력해주세요.';
        return;
      }
      if (!this.newSchedule.startDate) {
        this.errorMessage = '시작 날짜를 선택해주세요.';
        return;
      }
      if (!this.newSchedule.endDate) {
        this.errorMessage = '종료 날짜를 선택해주세요.';
        return;
      }
      if (this.newSchedule.startDate > this.newSchedule.endDate) {
        this.errorMessage = '종료 날짜는 시작 날짜보다 늦어야 합니다.';
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
      this.errorMessage = '';
    }
  }
}
</script>

<style scoped>
.schedule-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  display: block;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
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
</style>
