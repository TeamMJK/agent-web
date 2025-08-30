<template>
  <div class="modern-datepicker-wrapper">
    <div class="datepicker-container" :class="{ focused: isFocused }">
      <div class="date-display" @click="togglePicker" ref="trigger">
        <i class="pi pi-calendar calendar-icon"></i>
        <span v-if="formattedDate" class="date-text">{{ formattedDate }}</span>
        <span v-else class="placeholder-text">{{ placeholder }}</span>
        <i class="pi pi-chevron-down chevron-icon"></i>
      </div>
    </div>

    <!-- Teleport: 모달 내부 스크롤/클리핑을 피하기 위해 body로 이동 -->
    <teleport to="body">
      <div v-if="showPicker">
        <div class="picker-overlay" @click="closePicker"></div>
        <div
          class="datepicker-dropdown floating"
          :class="dropdownPositionClass"
          :style="dropdownInlineStyle"
          @click.stop
          ref="dropdown"
        >
          <!-- 년도 선택 모드 -->
          <div v-if="showYearPicker" class="year-picker">
            <div class="year-picker-header">
              <button type="button" @click="previousYearRange" class="nav-button">
                <i class="pi pi-chevron-left"></i>
              </button>
              <span class="year-range">{{ yearRangeDisplay }}</span>
              <button type="button" @click="nextYearRange" class="nav-button">
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
            <div class="year-grid">
              <button
                v-for="year in yearOptions"
                :key="year"
                type="button"
                :class="['year-cell', { 'selected': year === currentYear, 'current': year === new Date().getFullYear() }]"
                @click="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>
          </div>

          <!-- 일반 달력 모드 -->
          <div v-else>
            <div class="datepicker-header">
              <button type="button" @click="previousMonth" class="nav-button">
                <i class="pi pi-chevron-left"></i>
              </button>
              <button type="button" @click="showYearPicker = true" class="month-year clickable">
                {{ monthYearDisplay }}
              </button>
              <button type="button" @click="nextMonth" class="nav-button">
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
            
            <div class="calendar-grid">
              <div class="weekday-header">
                <span v-for="day in weekdays" :key="day" class="weekday">{{ day }}</span>
              </div>
              
              <div class="dates-grid">
                <button
                  v-for="date in calendarDates"
                  :key="date.key"
                  type="button"
                  :class="[
                    'date-cell',
                    {
                      'other-month': !date.isCurrentMonth,
                      'selected': date.isSelected,
                      'today': date.isToday
                    }
                  ]"
                  @click="selectDate(date)"
                >
                  {{ date.day }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'ModernDatePicker',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '날짜를 선택하세요'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  data() {
    return {
      showPicker: false,
      showYearPicker: false,
      isFocused: false,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      yearRangeStart: Math.floor(new Date().getFullYear() / 12) * 12,
      dropdownPositionClass: '',
  dropdownInlineStyle: {},
      weekdays: ['일', '월', '화', '수', '목', '금', '토'],
      today: new Date()
    };
  },
  computed: {
    formattedDate() {
      if (!this.modelValue) return '';
      const date = new Date(this.modelValue);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    monthYearDisplay() {
      const date = new Date(this.currentYear, this.currentMonth);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long'
      });
    },
    yearRangeDisplay() {
      return `${this.yearRangeStart} - ${this.yearRangeStart + 11}`;
    },
    yearOptions() {
      const years = [];
      for (let i = 0; i < 12; i++) {
        years.push(this.yearRangeStart + i);
      }
      return years;
    },
    calendarDates() {
      const dates = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const selectedDate = this.modelValue ? new Date(this.modelValue) : null;
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = date.getMonth() === this.currentMonth;
        const isSelected = selectedDate && 
          date.getFullYear() === selectedDate.getFullYear() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getDate() === selectedDate.getDate();
        const isToday = 
          date.getFullYear() === this.today.getFullYear() &&
          date.getMonth() === this.today.getMonth() &&
          date.getDate() === this.today.getDate();
        
        dates.push({
          key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
          day: date.getDate(),
          date: date,
          isCurrentMonth,
          isSelected,
          isToday
        });
      }
      
      return dates;
    }
  },
  methods: {
    togglePicker() {
      this.showPicker = !this.showPicker;
      this.isFocused = this.showPicker;
      
      if (this.showPicker) {
        this.$emit('focus');
        if (this.modelValue) {
          const selectedDate = new Date(this.modelValue);
          if (!isNaN(selectedDate.getTime())) {
            this.currentMonth = selectedDate.getMonth();
            this.currentYear = selectedDate.getFullYear();
            this.yearRangeStart = Math.floor(this.currentYear / 12) * 12;
          }
        }
        this.$nextTick(() => {
          this.adjustDropdownPosition();
        });
      } else {
        this.$emit('blur');
        this.showYearPicker = false;
      }
    },
    closePicker() {
      this.showPicker = false;
      this.showYearPicker = false;
      this.isFocused = false;
      this.$emit('blur');
    },
    adjustDropdownPosition() {
      const triggerEl = this.$refs.trigger;
      if (!triggerEl) return;
      const triggerRect = triggerEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // 기본 위치 (아래쪽)
      let top = triggerRect.bottom + window.scrollY + 4; // 약간 간격
      let left = triggerRect.left + window.scrollX;
      const MIN_WIDTH = 320; // 캘린더 내용 최소 너비(패딩 포함 여유)
      const desiredMinWidth = Math.max(triggerRect.width, MIN_WIDTH);

      // 가로 넘침 처리
      if (left + desiredMinWidth > viewportWidth - 8) {
        left = Math.max(8, viewportWidth - desiredMinWidth - 8);
      }

      // width 대신 min-width를 사용해 내용 자연 확장, 강제 스크롤 방지
      this.dropdownInlineStyle = { position: 'fixed', top: top + 'px', left: left + 'px', minWidth: desiredMinWidth + 'px' };

      this.$nextTick(() => {
        const dropdownEl = this.$refs.dropdown;
        if (!dropdownEl) return;
        const ddRect = dropdownEl.getBoundingClientRect();

        // 세로 공간 부족 시 위로 배치
        if (ddRect.bottom > viewportHeight - 8) {
          const newTop = triggerRect.top - ddRect.height - 4;
          if (newTop > 8) {
            this.dropdownPositionClass = 'dropdown-up';
            this.dropdownInlineStyle.top = newTop + 'px';
          }
        } else {
          this.dropdownPositionClass = '';
        }
      });
    },
    selectDate(dateObj) {
      // 시간대 문제 해결을 위해 로컬 날짜로 변환
      const year = dateObj.date.getFullYear();
      const month = String(dateObj.date.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.date.getDate()).padStart(2, '0');
      const isoString = `${year}-${month}-${day}`;
      
      this.$emit('update:modelValue', isoString);
      this.closePicker();
    },
    selectYear(year) {
      this.currentYear = year;
      this.showYearPicker = false;
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    previousYearRange() {
      this.yearRangeStart -= 12;
    },
    nextYearRange() {
      this.yearRangeStart += 12;
    }
  },
  mounted() {
  window.addEventListener('resize', this.adjustDropdownPosition);
  window.addEventListener('scroll', this.adjustDropdownPosition, true); // 캡쳐 스크롤
  },
  beforeUnmount() {
  window.removeEventListener('resize', this.adjustDropdownPosition);
  window.removeEventListener('scroll', this.adjustDropdownPosition, true);
  }
};
</script>

