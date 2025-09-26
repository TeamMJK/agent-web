<!-- filepath: /Users/jaeyoung/Desktop/trip-agent-web/src/components/MainScreen.vue -->
<template>
    <div class="main-container">
        <!-- 회사 메뉴 -->
        <div class="top-right-menu">
            <CompanyMenu />
        </div>

        <!-- 로고 텍스트 -->
        <div class="logo-text">TripAgent<span class="pro-badge">test.v1</span></div>

        <!-- 프롬프트 입력 영역 -->
        <div class="prompt-section">
            <div class="prompt-input-wrapper" :class="{ submitting: isSubmitting }">
                <!-- 파일 업로드 아이콘 -->
                <button class="icon-btn file-upload-btn">
                    <i class="pi pi-user"></i>
                </button>

                <!-- 프롬프트 창 -->
                <input type="text" v-model="prompt" placeholder="10월 1일부터 10월 5일까지 부산으로 출장을 갈거야. 최저가 호텔로 예약해줘."
                    class="prompt-input" @keyup.enter="submitPrompt" :disabled="isSubmitting" />

                <!-- 전송 버튼 -->
                <button class="icon-btn submit-btn" @click="submitPrompt" title="전송" :disabled="isSubmitting">
                    <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-send"></i>
                </button>
            </div>

            <!-- 필터 버튼 그룹 -->
            <div class="filter-buttons">
                <button v-for="filter in filters" :key="filter.id"
                    :class="['filter-btn', { active: activeFilter === filter.id }]" 
                    @click="setActiveFilter(filter.id)"
                    :disabled="isSubmitting">
                    {{ filter.label }}
                </button>
            </div>
        </div>

        <!-- 챗봇 응답 표시 영역 -->
        <div v-if="!isSubmitting" class="chat-response-area">
            <p v-if="!chatResponse" class="placeholder-text">에이전트에게 출장 자동 예약을 요청하세요.</p>
            <p v-else class="response-text">{{ chatResponse }}</p>
            
            <!-- 에러 메시지 표시 -->
            <div v-if="errorMessage" class="error-message">
                <i class="pi pi-times-circle"></i>
                <span>{{ errorMessage }}</span>
            </div>
        </div>

        <!-- 로딩 상태 표시 영역 -->
        <div v-else class="loading-area">
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <div class="loading-content">
                    <h3 class="loading-title">에이전트가 요청을 준비 중입니다</h3>
                    <p class="loading-subtitle">{{ loadingMessage }}</p>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CompanyMenu from '../workspace/CompanyMenu.vue';
import { apiService } from '../../services/api';
import { pushMessage } from '../../utils/notify.js';

