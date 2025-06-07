<!-- filepath: /Users/jaeyoung/Desktop/trip-agent-web/src/App.vue -->
<template>
    <div id="app-container">
        <!-- 현재 라우트에 해당하는 컴포넌트가 렌더링되는 영역 -->
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App'
    // 전역적으로 필요한 로직이나 데이터는 여기에 정의 가능
}
</script>

<style>
/* 전역 스타일 */
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    /* body와 html이 전체 너비를 차지하도록 보장 */
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #181818FF;
    /* 전체 배경색을 어둡게 설정 */
    color: #E0E0E0;
    /* 기본 텍스트 색상 */
    overflow-x: hidden;
    /* 의도치 않은 가로 스크롤 방지 */
}

#app-container {
    width: 100vw;
    /* 뷰포트 전체 너비 사용 */
    min-height: 100vh;
    /* 최소 뷰포트 전체 높이 사용 */
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 자식 요소들(router-view)을 수평 중앙 정렬 */
    justify-content: center;
    /* 자식 요소들(router-view)을 수직 중앙 정렬 */
    box-sizing: border-box;
    /* padding과 border를 요소의 전체 크기에 포함 */
}

/* 버튼 기본 스타일 (필요에 따라 각 컴포넌트에서 오버라이드) */
button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin: 5px;
}
</style>