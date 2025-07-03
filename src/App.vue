<!-- filepath: /Users/jaeyoung/Desktop/trip-agent-web/src/App.vue -->
<template>
  <div id="app-container" :class="{ 'sidebar-layout': showSidebar }">
    <AppSidebar v-if="showSidebar" v-model:is-collapsed="sidebarCollapsed" />
    <main class="main-content" :style="mainContentStyle">
      <router-view />
    </main>
  </div>
</template>

<script>
import AppSidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    AppSidebar
  },
  data() {
    return {
      sidebarCollapsed: false,
    };
  },
  computed: {
    showSidebar() {
      return this.$route.name !== 'Login';
    },
    mainContentStyle() {
      if (this.showSidebar) {
        return {
          marginLeft: this.sidebarCollapsed ? '80px' : '260px',
          width: this.sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 260px)',
        };
      }
      return {};
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #121212;
    color: #E0E0E0;
    overflow-x: hidden;
}

#app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.sidebar-layout {
  /* padding-left는 mainContentStyle에서 동적으로 설정 */
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: margin-left 0.3s ease, width 0.3s ease;
}

/* 버튼 기본 스타일 */
button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin: 5px;
    transition: background-color 0.3s, transform 0.2s;
}

button:hover {
    transform: translateY(-2px);
}
</style>