<template>
  <div class="prompt-screen">
    <!-- 왼쪽 사이드 패널 -->
    <div class="side-panel">
      <div class="panel-header">
        <h2 class="panel-title">숙박 요청</h2>
      </div>
      
      <div class="panel-content">
        <!-- 히스토리 모드: 요청 리스트 표시 -->
        <div v-if="sidebarMode === 'history'">
          <!-- 요청 리스트가 없는 경우 표시 -->
          <div v-if="!hotelRequests || hotelRequests.length === 0" class="no-request-message">
            <div class="no-request-icon">
              <i class="pi pi-info-circle"></i>
            </div>
            <h3 class="no-request-title">보낸 요청이 없습니다</h3>
            <p class="no-request-description">
              출장 요청을 보내려면 메인 페이지에서 프롬프트를 입력해주세요.
            </p>
            <router-link to="/main" class="go-to-main-btn">
              <i class="pi pi-arrow-left"></i>
              메인 페이지로 이동
            </router-link>
          </div>
          
          <!-- 요청 리스트 표시 -->
          <div v-else class="request-list">
            <div 
              v-for="(request, index) in hotelRequests" 
              :key="request.session_id"
              class="request-item"
              :class="{ 
                active: selectedRequestIndex === index,
                error: request.isError 
              }"
              @click="!request.isError && selectRequest(index)"
            >
              <div class="request-header">
                <h3 class="request-title">{{ request.vncBusinessInfo?.hotel_destination || '목적지 정보 없음' }}</h3>
                <span class="request-type">숙박</span>
              </div>
              <div class="request-summary">
                <div class="summary-item">
                  <i class="pi pi-calendar"></i>
                  <span>{{ request.vncBusinessInfo?.booking_dates || '날짜 정보 없음' }}</span>
                </div>
                <div class="summary-item">
                  <i class="pi pi-users"></i>
                  <span>{{ request.vncBusinessInfo?.guests ? `${request.vncBusinessInfo.guests}명` : '인원 정보 없음' }}</span>
                </div>
                <div v-if="request.vncBusinessInfo?.budget" class="summary-item">
                  <i class="pi pi-dollar"></i>
                  <span>{{ formatBudget(request.vncBusinessInfo.budget) }}</span>
                </div>
              </div>
              <div class="request-status">
                <!-- 에이전트가 종료되지 않았을 때만 기존 상태 표시 -->
                <span v-if="request.agentStatus !== 'stopped'" class="status-badge" :class="getStatusClass(request.status)">
                  {{ getStatusText(request.status) }}
                </span>
                <!-- 에이전트 상태 표시 -->
                <span v-if="request.agentStatus" class="agent-status-badge" :class="{ stopped: request.agentStatus === 'stopped' }">
                  {{ request.agentStatus === 'running' ? '실행 중' : '종료됨' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 디테일 모드: 선택된 요청 상세 정보 표시 -->
        <div v-else-if="sidebarMode === 'detail' && selectedRequest">
          <!-- 뒤로가기 버튼 -->
          <div class="back-button-container">
            <button class="back-button" @click="goBackToHistory">
              <i class="pi pi-arrow-left"></i>
              뒤로가기
            </button>
          </div>

          <div class="selected-request-details">
            <div class="detail-header">
              <h3 class="detail-title" :class="{ error: selectedRequest.isError }">
                {{ selectedRequest.isError ? '요청 처리 오류' : (selectedRequest.vncBusinessInfo?.hotel_destination || '목적지 정보 없음') }}
              </h3>
              <span class="session-id">{{ selectedRequest.session_id }}</span>
            </div>
            
            <div v-if="selectedRequest.isError" class="error-message">
              <i class="pi pi-exclamation-triangle"></i>
              <div class="error-content">
                <h4>요청 처리 중 오류가 발생했습니다</h4>
                <p>서버에서 요청을 처리하는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
              </div>
            </div>
            
            <div v-else class="detail-info">
              <div class="info-item">
                <span class="info-label">목적지</span>
                <span class="info-value">{{ selectedRequest.vncBusinessInfo?.hotel_destination || '정보 없음' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">여행 기간</span>
                <span class="info-value">{{ selectedRequest.vncBusinessInfo?.booking_dates || '정보 없음' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">인원</span>
                <span class="info-value">{{ selectedRequest.vncBusinessInfo?.guests ? `${selectedRequest.vncBusinessInfo.guests}명` : '정보 없음' }}</span>
              </div>
              <div v-if="selectedRequest.vncBusinessInfo?.budget" class="info-item">
                <span class="info-label">예산</span>
                <span class="info-value">{{ formatBudget(selectedRequest.vncBusinessInfo.budget) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">상태</span>
                <span class="info-value">
                  <!-- 에이전트가 종료되지 않았을 때만 기존 상태 표시 -->
                  <span v-if="selectedRequest.agentStatus !== 'stopped'" class="status-badge" :class="getStatusClass(selectedRequest.status)">
                    {{ getStatusText(selectedRequest.status) }}
                  </span>
                  <!-- 에이전트 상태 표시 -->
                  <span v-if="selectedRequest.agentStatus" class="agent-status-badge" :class="{ stopped: selectedRequest.agentStatus === 'stopped' }">
                    {{ selectedRequest.agentStatus === 'running' ? '실행 중' : '종료됨' }}
                  </span>
                </span>
              </div>
            </div>

            <!-- 에이전트가 실행 중일 때만 진행 상황 표시 -->
            <div v-if="!selectedRequest.isError && selectedRequest.agentStatus !== 'stopped'" class="progress-section">
              <h3 class="progress-title">진행 상황</h3>
              <div class="progress-list">
                <div class="progress-item completed">
                  <i class="pi pi-check-circle"></i>
                  <span>요청 접수</span>
                </div>
                <div class="progress-item active">
                  <i class="pi pi-spin pi-spinner"></i>
                  <span>요청 처리 중</span>
                </div>
                <div class="progress-item">
                  <i class="pi pi-circle"></i>
                  <span>결과 생성</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 오른쪽 iframe 영역 -->
    <div class="iframe-container">
      <div class="iframe-header">
        <div class="iframe-controls">
          <button class="control-btn" @click="refreshIframe" title="새로고침">
            <i class="pi pi-refresh"></i>
          </button>
          <button class="control-btn" @click="toggleFullscreen" title="전체화면">
            <i class="pi pi-expand"></i>
          </button>
        </div>
        <div class="iframe-url">
          <span class="url-text">{{ selectedRequest ? '실시간 진행 상황' : '요청을 선택해주세요...' }}</span>
        </div>
      </div>
      
      <div class="iframe-content" :class="{ loading: isIframeLoading }">
        <!-- 선택된 요청이 없는 경우 -->
        <div v-if="!selectedRequest" class="no-content-message">
          <i class="pi pi-desktop"></i>
          <p>왼쪽에서 요청을 선택하면 진행상황을 확인할 수 있습니다</p>
        </div>
        
        <!-- 선택된 요청이 오류인 경우 -->
        <div v-else-if="selectedRequest.isError" class="error-content-message">
          <i class="pi pi-exclamation-triangle"></i>
          <h3>콘텐츠를 불러올 수 없습니다</h3>
          <p>요청 처리 중 오류가 발생하여 콘텐츠를 표시할 수 없습니다.</p>
        </div>
        
        <!-- 세션이 종료된 경우 -->
        <div v-else-if="isSessionStopped" class="stopped-session-message">
          <i class="pi pi-power-off"></i>
          <h3>종료된 에이전트입니다</h3>
          <p>이 에이전트 세션은 이미 종료되었습니다.</p>
          <p class="session-info">세션 ID: {{ selectedRequest.session_id }}</p>
        </div>
        
        <!-- 선택된 요청이 정상이고 실행 중인 경우 -->
        <template v-else>
          <div v-if="isIframeLoading" class="iframe-loading">
            <i class="pi pi-spin pi-spinner"></i>
            <p>콘텐츠를 불러오는 중...</p>
          </div>
          <iframe
            v-show="!isIframeLoading"
            ref="mainIframe"
            :src="currentIframeUrl"
            frameborder="0"
            allowfullscreen
            @load="onIframeLoad"
            class="main-iframe"
          ></iframe>
        </template>
      </div>
    </div>

    <!-- 리뷰 모달 -->
    <ReviewModal
      :show="showReviewModal"
      @close="closeReviewModal"
      @submit="handleReviewSubmit"
    />
  </div>
</template>

<script>
import { apiService } from '@/services/api.js';
import ReviewModal from '../common/ReviewModal.vue';
import { pushMessage } from '@/utils/notify.js';

export default {
  name: 'PromptScreen',
  components: {
    ReviewModal
  },
  data() {
    return {
      hotelRequests: [], // POST /prompts/hotel 응답의 sessionIdAndVncList
      selectedRequestIndex: -1,
      isIframeLoading: false,
      isFullscreen: false,
      sidebarMode: 'history', // 'history' or 'detail'
      showReviewModal: false,
      hasShownReviewModal: false, // 세션당 한 번만 표시하기 위한 플래그
      statusPollingInterval: null // 상태 폴링 타이머
    };
  },
  computed: {
    selectedRequest() {
      if (this.selectedRequestIndex >= 0 && this.hotelRequests && this.hotelRequests[this.selectedRequestIndex]) {
        return this.hotelRequests[this.selectedRequestIndex];
      }
      return null;
    },
    currentIframeUrl() {
      return this.selectedRequest?.novnc_url || '';
    },
    // 세션이 종료되었는지 확인
    isSessionStopped() {
      return this.selectedRequest?.agentStatus === 'stopped';
    }
  },
  created() {
    // GET /vnc API로 히스토리 조회 (페이지 로드 시마다 호출)
    this.loadVncHistory();
  },
  mounted() {
    // 세션 상태 폴링 시작 (30초마다)
    this.startStatusPolling();
  },
  beforeUnmount() {
    // 폴링 중지
    this.stopStatusPolling();
  },
  methods: {
    async loadVncHistory() {
      try {
        const response = await apiService.prompts.getVncHistory();
        console.log('GET /vnc API 응답 데이터:', response.data); // 응답 데이터 콘솔 출력

        let rawList = [];

        // API 응답 구조에 따라 다르게 처리
        if (Array.isArray(response.data)) {
          // 응답이 배열인 경우: [{vncResponseList: [...]}, {vncResponseList: [...]}]
          rawList = response.data.flatMap(item => item.vncResponseList || []);
        } else if (response.data.vncResponseList) {
          // 응답이 객체이고 vncResponseList가 있는 경우: {vncResponseList: [...]}
          rawList = response.data.vncResponseList;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // 응답이 {data: [...]} 형태인 경우
          rawList = response.data.data.flatMap(item => item.vncResponseList || []);
        } else {
          console.warn('예상하지 못한 API 응답 구조:', response.data);
          rawList = [];
        }

        console.log('처리된 rawList:', rawList); // 처리된 데이터 확인용

        // GET /vnc에서는 유효한 요청만 필터링 (null이나 session_id 없는 것은 제외)
        this.hotelRequests = rawList.filter(request => request && request.session_id);

        // 쿼리 파라미터로 특정 요청 선택 (하위 호환성)
        this.handleQueryParameters();

        // VNC 히스토리 로드 후 즉시 에이전트 서버에 세션 상태 조회
        await this.updateAllSessionStatuses();

        // 히스토리 모드에서는 자동 선택하지 않음 - 사용자가 직접 선택하도록 함
        // const validRequestIndex = this.hotelRequests.findIndex(req => !req.isError);
        // if (validRequestIndex >= 0) {
        //   this.selectedRequestIndex = validRequestIndex;
        // } else if (this.hotelRequests.length > 0) {
        //   this.selectedRequestIndex = 0;
        // }
      } catch (error) {
        console.error('VNC 히스토리 조회 오류:', error);
        this.hotelRequests = [];
      }
    },

    handleQueryParameters() {
      // POST /prompts 응답 데이터 처리 (새로운 형식) - 우선순위 높음
      if (this.$route.query.responseData) {
        try {
          const responseData = JSON.parse(this.$route.query.responseData);
          const rawList = responseData.vncResponseList || [];

          // null 값이 있는 항목을 오류 항목으로 변환
          const queryRequests = rawList.map((request, index) => {
            if (!request || !request.session_id) {
              return {
                session_id: `error-${index}`,
                novnc_url: '',
                vncBusinessInfo: {
                  hotel_destination: '요청 처리 중 오류 발생',
                  booking_dates: '정보 없음',
                  guests: 0,
                  budget: 0
                },
                status: 'ERROR',
                isError: true
              };
            }
            return request;
          });

          // 기존 요청들의 session_id를 Set으로 저장하여 중복 방지
          const existingSessionIds = new Set(this.hotelRequests.map(req => req.session_id));
          
          // 중복되지 않은 요청만 필터링
          const newRequests = queryRequests.filter(req => !existingSessionIds.has(req.session_id));
          
          // 쿼리 파라미터의 요청들을 히스토리에 추가
          this.hotelRequests = [...this.hotelRequests, ...newRequests];
          
          // 새로운 응답을 받았고, 에러가 아닌 경우 리뷰 모달 표시
          if (newRequests.length > 0 && !this.hasShownReviewModal) {
            const hasValidRequest = newRequests.some(req => !req.isError);
            if (hasValidRequest) {
              this.checkAndShowReviewModal();
              this.hasShownReviewModal = true; // 한 번만 표시
            }
          }
        } catch (error) {
          console.error('쿼리 파라미터 응답 데이터 파싱 오류:', error);
        }
      }

      // 기존 쿼리 파라미터 방식도 지원 (하위 호환성)
      const sessionId = this.$route.query.session_id;
      const novncUrl = this.$route.query.novnc_url;
      const detail = this.$route.query.detail;

      if (sessionId && novncUrl && detail) {
        try {
          // 이미 존재하는 session_id인지 확인
          const existingRequest = this.hotelRequests.find(req => req.session_id === sessionId);
          if (!existingRequest) {
            const parsedDetail = JSON.parse(detail);
            const legacyRequest = {
              session_id: sessionId,
              novnc_url: novncUrl,
              vncBusinessInfo: parsedDetail,
              status: 'ING' // 기본 상태
            };
            this.hotelRequests.push(legacyRequest);
          }
        } catch (error) {
          console.error('기존 쿼리 파라미터 데이터 파싱 오류:', error);
        }
      }
    },

    selectRequest(index) {
      this.selectedRequestIndex = index;
      this.sidebarMode = 'detail'; // 디테일 모드로 변경
      this.isIframeLoading = true;
    },
    goBackToHistory() {
      this.sidebarMode = 'history'; // 히스토리 모드로 변경
      this.selectedRequestIndex = -1; // 선택 해제
      this.isIframeLoading = false;
    },
    refreshIframe() {
      this.isIframeLoading = true;
      const iframe = this.$refs.mainIframe;
      if (iframe) {
        const currentSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => {
          iframe.src = currentSrc;
        }, 100);
      }
    },
    toggleFullscreen() {
      // 전체화면 토글 로직 (구현 예정)
      this.isFullscreen = !this.isFullscreen;
      console.log('전체화면 토글:', this.isFullscreen);
    },
    onIframeLoad() {
      this.isIframeLoading = false;
    },
    formatBudget(budget) {
      if (!budget) return '';
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      }).format(budget);
    },
    getStatusText(status) {
      switch (status) {
        case 'ING':
          return '실행 중';
        case 'END':
          return '종료됨';
        case 'PAUSE':
          return '일시중지';
        case 'ERROR':
          return '오류';
        default:
          return '알 수 없음';
      }
    },
    // 리뷰 존재 여부 확인 후 모달 표시
    async checkAndShowReviewModal() {
      try {
        const existingReview = await apiService.getReview();
        
        // 200 OK로 리뷰가 반환되면 이미 작성한 사용자
        if (existingReview) {
          console.log('이미 리뷰를 작성한 사용자입니다.');
          return;
        }
        
        // 리뷰가 없으면 모달 표시 (약간의 딜레이 후)
        setTimeout(() => {
          this.showReviewModal = true;
        }, 2000); // 2초 후 표시 (VNC 화면이 로드되는 시간 고려)
        
      } catch (error) {
        // 에러 발생 시에도 리뷰 모달 표시 (네트워크 오류 등)
        console.log('리뷰 확인 중 오류 발생, 리뷰 모달을 표시합니다:', error);
        setTimeout(() => {
          this.showReviewModal = true;
        }, 2000);
      }
    },
    // 리뷰 모달 닫기
    closeReviewModal() {
      this.showReviewModal = false;
    },
    // 리뷰 제출 완료
    handleReviewSubmit(response) {
      console.log('리뷰 제출 완료:', response);
      pushMessage({ type: 'success', text: '소중한 리뷰 감사합니다!' });
    },
    getStatusClass(status) {
      switch (status) {
        case 'ING':
          return 'processing';
        case 'END':
          return 'completed';
        case 'PAUSE':
          return 'paused';
        case 'ERROR':
          return 'error';
        default:
          return 'unknown';
      }
    },
    
    // 세션 상태 폴링 시작
    startStatusPolling() {
      // 30초마다 반복 실행 (초기 실행은 loadVncHistory에서 이미 수행됨)
      this.statusPollingInterval = setInterval(() => {
        this.updateAllSessionStatuses();
      }, 30000); // 30초
    },
    
    // 세션 상태 폴링 중지
    stopStatusPolling() {
      if (this.statusPollingInterval) {
        clearInterval(this.statusPollingInterval);
        this.statusPollingInterval = null;
      }
    },
    
    // 모든 세션의 상태를 한번에 업데이트
    async updateAllSessionStatuses() {
      if (!this.hotelRequests || this.hotelRequests.length === 0) {
        return;
      }
      
      try {
        // 유효한 세션들만 필터링 (에러 상태가 아니고 session_id가 있는 것)
        const validRequests = this.hotelRequests.filter(
          req => !req.isError && req.session_id && !req.session_id.startsWith('error-')
        );
        
        if (validRequests.length === 0) {
          return;
        }
        
        console.log('[세션 상태 업데이트] 조회할 세션 수:', validRequests.length);
        
        // 모든 세션의 상태를 병렬로 조회
        const statusPromises = validRequests.map(async (request) => {
          try {
            const statusData = await apiService.agent.getSessionStatus(request.session_id);
            return {
              session_id: request.session_id,
              agentStatus: statusData.status, // 'running' or 'stopped'
              success: true
            };
          } catch (error) {
            console.error(`세션 ${request.session_id} 상태 조회 실패:`, error);
            return {
              session_id: request.session_id,
              agentStatus: null,
              success: false
            };
          }
        });
        
        // 모든 요청이 완료될 때까지 대기
        const results = await Promise.all(statusPromises);
        
        // 한번에 상태 업데이트
        results.forEach(result => {
          const requestIndex = this.hotelRequests.findIndex(
            req => req.session_id === result.session_id
          );
          
          if (requestIndex !== -1 && result.success) {
            // Vue 3: 직접 할당으로 반응성 유지
            this.hotelRequests[requestIndex] = {
              ...this.hotelRequests[requestIndex],
              agentStatus: result.agentStatus
            };
            
            console.log(`[세션 ${result.session_id}] 상태: ${result.agentStatus}`);
          }
        });
        
        console.log('[세션 상태 업데이트] 완료');
      } catch (error) {
        console.error('세션 상태 업데이트 중 오류:', error);
      }
    }
  }
};
</script>

<style scoped>
.prompt-screen {
  display: flex;
  height: 100vh;
  background-color: var(--color-bg-primary);
  font-family: var(--font-family-primary);
  padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
}

@media (max-width: 768px) {
  .prompt-screen {
    padding-left: 0;
  }
}

/* 왼쪽 사이드 패널 */
.side-panel {
  width: 320px;
  background-color: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border-primary);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel-header {
  padding: var(--spacing-2xl);
  border-bottom: 1px solid var(--color-border-primary);
}

.panel-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.panel-content {
  flex: 1;
  padding: var(--spacing-2xl);
  overflow-y: auto;
}

/* 요청 없음 메시지 */
.no-request-message {
  text-align: center;
  padding: var(--spacing-5xl) var(--spacing-2xl);
  margin-bottom: var(--spacing-3xl);
}

.no-request-icon {
  margin-bottom: var(--spacing-2xl);
}

.no-request-icon i {
  font-size: var(--font-size-5xl);
  color: var(--color-text-muted);
}

.no-request-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-lg) 0;
}

.no-request-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin: 0 0 var(--spacing-3xl) 0;
}

.go-to-main-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.go-to-main-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.back-button-container {
  margin-bottom: var(--spacing-lg);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.back-button:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 요청 리스트 */
.request-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-3xl);
}

.request-item {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.request-item:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.request-item.error {
  border-color: var(--color-error);
  background-color: var(--color-error-light);
  cursor: not-allowed;
  opacity: 0.8;
}

.request-item.error:hover {
  border-color: var(--color-error);
  background-color: var(--color-error-light);
  transform: none;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.request-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  flex: 1;
}

.request-type {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
  margin-left: var(--spacing-md);
}

.request-summary {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.summary-item i {
  width: 14px;
  height: 14px;
  color: var(--color-text-muted);
}

.request-status {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge.processing {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border: 1px solid var(--color-primary-border);
}

.status-badge.completed {
  background-color: var(--color-success-light);
  color: var(--color-success);
  border: 1px solid var(--color-success-border);
}

.status-badge.paused {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
  border: 1px solid var(--color-warning-border);
}

.status-badge.error {
  background-color: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
}

.status-badge.unknown {
  background-color: var(--color-text-muted);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-secondary);
}

/* 선택된 요청 상세 정보 */
.selected-request-details {
  margin-bottom: var(--spacing-3xl);
}

.detail-header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-secondary);
}

.detail-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-xs) 0;
}

