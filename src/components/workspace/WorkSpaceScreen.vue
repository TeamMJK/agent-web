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
        <div class="schedule-buttons">
          <button class="add-schedule-btn mjk-btn" @click="openAddScheduleModal('mjk')">
            <i class="pi pi-plus"></i>
            <span>MJK 일정 추가</span>
          </button>
          <button class="add-schedule-btn company-btn" @click="openAddScheduleModal('company')">
            <i class="pi pi-plus"></i>
            <span>기업 일정 추가</span>
          </button>
        </div>
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
          @edit-event="handleEditEvent"
      />
    </div>

    <ScheduleModal
        :show="showAddScheduleModal"
        :trip-type="currentTripType"
        :edit-mode="isEditMode"
        :edit-data="editEventData"
        @close="closeAddScheduleModal"
        @add-schedule="handleAddSchedule"
    />
    
    <!-- 삭제 확인 대화상자 -->
    <BaseConfirm
      :show="showDeleteConfirm"
      title="일정 삭제"
      message="이 일정을 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
      confirm-text="삭제"
      cancel-text="취소"
      confirm-variant="confirm"
      icon-type="warning"
      @confirm="confirmDeleteEvent"
      @cancel="cancelDeleteEvent"
    />

    <!-- 메시지 표시 -->
    <BaseMessage
      v-if="message.show"
      :type="message.type"
      @close="message.show = false"
    >
      {{ message.text }}
    </BaseMessage>
  </div>
</template>

<script>
import CalendarGrid from './CalendarGrid.vue';
import EventDetails from './EventDetails.vue';
import ScheduleModal from './ScheduleModal.vue';
import CompanyMenu from './CompanyMenu.vue';
import BaseConfirm from '../common/BaseConfirm.vue';
import BaseMessage from '../common/BaseMessage.vue';
import { apiService } from '../../services/api.js';

export default {
  name: 'WorkSpaceScreen',
  components: {
    CalendarGrid,
    EventDetails,
    ScheduleModal,
    CompanyMenu,
    BaseConfirm,
    BaseMessage,
  },
  data() {
    return {
      selectedDate: new Date(),
      showAddScheduleModal: false,
      currentTripType: 'mjk', // 'mjk' or 'company'
      isEditMode: false,
      editEventData: null,
      events: [], // This will be fetched from the backend
      showDeleteConfirm: false,
      eventToDelete: null,
      message: {
        show: false,
        type: 'success',
        text: ''
      }
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
    openAddScheduleModal(tripType) {
      this.currentTripType = tripType;
      this.isEditMode = false;
      this.editEventData = null;
      this.showAddScheduleModal = true;
    },
    closeAddScheduleModal() {
      this.showAddScheduleModal = false;
      this.currentTripType = 'mjk';
      this.isEditMode = false;
      this.editEventData = null;
    },
    handleEditEvent(event) {
      this.isEditMode = true;
      this.editEventData = event;
      this.currentTripType = 'mjk'; // 수정은 MJK 워크스페이스로 고정
      this.showAddScheduleModal = true;
    },
    async handleAddSchedule(tripData) {
      try {
        let response;
        
        if (this.isEditMode && this.editEventData) {
          // 수정 모드
          response = await apiService.businessTrips.update(this.editEventData.id, tripData);
          console.log('출장 수정 성공:', response.data);
        } else {
          // 등록 모드
          if (this.currentTripType === 'mjk') {
            response = await apiService.businessTrips.create(tripData);
            console.log('MJK 워크스페이스 출장 등록 성공:', response.data);
          } else if (this.currentTripType === 'company') {
            response = await apiService.businessTrips.createMcp(tripData);
            console.log('기업 워크스페이스 출장 MCP 등록 성공:', response.data);
          }
        }
        
        // 성공 시 목록 다시 조회
        await this.fetchSchedules();
        
        // 모달 닫기
        this.closeAddScheduleModal();
        
      } catch (error) {
        console.error('출장 처리 실패:', error);
        // TODO: 사용자에게 에러 메시지 표시 (BaseMessage 사용)
        alert('출장 처리에 실패했습니다. 다시 시도해주세요.');
      }
    },
    handleDeleteEvent(eventId) {
      const event = this.events.find(e => e.id === eventId);
      if (event) {
        this.eventToDelete = event;
        this.showDeleteConfirm = true;
      }
    },
    
    confirmDeleteEvent() {
      if (this.eventToDelete) {
        // API 호출로 출장 삭제
        this.deleteEvent(this.eventToDelete.id);
      }
      this.cancelDeleteEvent();
    },
    
    cancelDeleteEvent() {
      this.showDeleteConfirm = false;
      this.eventToDelete = null;
    },
    async deleteEvent(eventId) {
      try {
        // 출장 삭제 API 호출
        await apiService.businessTrips.delete(eventId);
        
        // 로컬 상태에서 이벤트 제거
        this.events = this.events.filter(event => event.id !== eventId);
        
        // 성공 메시지 표시
        this.showMessage('success', '출장이 성공적으로 삭제되었습니다.');
        
        console.log('출장 삭제 성공:', eventId);
      } catch (error) {
        console.error('출장 삭제 실패:', error);
        
        // 에러 메시지 표시
        this.showMessage('error', '출장 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    },
    showMessage(type, text) {
      this.message = {
        show: true,
        type,
        text
      };
      
      // 3초 후 자동 숨김
      setTimeout(() => {
        this.message.show = false;
      }, 3000);
    },
    async fetchSchedules() {
      try {
        const response = await apiService.businessTrips.getList();
        // API 응답에서 businessTripList 추출
        const businessTrips = response.data.businessTripList || [];
        
        // 캘린더 이벤트 포맷으로 변환
        this.events = businessTrips.map(trip => ({
          id: trip.id,
          title: `${trip.destination} (${trip.serviceType === 'FLIGHT' ? '항공' : '숙박'})`,
          startDate: trip.departDate,
          endDate: trip.arriveDate,
          description: `출장자: ${trip.names.join(', ')}\n작성자: ${trip.writer}`,
          color: trip.serviceType === 'FLIGHT' ? '#3B82F6' : '#10B981', // 항공: 파란색, 숙박: 초록색
          serviceType: trip.serviceType,
          destination: trip.destination,
          names: trip.names,
          writer: trip.writer,
          companyId: trip.companyId
        }));
        
        console.log('출장 목록 조회 성공:', this.events.length, '건');
      } catch (error) {
        console.error('출장 목록 조회 실패:', error);
        // 에러 발생 시 빈 배열로 설정
        this.events = [];
      }
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

.schedule-buttons {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
}

.workspace-title {
    font-size: 2.5rem;
    font-weight: 600;
    background: var(--gradient-text);
    background-clip: text;
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

.company-btn {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
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

    .schedule-buttons {
        width: 100%;
        flex-direction: column;
        gap: var(--spacing-md);
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