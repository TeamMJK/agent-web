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
                    top: `${24 + index * 18}px`
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
    margin-bottom: 20px;
    padding: 0 10px;
}

.nav-btn {
    background: #2D2D2D;
    border: none;
    color: #A0A0A0;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-btn:hover {
    background: #3A3A3A;
    color: #fff;
}

.current-month {
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
    text-align: center;
    flex: 1;
}

.calendar-container {
    background: #232323;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 30px;
    width: 100%;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: #2D2D2D;
}

.day-header {
    padding: 16px 8px;
    text-align: center;
    font-weight: 500;
    color: #A0A0A0;
    font-size: 14px;
    min-height: 20px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #2D2D2D;
}

.calendar-date {
    min-height: 120px;
    padding: 8px;
    background: #232323;
    cursor: pointer;
    
    position: relative;
    display: flex;
    flex-direction: column;
}

.calendar-date:hover {
    background: #2D2D2D;
}

.calendar-date.other-month {
    color: #555;
    background: #1A1A1A;
}

.calendar-date.today {
    background: #4A90E2;
    color: white;
}

.calendar-date.selected {
    background: #357ABD;
    color: white;
}

.calendar-date.has-events .date-number {
    font-weight: 500;
}

.date-number {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
    line-height: 1.2;
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
    height: 14px;
    left: 2px;
    right: 2px;
    border-radius: 4px;
    font-size: 10px;
    color: white;
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 1;
    margin: 2px 0;
}

.event-bar.single-day {
    border-radius: 6px;
    left: 4px;
    right: 4px;
}

.event-bar.start-day {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    right: 0;
}

.event-bar.end-day {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    left: 0;
}

.event-bar.middle-day {
    border-radius: 0;
    left: 0;
    right: 0;
}

.event-title-bar {
    padding-left: 4px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 8px;
    line-height: 1;
}

.more-events {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 8px;
    color: #A0A0A0;
    background: rgba(0, 0, 0, 0.7);
    padding: 1px 3px;
    border-radius: 2px;
    z-index: 2;
}
</style>
