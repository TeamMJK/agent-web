<template>
  <div v-if="selectedDate" class="selected-date-events">
    <div class="events-header">
      <h3 class="events-title">{{ formatSelectedDate }}</h3>
      <div class="events-count">{{ selectedDateEvents.length }}개 일정</div>
    </div>
    
    <div v-if="selectedDateEvents.length === 0" class="no-events">
      <div class="no-events-icon">
        <i class="pi pi-calendar-plus"></i>
      </div>
      <p>등록된 일정이 없습니다</p>
      <span>새로운 일정을 추가해보세요</span>
    </div>
    
    <div v-else class="events-list">
      <div
          v-for="event in selectedDateEvents"
          :key="event.id"
          class="event-item"
      >
        <div class="event-color-indicator" :style="{ backgroundColor: event.color }"></div>
        <div class="event-info">
          <h4 class="event-title">{{ event.title }}</h4>
          <p class="event-time">{{ formatDateRange(event.startDate, event.endDate) }}</p>
          <p v-if="event.description" class="event-description">{{ event.description }}</p>
        </div>
        <div class="event-actions">
          <button class="edit-event-btn" @click="editEvent(event)">
            <i class="pi pi-pencil"></i>
          </button>
          <button class="delete-event-btn" @click="deleteEvent(event.id)">
            <i class="pi pi-trash"></i>
          </button>
        </div>
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
    editEvent(event) {
      this.$emit('edit-event', event);
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
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.events-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.events-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    letter-spacing: -0.01em;
}

.events-count {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.no-events {
    text-align: center;
    padding: 40px 20px;
    color: rgba(255, 255, 255, 0.6);
}

.no-events-icon {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 16px;
}

.no-events p {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0 0 8px 0;
    color: rgba(255, 255, 255, 0.8);
}

.no-events span {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
}

.events-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.event-item {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    position: relative;
    overflow: hidden;
}

.event-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.event-item:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.event-color-indicator {
    width: 4px;
    min-height: 100%;
    border-radius: 2px;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.event-info {
    flex: 1;
    min-width: 0;
}

.event-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 6px 0;
    letter-spacing: -0.01em;
}

.event-time {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 8px 0;
    font-weight: 500;
}

.event-description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    line-height: 1.4;
    white-space: pre-line;
}

.delete-event-btn {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: rgba(239, 68, 68, 0.8);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    backdrop-filter: blur(4px);
    flex-shrink: 0;
}

.delete-event-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.4);
    transform: scale(1.05);
}

.delete-event-btn i {
    font-size: 0.9rem;
}

.event-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.edit-event-btn {
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: rgba(59, 130, 246, 0.8);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    backdrop-filter: blur(4px);
    flex-shrink: 0;
}

.edit-event-btn:hover {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border-color: rgba(59, 130, 246, 0.4);
    transform: scale(1.05);
}

.edit-event-btn i {
    font-size: 0.9rem;
}
</style>
