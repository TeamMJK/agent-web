<!-- filepath: /Users/jaeyoung/Desktop/trip-agent-web/src/components/MainScreen.vue -->
<template>
    <div class="main-container">
        <!-- 로고 텍스트 -->
        <div class="logo-text">TripAgent<span class="pro-badge">beta</span></div>

        <!-- 프롬프트 입력 영역 -->
        <div class="prompt-section">
            <div class="prompt-input-wrapper">
                <!-- 파일 업로드 아이콘 (SVG로 변경) -->
                <button class="icon-btn file-upload-btn" @click="handleFileUpload" title="파일 업로드">
                    <i class="pi pi-paperclip"></i>
                </button>

                <!-- 검색창 -->
                <input type="text" v-model="prompt" placeholder="3월1일부터 3월10일까지 도쿄로 출장 예정이야. 금연 숙소를 원하고, 최저가로 예약해줘..."
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

        <!-- 챗봇 응답 표시 영역 (구현 예정) -->
        <div class="chat-response-area">
            <!-- 여기에 챗봇의 응답이 표시됩니다. -->
            <!-- 예: <div v-for="message in messages" :key="message.id">{{ message.text }}</div> -->
            <p v-if="!chatResponse">에이전트에게 출장 자동 예약을 요청하세요.</p>
            <p v-else>{{ chatResponse }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MainScreen',
    data() {
        return {
            prompt: '', // 사용자 입력 프롬프트
            activeFilter: 'all', // 현재 활성화된 필터
            filters: [ // 필터 목록
                { id: 'all', label: '전체' },
                { id: 'data', label: '숙소' },
                { id: 'accuracy', label: '항공' }, // '정확도 ROI'로 되어있으나 이미지상 ROU로 보여 ROU로 수정
                { id: 'academic', label: '렌트카' },
                { id: 'explore', label: '맛집' }
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

/* 메인 화면 스타일 */
.main-container {
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* 변경: 수직 중앙 정렬 */
    /* 상단 정렬 */
    width: 100%;
    height: 100vh;

    /* 상단 여백 */
    box-sizing: border-box;
}

.logo-text {
    font-size: 50px;
    font-weight: 300;
    color: #E0E0E0;
    margin-bottom: 40px;
}

.logo-text .pro-badge {
    font-size: 20px;
    color: #0B70E3FF;
    /* Pro 뱃지 색상 */
    vertical-align: super;
    margin-left: 8px;
    border: 0.8px solid #317CD2FF;
    padding: 2px 6px;
    border-radius: 2px;
    font-weight: 300;
}

.prompt-section {
    width: 100%;
    max-width: 700px;
    /* 프롬프트 영역 최대 너비 */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.prompt-input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #2D2D2D;
    /* 입력창 배경 */
    border-radius: 24px;
    /* 둥근 모서리 */
    padding: 8px 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
}

.prompt-input {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    color: #E0E0E0;
    font-size: 14px;
    padding: 12px;
    outline: none;
    /* 포커스 시 테두리 제거 */
}

.prompt-input::placeholder {
    color: #6B6B6BFF;
}

.icon-btn {
    background: none;
    border: none;
    color: #A0A0A0;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    margin: 0 5px;
}

.icon-btn:hover {
    color: #E0E0E0;
}

.submit-btn {
    /* 배경색 제거 */
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    /* background-color, color 속성 제거됨 */
}

.submit-btn:hover {
    /* 배경색 제거 */
    background-color: transparent;
}


.filter-buttons {
    display: flex;
    gap: 10px;
    /* 버튼 사이 간격 */
    margin-bottom: 30px;
}

.filter-btn {
    background-color: #3A3A3A;
    color: #B0B0B0;
    padding: 8px 15px;
    border-radius: 18px;
    /* 둥근 버튼 */
    font-size: 14px;
    border: 1px solid #505050;
}

.filter-btn.active {
    background-color: #505050;
    color: #FFFFFF;
    border-color: #707070;
}

.filter-btn:hover {
    background-color: #4A4A4A;
}

.chat-response-area {
    margin-top: 10px;
    width: 100%;
    max-width: 700px;
    text-align: center;
    color: #A0A0A0;
    font-size: 14px;
    /* 실제 채팅 UI는 더 복잡하게 구성될 수 있습니다. */
}
</style>