.session-id {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  word-break: break-all;
}

.detail-info {
  margin-bottom: var(--spacing-2xl);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border-secondary);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.detail-title.error {
  color: var(--color-error);
}

.error-message {
  background-color: var(--color-error-light);
  border: 1px solid var(--color-error-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.error-message i {
  color: var(--color-error);
  font-size: var(--font-size-xl);
  flex-shrink: 0;
  margin-top: var(--spacing-xs);
}

.error-content h4 {
  color: var(--color-error);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-sm) 0;
}

.error-content p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin: 0;
}

/* 진행 상황 */
.progress-section {
  margin-bottom: var(--spacing-3xl);
}

.progress-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-lg) 0;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.progress-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.progress-item.completed {
  color: var(--color-success);
}

.progress-item.active {
  color: var(--color-primary);
}

.progress-item i {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 오른쪽 iframe 영역 */
.iframe-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
}

.iframe-header {
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-primary);
  padding: var(--spacing-lg) var(--spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
}

.iframe-controls {
  display: flex;
  gap: var(--spacing-sm);
}

.control-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all var(--transition-normal);
}

.control-btn:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-tertiary);
}

.iframe-url {
  flex: 1;
  text-align: center;
}

.url-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.iframe-content {
  flex: 1;
  position: relative;
  background-color: var(--color-bg-primary);
}

