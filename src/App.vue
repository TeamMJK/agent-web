<template>
  <!--  eslint-disable-next-line vue/no-multiple-template-root -->
  <div v-if="showSidebar" id="app-container">
    <AppSidebar />
    <main class="main-content">
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

.main-content {
  flex-grow: 1;
  padding: 2rem;
  box-sizing: border-box;
  margin-left: 112px; /* 사이드바 너비(80px) + 좌우 마진(32px) */
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
