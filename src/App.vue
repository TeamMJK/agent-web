<template>
  <div id="app" class="app-container">
    <GlobalMessages />
    <!-- 사이드바 등 공통 UI -->
    <Sidebar v-if="!$route.meta.hideUI" />
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/layout/Sidebar.vue';
import GlobalMessages from '@/components/common/GlobalMessages.vue';

export default {
  name: 'App',
  components: { Sidebar, GlobalMessages },
};
</script>

<style>
/* 전역 스타일 */
:root {
  --color-bg-primary: #1a1a1a;
  --color-text-primary: #ffffff;
  /* ... 다른 전역 변수들 ... */
}

body {
  margin: 0;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: "Pretendard", sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
  height: 100vh;
}
</style>