export default {
    name: 'MainScreen',
    components: {
        CompanyMenu,
    },
    data() {
        return {
            prompt: '', // 사용자 입력 프롬프트
            activeFilter: 'hotel', // 현재 활성화된 필터
            filters: [ // 필터 목록,
                { id: 'hotel', label: '숙박' },
                { id: 'flight', label: '항공' },
                { id: 'all', label: '숙박+항공' }
            ],
            chatResponse: '', // 챗봇 응답 (임시)
            isFocusMode: false, // 검색 초점 모드 상태
            isSubmitting: false, // 프롬프트 제출 중 상태
            errorMessage: '', // 에러 메시지
            loadingMessage: '프롬프트를 분석중입니다...', // 로딩 메시지
            loadingMessageTimer: null // 로딩 메시지 변경 타이머
        };
    },
    methods: {
        // 프롬프트 제출 로직
        async submitPrompt() {
            const text = this.prompt.trim();
            if (!text || this.isSubmitting) return; // 입력 내용이 없거나 이미 제출 중이면 무시

            this.isSubmitting = true;
            this.loadingMessage = '프롬프트를 분석중입니다...'; // 초기 메시지 설정

            // 10초 후 메시지 변경 타이머 설정
            this.loadingMessageTimer = setTimeout(() => {
                this.loadingMessage = '에이전트가 작업을 계획중입니다...';
            }, 10000);

            try {
                let requestFn;
                let filterName = '';

                // 활성 필터에 따른 엔드포인트 결정
                if (this.activeFilter === 'all') {
                    requestFn = apiService.prompts.integration;
                    filterName = '숙박+항공';
                } else if (this.activeFilter === 'hotel') {
                    requestFn = apiService.prompts.hotel;
                    filterName = '숙박';
                } else if (this.activeFilter === 'flight') {
                    requestFn = apiService.prompts.flight;
                    filterName = '항공';
                }

                const response = await requestFn({ prompt: text });

                // 응답 데이터 구조 확인
                const responseData = response.data;
                console.log('API Response:', responseData);

                // 성공 시 PromptScreen으로 이동
                const promptText = this.prompt; // 이동 전에 프롬프트 텍스트 저장
                this.prompt = ''; // 입력창 비우기
                
                // API 응답 데이터를 쿼리 파라미터로 전달
                const queryParams = {
                    prompt: promptText,
                    filter: this.activeFilter
                };

                // POST /prompts 응답 형식에 맞춰 데이터 전달
                if (responseData.vncResponseList && responseData.vncResponseList.length > 0) {
                    // 전체 응답 데이터를 JSON 문자열로 전달
                    queryParams.responseData = JSON.stringify(responseData);
                } else {
                    // 기존 방식 지원 (하위 호환성)
                    if (responseData.novnc_url) {
                        queryParams.novnc_url = responseData.novnc_url;
                    }
                    if (responseData.session_id) {
                        queryParams.session_id = responseData.session_id;
                    }
                    if (responseData.detail) {
                        queryParams.detail = JSON.stringify(responseData.detail);
                    }
                }

                // PromptScreen으로 이동
                this.$router.push({
                    name: 'PromptScreen',
                    query: queryParams
                });
                
                pushMessage({ type: 'success', text: `${filterName} 요청이 성공적으로 전송되었습니다.` });

            } catch (error) {
                // 서버에서 내려준 메시지를 우선 표시
                const serverMsg = error?.response?.data?.message;
                if (serverMsg) {
                    this.errorMessage = serverMsg;
                } else if (error?.message) {
                    this.errorMessage = `요청 실패: ${error.message}`;
                } else {
                    this.errorMessage = '요청 처리 중 알 수 없는 오류가 발생했습니다.';
                }
            } finally {
                this.isSubmitting = false;
                // 타이머 클리어
                if (this.loadingMessageTimer) {
                    clearTimeout(this.loadingMessageTimer);
                    this.loadingMessageTimer = null;
                }
            }
        },
        // 활성 필터 설정
        setActiveFilter(filterId) {
            this.activeFilter = filterId;
            console.log(`필터 변경: ${filterId}`);
            // TODO: 필터 변경에 따른 추가 로직 구현 (예: 검색 결과 재요청)
        },
        // 파일 업로드 처리 (구현 예정)
        handleFileUpload() {
            console.log('파일 업로드 기능 구현 예정');
            // TODO: 파일 업로드 UI 및 로직 구현
        },
        // 검색 초점 모드 토글 (구현 예정)
        toggleFocusMode() {
            this.isFocusMode = !this.isFocusMode;
            console.log(`검색 초점 모드 ${this.isFocusMode ? '활성화' : '비활성화'}`);
            // TODO: 검색 초점 모드에 따른 UI/기능 변경 로직 구현
        }
    }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

.main-container {
    font-family: "Pretendard Variable", Pretendard, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 20px;
    padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2 + 20px);
    position: relative;
}

.top-right-menu {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
}

.logo-text {
    font-size: 3.5rem;
    font-weight: 300;
    color: #ffffff;
    margin-bottom: 3rem;
    text-align: center;
    letter-spacing: -1px;
}

