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
            <div class="prompt-input-wrapper">
                <!-- 파일 업로드 아이콘 -->
                <button class="icon-btn file-upload-btn">
                    <i class="pi pi-user"></i>
                </button>

                <!-- 검색창 -->
                <input type="text" v-model="prompt" placeholder="어떤 출장을 계획하고 계신가요?"
                    class="prompt-input" @keyup.enter="submitPrompt" />

                <!-- 전송 버튼 -->
                <button class="icon-btn submit-btn" @click="submitPrompt" title="전송">
                    <i class="pi pi-send"></i>
                </button>
            </div>

            <!-- 필터 버튼 그룹 -->
            <div class="filter-buttons">
                <button v-for="filter in filters" :key="filter.id"
                    :class="['filter-btn', { active: activeFilter === filter.id }]" @click="setActiveFilter(filter.id)">
                    {{ filter.label }}
                </button>
            </div>
        </div>

        <!-- 챗봇 응답 표시 영역 -->
        <div class="chat-response-area">
            <p v-if="!chatResponse" class="placeholder-text">에이전트에게 출장 자동 예약을 요청하세요.</p>
            <p v-else class="response-text">{{ chatResponse }}</p>
        </div>
    </div>
</template>

<script>
import CompanyMenu from '../workspace/CompanyMenu.vue';

export default {
    name: 'MainScreen',
    components: {
        CompanyMenu,
    },
    data() {
        return {
            prompt: '', // 사용자 입력 프롬프트
            activeFilter: 'all', // 현재 활성화된 필터
            filters: [ // 필터 목록
                { id: 'all', label: '숙소+항공' },
                { id: 'data', label: '숙소' },
                { id: 'accuracy', label: '항공' },
            ],
            chatResponse: '', // 챗봇 응답 (임시)
            isFocusMode: false // 검색 초점 모드 상태
        };
    },
    methods: {
        // 프롬프트 제출 로직
        submitPrompt() {
            if (!this.prompt.trim()) return; // 입력 내용이 없으면 무시
            console.log(`프롬프트 제출: ${this.prompt}, 필터: ${this.activeFilter}`);
            // TODO: 실제 챗봇 API 연동 로직 구현
            // 예시: this.chatResponse = `"${this.prompt}"에 대한 응답입니다. (필터: ${this.activeFilter})`;
            this.prompt = ''; // 입력창 비우기
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

.icon-btn:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
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
}
</style>