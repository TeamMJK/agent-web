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
/* 전역 스타일 import */
@import './styles/variables.css';
@import './styles/components.css';
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

/* 기본 리셋 */
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: var(--font-family-primary);
    background-color: var(--color-bg-primary);
    color: var(--color-text-secondary);
    overflow: hidden;
}

/* 레이아웃 */
#app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  background-color: var(--color-bg-primary);
  box-sizing: border-box;
  margin-left: var(--main-content-margin);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: auto;
  overflow-y: auto;
  min-height: 100vh;
}

.main-content.workspace-layout {
  margin-left: var(--main-content-margin);
  justify-content: flex-start;
  align-items: stretch;
  overflow: hidden;
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
    .main-content.workspace-layout {
        margin-left: 80px;
    }
