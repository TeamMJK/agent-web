<template>
  <div class="prompt-screen">
    <!-- 왼쪽 사이드 패널 -->
    <div class="side-panel">
      <div class="panel-header">
        <h2 class="panel-title">숙박 요청</h2>
      </div>
      
      <div class="panel-content">
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
            :class="{ active: selectedRequestIndex === index }"
            @click="selectRequest(index)"
          >
            <div class="request-header">
              <h3 class="request-title">{{ request.detail.hotel_destination }}</h3>
              <span class="request-type">숙박</span>
            </div>
            <div class="request-summary">
              <div class="summary-item">
                <i class="pi pi-calendar"></i>
                <span>{{ request.detail.booking_dates }}</span>
              </div>
              <div class="summary-item">
                <i class="pi pi-users"></i>
                <span>{{ request.detail.guests }}명</span>
              </div>
              <div v-if="request.detail.budget" class="summary-item">
                <i class="pi pi-dollar"></i>
                <span>{{ formatBudget(request.detail.budget) }}</span>
              </div>
            </div>
            <div class="request-status">
              <span class="status-badge processing">처리 중</span>
            </div>
          </div>
        </div>

        <!-- 선택된 요청의 상세 정보 표시 -->
        <div v-if="selectedRequest" class="selected-request-details">
          <div class="detail-header">
            <h3 class="detail-title">{{ selectedRequest.detail.hotel_destination }}</h3>
            <span class="session-id">{{ selectedRequest.session_id }}</span>
          </div>
          
          <div class="detail-info">
            <div class="info-item">
              <span class="info-label">목적지</span>
              <span class="info-value">{{ selectedRequest.detail.hotel_destination }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">여행 기간</span>
              <span class="info-value">{{ selectedRequest.detail.booking_dates }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">인원</span>
              <span class="info-value">{{ selectedRequest.detail.guests }}명</span>
            </div>
            <div v-if="selectedRequest.detail.budget" class="info-item">
              <span class="info-label">예산</span>
              <span class="info-value">{{ formatBudget(selectedRequest.detail.budget) }}</span>
            </div>
          </div>

          <div class="progress-section">
            <h3 class="progress-title">진행 상황</h3>
            <div class="progress-list">
              <div class="progress-item completed">
                <i class="pi pi-check-circle"></i>
                <span>요청 접수</span>
              </div>
              <div class="progress-item active">
                <i class="pi pi-spin pi-spinner"></i>
                <span>정보 처리 중</span>
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
          <span class="url-text">{{ currentIframeUrl || '요청을 선택해주세요...' }}</span>
        </div>
      </div>
      
      <div class="iframe-content" :class="{ loading: isIframeLoading }">
        <!-- 선택된 요청이 없는 경우 -->
        <div v-if="!selectedRequest" class="no-content-message">
          <i class="pi pi-desktop"></i>
          <p>왼쪽에서 요청을 선택하면 진행상황을 확인할 수 있습니다</p>
        </div>
        
        <!-- 선택된 요청이 있는 경우 -->
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
  </div>
</template>

<script>
export default {
  name: 'PromptScreen',
  data() {
    return {
      hotelRequests: [], // POST /prompts/hotel 응답의 sessionIdAndVncList
      selectedRequestIndex: -1,
      isIframeLoading: false,
      isFullscreen: false
    };
  },
  computed: {
    selectedRequest() {
      if (this.selectedRequestIndex >= 0 && this.hotelRequests[this.selectedRequestIndex]) {
        return this.hotelRequests[this.selectedRequestIndex];
      }
      return null;
    },
    currentIframeUrl() {
      return this.selectedRequest?.novnc_url || '';
    }
  },
  created() {
    // POST /prompts/hotel 응답 데이터 처리
    if (this.$route.query.responseData) {
      try {
        const responseData = JSON.parse(this.$route.query.responseData);
        this.hotelRequests = responseData.sessionIdAndVncList || [];
        
        // 첫 번째 요청을 기본 선택
        if (this.hotelRequests.length > 0) {
          this.selectedRequestIndex = 0;
        }
      } catch (error) {
        console.error('응답 데이터 파싱 오류:', error);
        this.hotelRequests = [];
      }
    }
    
    // 기존 쿼리 파라미터 방식도 지원 (하위 호환성)
    const sessionId = this.$route.query.session_id;
    const novncUrl = this.$route.query.novnc_url;
    const detail = this.$route.query.detail;
    
    if (sessionId && novncUrl && detail) {
      try {
        const parsedDetail = JSON.parse(detail);
        this.hotelRequests = [{
          session_id: sessionId,
          novnc_url: novncUrl,
          detail: parsedDetail
        }];
        this.selectedRequestIndex = 0;
      } catch (error) {
        console.error('기존 데이터 파싱 오류:', error);
      }
    }
  },
  methods: {
    selectRequest(index) {
      this.selectedRequestIndex = index;
      this.isIframeLoading = true;
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

.request-item.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
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

.info-value {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
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

.main-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
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
    padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
  }
  
  .side-panel {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--color-border-primary);
  }
  
  .panel-content {
    padding: var(--spacing-md);
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