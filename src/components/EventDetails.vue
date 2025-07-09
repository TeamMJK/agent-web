<template>
  <div v-if="selectedDate" class="selected-date-events">
    <h3 class="events-title">{{ formatSelectedDate }} 일정</h3>
    <div v-if="selectedDateEvents.length === 0" class="no-events">
      등록된 일정이 없습니다.
    </div>
    <div v-else class="events-list">
      <div
          v-for="event in selectedDateEvents"
          :key="event.id"
          class="event-item"
          :style="{ borderLeftColor: event.color }"
      >
        <div class="event-info">
          <h4 class="event-title">{{ event.title }}</h4>
          <p class="event-time">{{ formatDateRange(event.startDate, event.endDate) }}</p>
          <p v-if="event.description" class="event-description">{{ event.description }}</p>
        </div>
        <button class="delete-event-btn" @click="deleteEvent(event.id)">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetails',
  props: {
    selectedDate: {
      type: Date,
      required: true,
    },
    events: {
      type: Array,
      required: true,
    }
  },
  computed: {
    selectedDateEvents() {
      if (!this.selectedDate) return [];
      const selectedDateStr = this.formatDate(this.selectedDate);
      return this.events.filter(event =>
          this.isDateInRange(selectedDateStr, event.startDate, event.endDate)
      );
    },
    formatSelectedDate() {
      if (!this.selectedDate) return '';
      return this.selectedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    }
  },
  methods: {
    deleteEvent(eventId) {
      this.$emit('delete-event', eventId);
    },
    formatDate(date) {
      return date.toISOString().split('T')[0];
    },
    isDateInRange(dateStr, startDate, endDate) {
      return dateStr >= startDate && dateStr <= endDate;
    },
    formatDateRange(startDate, endDate) {
      const start = new Date(startDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const end = new Date(endDate).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (startDate === endDate) {
        return start;
      }
      return `${start} - ${end}`;
    },
  }
}
</script>

<style scoped>
.selected-date-events {
    background: #232323;
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
}

.events-title {
    font-size: 1.2rem;
    font-weight: 500;
    color: #fff;
    margin: 0 0 16px 0;
}

.no-events {
    color: #A0A0A0;
    text-align: center;
    padding: 20px;
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.event-item {
    background: #2D2D2D;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.event-info {
    flex: 1;
}

.event-title {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 4px 0;
}

.event-time {
    font-size: 14px;
    color: #A0A0A0;
    margin: 0 0 8px 0;
}

.event-description {
    font-size: 14px;
    color: #B0B0B0;
    margin: 0;
}

.delete-event-btn {
    background: none;
    border: none;
    color: #A0A0A0;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    
}

.delete-event-btn:hover {
    color: #D0021B;
}
</style>
