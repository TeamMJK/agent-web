<template>
  <div class="workspace-container">
    <!-- 헤더 영역 -->
    <div class="workspace-header">
      <div class="header-content">
        <h1 class="workspace-title">워크 스페이스</h1>
        <p class="workspace-subtitle">회사의 출장 일정을 확인하고 관리하세요</p>
      </div>
      <div class="header-actions">
        <CompanyMenu />
        <button class="add-schedule-btn" @click="showAddScheduleModal = true">
          <i class="pi pi-plus"></i>
          <span>일정 추가</span>
        </button>
      </div>
    </div>

    <div class="workspace-content">
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
    </div>

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
import CompanyMenu from './CompanyMenu.vue';

export default {
  name: 'WorkSpaceScreen',
  components: {
    CalendarGrid,
    EventDetails,
    ScheduleModal,
    CompanyMenu,
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
    font-family: var(--font-family-primary);
    width: 100%;
    max-width: 100vw;
    height: 100vh;
    background: var(--color-bg-primary);
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
    box-sizing: border-box;
}

.workspace-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(26, 26, 26, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--color-border-secondary);
    padding: var(--spacing-4xl) var(--spacing-2xl) var(--spacing-2xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-2xl);
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
}

.header-content {
    flex: 1;
    min-width: 0;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex-shrink: 0;
}

.workspace-title {
    font-size: 2.5rem;
    font-weight: 600;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.workspace-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    margin: 0;
    font-weight: 400;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.add-schedule-btn {
    background: var(--gradient-accent);
    color: var(--color-text-primary);
    border: none;
    padding: var(--spacing-lg) var(--spacing-2xl);
    border-radius: var(--radius-2xl);
    font-size: 14px;
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(4px);
    border: 1px solid var(--color-border-secondary);
    white-space: nowrap;
    flex-shrink: 0;
}

.add-schedule-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
}

.add-schedule-btn:active {
    transform: translateY(0);
}

.workspace-content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
}

/* Responsive styles */
@media (max-width: 768px) {
    .workspace-container {
        padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
    }
    
    .workspace-header {
        flex-direction: column;
        align-items: stretch;
        gap: 20px;
        padding: 24px 16px 20px;
    }

    .workspace-title {
        font-size: 2rem;
    }

    .workspace-subtitle {
        font-size: 0.9rem;
    }

    .add-schedule-btn {
        justify-content: center;
        padding: 18px 24px;
        width: 100%;
    }

    .workspace-content {
        padding: 16px;
        gap: 24px;
    }
}

@media (max-width: 480px) {
    .workspace-container {
        padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
    }
    
    .workspace-title {
        font-size: 1.8rem;
    }

    .workspace-header {
        padding: 20px 12px 16px;
    }

    .workspace-content {
        padding: 12px;
    }
    
    .add-schedule-btn {
        font-size: 13px;
        padding: 16px 20px;
    }
}

/* 매우 작은 화면에 대한 추가 대응 */
@media (max-width: 320px) {
    .workspace-title {
        font-size: 1.5rem;
    }
    
    .workspace-subtitle {
        font-size: 0.8rem;
    }
    
    .workspace-header {
        padding: 16px 8px 12px;
    }
    
    .workspace-content {
        padding: 8px;
    }
}
</style>