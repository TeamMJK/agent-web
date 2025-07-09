<template>
  <!--  eslint-disable-next-line vue/no-multiple-template-root -->
  <div v-if="showSidebar" id="app-container">
    <AppSidebar />
    <main :class="['main-content', { 'workspace-layout': isWorkspace }]">
      <router-view />
    </main>
  </div>
  <router-view v-else />
</template>

<script>
import AppSidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    AppSidebar
  },
  computed: {
    showSidebar() {
      return this.$route.name !== 'Login';
    },
    isWorkspace() {
      return this.$route.name === 'WorkSpace';
    },
  },
};
</script>

<style>
/* 전역 스타일 */
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #1a1a1a;
    color: #E0E0E0;
    overflow: hidden;
}

#app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  background-color: #1a1a1a;
  box-sizing: border-box;
  margin-left: 112px; /* 사이드바 너비(80px) + 좌우 마진(32px) */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: auto;
  overflow-y: auto;
  min-height: 100vh;
}

.main-content.workspace-layout {
  margin-left: 112px;
  justify-content: flex-start;
  align-items: stretch;
  overflow: hidden;
}

/* 버튼 기본 스타일 */
button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin: 5px;
    font-family: inherit;
}

/* 반응형 조정 */
@media (max-width: 768px) {
    .main-content {
        margin-left: 96px;
    }
    
    .main-content.workspace-layout {
        margin-left: 96px;
    }
}

@media (max-width: 480px) {
    .main-content {
        margin-left: 80px;
    }
    
    .main-content.workspace-layout {
        margin-left: 80px;
    }
}
</style>