.iframe-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
  gap: var(--spacing-lg);
}

.iframe-loading i {
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
}

.iframe-loading p {
  margin: 0;
  font-size: var(--font-size-base);
}

.no-content-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-primary);
  color: var(--color-text-muted);
  gap: var(--spacing-lg);
}

.no-content-message i {
  font-size: var(--font-size-5xl);
  color: var(--color-text-muted);
}

.no-content-message p {
  margin: 0;
  font-size: var(--font-size-base);
  text-align: center;
}

.error-content-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-primary);
  color: var(--color-error);
  gap: var(--spacing-lg);
  text-align: center;
}

.error-content-message i {
  font-size: var(--font-size-4xl);
  color: var(--color-error);
}

.error-content-message h3 {
  color: var(--color-error);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.error-content-message p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
  max-width: 300px;
}

/* 종료된 세션 메시지 */
.stopped-session-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-primary);
  color: var(--color-text-muted);
  gap: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-2xl);
}

.stopped-session-message i {
  font-size: var(--font-size-5xl);
  color: var(--color-text-muted);
  opacity: 0.6;
}

.stopped-session-message h3 {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.stopped-session-message p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
  line-height: 1.6;
}

.stopped-session-message .session-info {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-md);
  word-break: break-all;
  max-width: 400px;
}