<style scoped>
.modern-datepicker-wrapper {
  position: relative;
  width: 100%;
}

.datepicker-container {
  position: relative;
  width: 100%;
}

.date-display {
  width: 100%;
  padding: var(--spacing-xl);
  background-color: var(--color-bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-family: var(--font-family-primary);
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  outline: none;
}

.datepicker-container.focused .date-display {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.calendar-icon {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.date-text {
  flex: 1;
  color: var(--color-text-primary);
}

.placeholder-text {
  flex: 1;
  color: var(--color-text-placeholder);
}

.chevron-icon {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

/* 드롭다운 (body로 텔레포트, fixed 위치) */
.datepicker-dropdown {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
  z-index: 5001;
  padding: var(--spacing-lg);
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden; /* 가로 스크롤 제거 */
}

.datepicker-dropdown.floating {
  position: fixed;
}

/* 위로 열릴 때 JS에서 top 재계산 (클래스 표식만 사용) */

.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5000;
}

.datepicker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  padding: 0 var(--spacing-sm);
}

.nav-button {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.nav-button:hover {
  background: var(--color-bg-card-hover);
  color: var(--color-text-primary);
  border-color: var(--color-primary-border);
}

.month-year {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}

.month-year.clickable:hover {
  background: var(--color-bg-card-hover);
  color: var(--color-primary);
}

/* 년도 선택기 스타일 */
.year-picker {
  width: 100%;
}

.year-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  padding: 0 var(--spacing-sm);
}

.year-range {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.year-cell {
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-family: var(--font-family-primary);
  padding: var(--spacing-lg);
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.year-cell:hover {
  background: var(--color-bg-card-hover);
}

.year-cell.selected {
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.year-cell.current:not(.selected) {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

/* 기존 overlay z-index 조정 (5000) */

.calendar-grid {
  width: 100%;
  min-width: 280px;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: var(--spacing-sm);
  width: 100%;
}

.weekday {
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  padding: var(--spacing-sm) var(--spacing-xs);
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dates-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  width: 100%;
}

.date-cell {
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-family: var(--font-family-primary);
  padding: var(--spacing-sm);
  min-height: 36px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  aspect-ratio: 1;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .date-display {
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
  }
  
  .datepicker-dropdown {
    left: -10px;
    right: -10px;
    max-height: 350px;
    padding: var(--spacing-md);
  }
  
  .calendar-grid {
    min-width: 260px;
  }
  
  .dates-grid {
    gap: 1px;
  }
  
  .date-cell {
    min-height: 32px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs);
  }
  
  .weekday {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs);
    min-height: 20px;
  }
  
  .year-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .year-cell {
    height: 44px;
    font-size: var(--font-size-xs);
  }
}
</style>
