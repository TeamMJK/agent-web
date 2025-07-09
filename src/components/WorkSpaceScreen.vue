<template>
  <div class="workspace-container">
    <!-- 헤더 영역 -->
    <div class="workspace-header">
      <h1 class="workspace-title">워크스페이스</h1>
      <button class="add-schedule-btn" @click="showAddScheduleModal = true">
        + 일정 추가
      </button>
    </div>

    <CalendarGrid
        :events="events"
        :selected-date="selectedDate"
        @update:selectedDate="handleDateSelected"
        @change-month="handleMonthChanged"
    />

    <EventDetails
        v-if="selectedDate"
        :selected-date="selectedDate"
        :events="events"
        @delete-event="handleDeleteEvent"
    />

    <ScheduleModal
        :show="showAddScheduleModal"
        @close="showAddScheduleModal = false"
        @add-schedule="handleAddSchedule"
    />
  </div>
</template>

<script>
import CalendarGrid from './CalendarGrid.vue';
import EventDetails from './EventDetails.vue';
import ScheduleModal from './ScheduleModal.vue';

export default {
  name: 'WorkSpaceScreen',
  components: {
    CalendarGrid,
    EventDetails,
    ScheduleModal,
  },
  data() {
    return {
      selectedDate: new Date(),
      showAddScheduleModal: false,
      events: [], // This will be fetched from the backend
    };
  },
  methods: {
    handleDateSelected(date) {
      this.selectedDate = date;
    },
    handleMonthChanged(newMonthDate) {
      // You might want to fetch events for the new month here
      console.log('Month changed to:', newMonthDate);
    },
    handleAddSchedule(newEvent) {
      // Add the new event to the local state
      this.events.push(newEvent);
      // Close the modal
      this.showAddScheduleModal = false;
      // TODO: API call to save the event to the backend
      console.log('Schedule added:', newEvent);
    },
    handleDeleteEvent(eventId) {
      if (confirm('이 일정을 삭제하시겠습니까?')) {
        this.events = this.events.filter(event => event.id !== eventId);
        // TODO: API call to delete the event from the backend
        console.log('Schedule deleted:', eventId);
      }
    },
    async fetchSchedules() {
      // TODO: Implement API call to fetch events
      console.log('Fetching schedules from backend...');
      // Example data:
      // this.events = await api.getEvents();
    }
  },
  mounted() {
    this.fetchSchedules();
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

.workspace-container {
    font-family: "Pretendard Variable", Pretendard, sans-serif;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    color: #E0E0E0;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 32px 24px;
}

.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
}

.workspace-title {
    font-size: 2rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
}

.add-schedule-btn {
    background: #4A90E2;
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
}

.add-schedule-btn:hover {
    background: #357ABD;
}

/* Responsive styles */
@media (max-width: 768px) {
    .workspace-container {
        width: 95%;
        padding: 24px 16px;
    }

    .workspace-header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        text-align: center;
    }

    .workspace-title {
        font-size: 1.5rem;
    }

    .add-schedule-btn {
        width: 100%;
        padding: 16px 24px;
    }
}

@media (max-width: 480px) {
    .workspace-container {
        width: 100%;
        padding: 16px 12px;
    }

    .workspace-title {
        font-size: 1.3rem;
    }
}

@media (min-width: 1400px) {
    .workspace-container {
        padding: 48px 32px;
    }
}
</style>