.logo-text .pro-badge {
    font-size: 1rem;
    color: var(--color-primary);
    vertical-align: super;
    margin-left: 0.5rem;
    border: 1px solid var(--color-primary);
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 400;
    background: var(--color-primary-light);
}

.prompt-section {
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
}

.prompt-input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #232323;
    border: 1px solid #333333;
    border-radius: 50px;
    padding: 4px 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.prompt-input-wrapper.submitting {
    opacity: 0.7;
    transform: scale(0.98);
}

.prompt-input {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    color: #ffffff;
    font-size: 1rem;
    padding: 16px 20px;
    outline: none;
    font-family: inherit;
}

.prompt-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.prompt-input::placeholder {
    color: #888888;
}

.icon-btn {
    background: none;
    border: none;
    color: #888888;
    cursor: pointer;
    padding: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
}

.icon-btn:hover:not(:disabled) {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
}

.icon-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.submit-btn:hover {
    background-color: #357ABD;
    color: white;
}

.filter-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-btn {
    background-color: #232323;
    color: #888888;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    border: 1px solid #333333;
    cursor: pointer;
    white-space: nowrap;
}

.filter-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.filter-btn.active {
    background-color: var(--color-primary);
    color: #ffffff;
    border-color: var(--color-primary);
}

.filter-btn:hover:not(.active) {
    background-color: #2a2a2a;
    border-color: var(--color-primary);
    color: #ffffff;
}

.chat-response-area {
    width: 100%;
    max-width: 700px;
    text-align: center;
    opacity: 0.7;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

.placeholder-text {
    color: #888888;
    font-size: 1rem;
    margin: 0;
    font-weight: 400;
}

.response-text {
    color: #ffffff;
    font-size: 1rem;
    margin: 0;
    font-weight: 400;
}

/* 에러 메시지 스타일 */
.error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
    border: 1px solid rgba(244, 67, 54, 0.3);
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    margin: 12px 0;
    max-width: 500px;
}

.error-message i {
    flex-shrink: 0;
    font-size: 1.1em;
}

/* 로딩 상태 스타일 */
.loading-area {
    width: 100%;
    max-width: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.loading-spinner {
    position: relative;
    width: 80px;
    height: 80px;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
    animation-delay: 0.2s;
    border-top-color: var(--color-primary-light);
}

.spinner-ring:nth-child(3) {
    animation-delay: 0.4s;
    border-top-color: rgba(255, 255, 255, 0.6);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-content {
    text-align: center;
    max-width: 400px;
}

.loading-title {
    font-size: 1.4rem;
    font-weight: 500;
    color: #ffffff;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
}

.loading-subtitle {
    font-size: 0.95rem;
    color: #888888;
    margin: 0 0 1.5rem 0;
    font-weight: 400;
}

.loading-progress {
    width: 100%;
    max-width: 300px;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
    border-radius: 2px;
    animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .main-container {
        padding: 0 16px;
        padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2 + 16px);
    }
    
    .logo-text {
        font-size: 2.5rem;
        margin-bottom: 2rem;
    }
    
    .prompt-section {
        max-width: 100%;
    }
    
    .filter-buttons {
        gap: 8px;
    }
    
    .filter-btn {
        padding: 8px 16px;
        font-size: 0.8rem;
    }

    .loading-container {
        padding: 1.5rem;
        gap: 1.5rem;
    }

    .loading-spinner {
        width: 60px;
        height: 60px;
    }

    .loading-title {
        font-size: 1.2rem;
    }

    .loading-subtitle {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .main-container {
        padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2 + 16px);
    }
    
    .logo-text {
        font-size: 2rem;
    }
    
    .prompt-input {
        font-size: 0.9rem;
        padding: 14px 16px;
    }
    
    .icon-btn {
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }

    .loading-container {
        padding: 1rem;
        min-height: 150px;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
    }

    .loading-title {
        font-size: 1.1rem;
    }

    .loading-subtitle {
        font-size: 0.85rem;
    }
}
</style>