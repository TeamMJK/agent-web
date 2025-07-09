<template>
  <div>
    <!-- 캘린더 네비게이션 -->
    <div class="calendar-nav">
      <button class="nav-btn" @click="previousMonth">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h2 class="current-month">{{ currentMonthYear }}</h2>
      <button class="nav-btn" @click="nextMonth">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- 캘린더 그리드 -->
    <div class="calendar-container">
      <div class="calendar-header">
        <div v-for="day in weekDays" :key="day" class="day-header">
          {{ day }}
        </div>
      </div>
      <div class="calendar-grid">
        <div
            v-for="date in calendarDates"
            :key="date.key"
            :class="['calendar-date', {
                'other-month': !date.isCurrentMonth,
                'today': date.isToday,
                'selected': isDateSelected(date.date),
                'has-events': date.events.length > 0
            }]"
            @click="selectDate(date.date)"
        >
          <span class="date-number">{{ date.day }}</span>
          <div v-if="date.events.length > 0" class="events-container">
            <div
                v-for="(event, index) in date.events.slice(0, 3)"
                :key="event.id"
                :class="['event-bar', getEventBarClass(event, date.date)]"
                :style="{
                    backgroundColor: event.color,
                    top: `${28 + index * 20}px`
                }"
            >
              <span v-if="isEventStart(event, date.date)" class="event-title-bar">
                  {{ event.title }}
              </span>
            </div>
            <span v-if="date.events.length > 3" class="more-events">
                +{{ date.events.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarGrid',
  props: {
    events: {
      type: Array,
      required: true
    },
    selectedDate: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      currentDate: new Date(),
      weekDays: ['일', '월', '화', '수', '목', '금', '토'],
    };
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long'
      });
    },
    calendarDates() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      const endDate = new Date(lastDay);

      // 달력 시작일 (이전 달의 마지막 주)
      startDate.setDate(startDate.getDate() - startDate.getDay());
      // 달력 종료일 (다음 달의 첫 주)
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

      const dates = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        const dateStr = this.formatDate(current);
        const dayEvents = this.events.filter(event =>
            this.isDateInRange(dateStr, event.startDate, event.endDate)
        );

        dates.push({
          date: new Date(current),
          day: current.getDate(),
          isCurrentMonth: current.getMonth() === month,
          isToday: this.isToday(current),
          events: dayEvents,
          key: current.toISOString()
        });
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
      this.$emit('change-month', this.currentDate);
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      this.$emit('change-month', this.currentDate);
    },
    selectDate(date) {
      this.$emit('update:selectedDate', date);
    },
    isDateSelected(date) {
      return this.selectedDate && this.formatDate(date) === this.formatDate(this.selectedDate);
    },
    isToday(date) {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    },
    formatDate(date) {
      return date.toISOString().split('T')[0];
    },
    isDateInRange(dateStr, startDate, endDate) {
      return dateStr >= startDate && dateStr <= endDate;
    },
    isEventStart(event, date) {
      return this.formatDate(date) === event.startDate;
    },
    getEventBarClass(event, date) {
      const dateStr = this.formatDate(date);
      const isStart = dateStr === event.startDate;
      const isEnd = dateStr === event.endDate;
      const isSingle = event.startDate === event.endDate;

      if (isSingle) {
        return 'single-day';
      } else if (isStart) {
        return 'start-day';
      } else if (isEnd) {
        return 'end-day';
      } else {
        return 'middle-day';
      }
    }
  }
}
</script>

<style scoped>
.calendar-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 0 8px;
}

.nav-btn {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    min-width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
}

.current-month {
    font-size: 1.75rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    text-align: center;
    flex: 1;
    letter-spacing: -0.01em;
}

.calendar-container {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 30px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.day-header {
    padding: 20px 8px;
    text-align: center;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    letter-spacing: 0.5px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: rgba(255, 255, 255, 0.05);
}

.calendar-date {
    min-height: 120px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid transparent;
}

.calendar-date:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(167, 139, 250, 0.3);
}

.calendar-date.other-month {
    color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.01);
}

.calendar-date.today {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
}

.calendar-date.selected {
    background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);
}

.calendar-date.has-events .date-number {
    font-weight: 600;
}

.date-number {
    display: block;
    font-size: 15px;
    margin-bottom: 6px;
    line-height: 1.2;
    font-weight: 500;
}

.events-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.event-bar {
    position: absolute;
    height: 16px;
    left: 4px;
    right: 4px;
    border-radius: 8px;
    font-size: 11px;
    color: white;
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 1;
    margin: 2px 0;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.event-bar.single-day {
    border-radius: 8px;
    left: 6px;
    right: 6px;
}

.event-bar.start-day {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    right: 2px;
}

.event-bar.end-day {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    left: 2px;
}

.event-bar.middle-day {
    border-radius: 4px;
    left: 2px;
    right: 2px;
}

.event-title-bar {
    padding-left: 6px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 10px;
    line-height: 1;
}

.more-events {
    position: absolute;
    bottom: 4px;
    right: 4px;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    padding: 2px 6px;
    border-radius: 6px;
    z-index: 2;
    font-weight: 600;
}
</style>
