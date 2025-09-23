<template>
  <div class="prompt-screen">
    <!-- 왼쪽 사이드 패널 -->
    <div class="side-panel">
      <div class="panel-header">
        <h2 class="panel-title">출장 요청</h2>
      </div>
      
      <div class="panel-content">
        <!-- 유효한 요청이 없는 경우 표시 -->
        <div v-if="!hasValidRequest" class="no-request-message">
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
        
        <!-- 유효한 요청이 있는 경우 표시 -->
        <div v-else class="request-info">
          <div class="info-item">
            <span class="info-label">요청 유형</span>
            <span class="info-value">{{ requestType }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">상태</span>
            <span class="status-badge processing">처리 중</span>
          </div>
          <div class="info-item">
            <span class="info-label">요청 시간</span>
            <span class="info-value">{{ requestTime }}</span>
          </div>
          <div v-if="sessionId" class="info-item">
            <span class="info-label">세션 ID</span>
            <span class="info-value session-id">{{ sessionId }}</span>
          </div>
        </div>

        <!-- 유효한 요청이 있는 경우만 표시 -->
        <template v-if="hasValidRequest">
          <div class="request-details">
            <h3 class="details-title">요청 내용</h3>
            <div class="prompt-text">
              {{ promptText }}
            </div>
          </div>

          <!-- 호텔 상세 정보 (API 응답에서 받은 경우만 표시) -->
          <div v-if="hotelDetails" class="hotel-details">
            <h3 class="details-title">상세 정보</h3>
            <div class="details-grid">
              <div v-if="hotelDetails.hotel_destination" class="detail-item">
                <span class="detail-label">목적지</span>
                <span class="detail-value">{{ hotelDetails.hotel_destination }}</span>
              </div>
              <div v-if="hotelDetails.booking_dates" class="detail-item">
                <span class="detail-label">여행 기간</span>
                <span class="detail-value">{{ hotelDetails.booking_dates }}</span>
              </div>
              <div v-if="hotelDetails.guests" class="detail-item">
                <span class="detail-label">인원</span>
                <span class="detail-value">{{ hotelDetails.guests }}</span>
              </div>
              <div v-if="hotelDetails.budget" class="detail-item">
                <span class="detail-label">예산</span>
                <span class="detail-value">{{ hotelDetails.budget }}</span>
              </div>
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
        </template>
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
          <span class="url-text">{{ iframeUrl || '콘텐츠를 준비하는 중...' }}</span>
        </div>
      </div>
      
      <div class="iframe-content" :class="{ loading: isIframeLoading }">
        <!-- 유효한 요청이 없는 경우 -->
        <div v-if="!hasValidRequest" class="no-content-message">
          <i class="pi pi-desktop"></i>
          <p>출장 요청을 보내면 진행상황을 확인할 수 있습니다</p>
        </div>
        
        <!-- 유효한 요청이 있는 경우 -->
        <template v-else>
          <div v-if="isIframeLoading" class="iframe-loading">
            <i class="pi pi-spin pi-spinner"></i>
            <p>콘텐츠를 불러오는 중...</p>
          </div>
          <iframe
            v-show="!isIframeLoading"
            ref="mainIframe"
            :src="iframeUrl"
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
      requestType: '숙박+항공',
      requestTime: new Date().toLocaleString('ko-KR'),
      promptText: '',
      iframeUrl: '',
      isIframeLoading: true,
      isFullscreen: false,
      sessionId: '',
      hotelDetails: null,
      hasValidRequest: false
    };
  },
  created() {
    // 쿼리 파라미터에서 데이터 가져오기
    const promptFromQuery = this.$route.query.prompt;
    
    // 유효한 요청인지 확인 (프롬프트가 있고 기본값이 아닌 경우)
    this.hasValidRequest = !!(promptFromQuery && promptFromQuery !== '프롬프트 정보가 없습니다.');
    
    this.promptText = promptFromQuery || '프롬프트 정보가 없습니다.';
    const filter = this.$route.query.filter || 'all';
    
    // 필터에 따른 요청 유형 설정
    switch(filter) {
      case 'hotel':
        this.requestType = '숙박';
        break;
      case 'flight':
        this.requestType = '항공';
        break;
      default:
        this.requestType = '숙박+항공';
    }

    // API 응답 데이터 처리
    this.sessionId = this.$route.query.session_id || '';
    
    // detail 정보 파싱
    if (this.$route.query.detail) {
      try {
        this.hotelDetails = JSON.parse(this.$route.query.detail);
      } catch (error) {
        console.error('Detail 데이터 파싱 오류:', error);
        this.hotelDetails = null;
      }
    }

    // novnc_url 설정
    if (this.$route.query.novnc_url) {
      this.iframeUrl = this.$route.query.novnc_url;
      this.isIframeLoading = true; // URL이 있으면 로딩 시작
    } else {
      // 유효한 요청이 없는 경우 로딩 상태를 해제
      if (!this.hasValidRequest) {
        this.isIframeLoading = false;
      } else {
        // 임시 URL 설정 (novnc_url이 없는 경우)
        this.setIframeUrl();
      }
    }
  },
  methods: {
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
    setIframeUrl() {
      // 임시 URL 설정 - 실제로는 API 응답에서 받아온 URL을 사용
      this.iframeUrl = 'http://1.228.118.20:6081/vnc.html?autoconnect=true&resize=scale';
      
      // 로딩 시뮬레이션
      setTimeout(() => {
        this.isIframeLoading = false;
      }, 2000);
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

/* 요청 정보 */
.request-info {
  margin-bottom: var(--spacing-3xl);
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

.session-id {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  word-break: break-all;
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

/* 요청 상세 */
.request-details {
  margin-bottom: var(--spacing-3xl);
}

.details-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-lg) 0;
}

.prompt-text {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  word-break: break-word;
}

/* 호텔 상세 정보 */
.hotel-details {
  margin-bottom: var(--spacing-3xl);
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacing-md);
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
}

.detail-label {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

.detail-value {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: right;
  flex: 1;
  margin-left: var(--spacing-md);
  word-break: break-word;
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