/* 에이전트 상태 배지 */
.agent-status-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background-color: var(--color-success-light);
  color: var(--color-success);
  border: 1px solid var(--color-success-border);
  margin-left: var(--spacing-xs);
}

.agent-status-badge.stopped {
  background-color: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
}

.main-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .side-panel {
    width: 280px;
  }
  
  .panel-header,
  .panel-content {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .prompt-screen {
    flex-direction: column;
  }
  
  .side-panel {
    width: 100%;
    height: auto;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid var(--color-border-primary);
  }
  
  .panel-header {
    padding: var(--spacing-lg);
  }
  
  .panel-title {
    font-size: 1.2rem;
    text-align: center;
  }
  
  .panel-content {
    padding: var(--spacing-md);
    overflow-y: auto;
  }
  
  .request-item {
    padding: var(--spacing-md);
  }
  
  .request-title {
    font-size: 0.95rem;
  }
  
  .summary-item {
    font-size: 0.85rem;
  }
  
  .request-details,
  .progress-section {
    margin-bottom: var(--spacing-lg);
  }
  
  .iframe-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }
}

/* 스크롤바 스타일링 */
.side-panel::-webkit-scrollbar,
.panel-content::-webkit-scrollbar {
  width: var(--scrollbar-width);
}

.side-panel::-webkit-scrollbar-track,
.panel-content::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.side-panel::-webkit-scrollbar-thumb,
.panel-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: var(--radius-full);
}

.side-panel::-webkit-scrollbar-thumb:hover,
.panel-content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
</style>