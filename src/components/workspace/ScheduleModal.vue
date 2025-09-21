<template>
  <BaseModal 
    :show="show" 
    :title="modalTitle"
    :subtitle="modalSubtitle"
    @close="closeModal"
  >
    <form @submit.prevent="addSchedule" class="schedule-form">
      <!-- 에러 메시지 -->
      <BaseMessage v-if="errorMessage" type="error" size="small">
        {{ errorMessage }}
      </BaseMessage>
      
      <div class="form-group">
        <label>목적지</label>
        <input
            type="text"
            v-model="newSchedule.destination"
            placeholder="출장 목적지를 입력하세요"
            required
            class="form-input"
        />
      </div>
      
      <div class="form-group">
        <label>서비스 타입</label>
        <div class="service-type-segmented" role="radiogroup" aria-label="서비스 타입 선택">
          <button type="button" :aria-pressed="newSchedule.serviceType==='FLIGHT'" :class="['service-type-option', { active: newSchedule.serviceType==='FLIGHT'}]" @click="newSchedule.serviceType='FLIGHT'">항공</button>
          <button type="button" :aria-pressed="newSchedule.serviceType==='HOTEL'" :class="['service-type-option', { active: newSchedule.serviceType==='HOTEL'}]" @click="newSchedule.serviceType='HOTEL'">숙박</button>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group half">
          <label>출발 날짜</label>
          <ModernDatePicker
            v-model="newSchedule.departDate"
            placeholder="출발 날짜를 선택하세요"
            required
          />
        </div>
        <div class="form-group half">
          <label>도착 날짜</label>
          <ModernDatePicker
            v-model="newSchedule.arriveDate"
            placeholder="도착 날짜를 선택하세요"
            required
          />
        </div>
      </div>
      
      <div class="form-group">
        <label>출장자 이름</label>
        <input
            type="text"
            v-model="newSchedule.namesText"
            placeholder="출장자 이름을 입력하세요 (쉼표로 구분)"
            required
            class="form-input"
        />
        <small class="form-help">예: 박재훈, 김건우, 김강민</small>
      </div>
    </form>
    
    <template #actions>
      <BaseButton variant="cancel" @click="closeModal">취소</BaseButton>
      <BaseButton variant="confirm" @click="addSchedule">{{ editMode ? '수정' : '등록' }}</BaseButton>
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
    },
    tripType: {
      type: String,
      default: 'mjk',
      validator: (value) => ['mjk', 'company'].includes(value)
    },
    editMode: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      newSchedule: {
        destination: '',
        serviceType: '',
        departDate: '',
        arriveDate: '',
        namesText: ''
      },
      errorMessage: ''
    };
  },
  computed: {
    modalTitle() {
      const baseTitle = this.tripType === 'mjk' ? 'MJK 워크스페이스 출장' : '기업 워크스페이스 출장';
      return this.editMode ? `${baseTitle} 수정` : `${baseTitle} 등록`;
    },
    modalSubtitle() {
      if (this.editMode) {
        return '출장 정보를 수정합니다.';
      }
      return this.tripType === 'mjk' 
        ? '기업 워크스페이스가 없는 사용자가 자체적으로 일정을 추가하는 경우' 
        : '기업 MCP 시스템에 출장 정보를 등록하는 경우';
    }
  },
  watch: {
    editData: {
      handler(newData) {
        if (newData && this.editMode) {
          this.populateFormWithEditData(newData);
        }
      },
      immediate: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    addSchedule() {
      this.errorMessage = '';
      
      // 필수 필드 검증
      if (!this.newSchedule.destination.trim()) {
        this.errorMessage = '목적지를 입력해주세요.';
        return;
      }
      if (!this.newSchedule.serviceType) {
        this.errorMessage = '서비스 타입을 선택해주세요.';
        return;
      }
      if (!this.newSchedule.departDate) {
        this.errorMessage = '출발 날짜를 선택해주세요.';
        return;
      }
      if (!this.newSchedule.arriveDate) {
        this.errorMessage = '도착 날짜를 선택해주세요.';
        return;
      }
      if (!this.newSchedule.namesText.trim()) {
        this.errorMessage = '출장자 이름을 입력해주세요.';
        return;
      }
      
      // 날짜 검증
      if (this.newSchedule.departDate > this.newSchedule.arriveDate) {
        this.errorMessage = '도착 날짜는 출발 날짜보다 늦어야 합니다.';
        return;
      }

      // 출장자 이름 파싱 (쉼표로 구분)
      const names = this.newSchedule.namesText
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      if (names.length === 0) {
        this.errorMessage = '유효한 출장자 이름을 입력해주세요.';
        return;
      }

      // API 요청용 데이터 구성
      const tripData = {
        departDate: this.newSchedule.departDate,
        arriveDate: this.newSchedule.arriveDate,
        destination: this.newSchedule.destination.trim(),
        names: names,
        serviceType: this.newSchedule.serviceType,
        tripType: this.tripType // 추가: 어떤 타입의 출장인지 구분
      };

      this.$emit('add-schedule', tripData);
      this.resetNewSchedule();
    },
    populateFormWithEditData(eventData) {
      this.newSchedule = {
        destination: eventData.destination || '',
        serviceType: eventData.serviceType || '',
        departDate: eventData.startDate || '',
        arriveDate: eventData.endDate || '',
        namesText: eventData.names ? eventData.names.join(', ') : '',
        description: ''
      };
    },
    resetNewSchedule() {
      if (this.editMode && this.editData) {
        // 수정 모드에서는 원래 데이터로 리셋
        this.populateFormWithEditData(this.editData);
      } else {
        // 등록 모드에서는 빈 폼으로 리셋
        this.newSchedule = {
          destination: '',
          serviceType: '',
          departDate: '',
          arriveDate: '',
          namesText: ''
        };
      }
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

.service-type-segmented {
  display: inline-flex;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  width: 100%;
  height: 48px;
}

.service-type-option {
  flex: 1;
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-type-option:not(:last-child) {
  border-right: 1px solid var(--color-border-secondary);
}

.service-type-option.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.form-help {
  display: block;
  margin-left: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
