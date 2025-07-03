<template>
  <nav class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <button class="sidebar-logo-button" @click="goToHome">
        <!-- <img src="../assets/logo.png" alt="Logo" class="logo-icon" /> -->
        <span class="logo-text" v-if="!isCollapsed">TripAgent</span>
      </button>
      <button class="toggle-btn" @click="toggleSidebar">
        <i :class="isCollapsed ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'"></i>
      </button>
    </div>
    <ul class="menu-items">
      <li :class="{ active: $route.name === 'Main' }">
        <router-link to="/main">
          <i class="pi pi-home"></i>
          <span class="menu-text" v-if="!isCollapsed">메인</span>
        </router-link>
      </li>
      <li :class="{ active: $route.name === 'WorkSpace' }">
        <router-link to="/workspace">
          <i class="pi pi-briefcase"></i>
          <span class="menu-text" v-if="!isCollapsed">워크스페이스</span>
        </router-link>
      </li>
    </ul>
    <div class="sidebar-footer">
      <button class="footer-button" @click="logout">
        <i class="pi pi-sign-out"></i>
        <span class="menu-text" v-if="!isCollapsed">로그아웃</span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppSidebar",
  props: {
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goToHome() {
      this.$router.push('/main');
    },
    logout() {
      // Implement logout logic here
      this.$router.push('/');
    },
    toggleSidebar() {
      this.$emit('update:isCollapsed', !this.isCollapsed);
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: #1e1e1e;
  border-right: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  transition: width 0.3s ease, border-radius 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sidebar.collapsed {
  width: 80px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.sidebar-logo-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #f0f0f0;
  flex-grow: 1;
  justify-content: flex-start;
}

.logo-icon {
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  transition: transform 0.3s ease;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-logo-button:hover .logo-icon {
    transform: rotate(15deg);
}

.toggle-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.toggle-btn:hover {
  background-color: #2c2c2e;
  color: #ffffff;
}

.menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.menu-items li {
  margin-bottom: 0.5rem;
}

.menu-items a, .footer-button {
  display: flex;
  align-items: center;
  padding: 0.9rem 1.2rem;
  border-radius: 8px;
  color: #a0a0a0;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-size: 1rem;
  font-weight: 500;
}

.sidebar.collapsed .menu-items a, .sidebar.collapsed .footer-button {
  justify-content: center;
  padding: 0.9rem 0;
}

.menu-items a:hover, .footer-button:hover {
  background-color: #2c2c2e;
  color: #ffffff;
}

.menu-items li.active a {
  background-color: #3a6ffb;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(58, 111, 251, 0.3);
}

.menu-items a i, .footer-button i {
  font-size: 1.4rem;
  margin-right: 1rem;
  transition: transform 0.3s ease;
}

.sidebar.collapsed .menu-items a i, .sidebar.collapsed .footer-button i {
  margin-right: 0;
}

.menu-items a:hover i, .footer-button:hover i {
    transform: scale(1.1);
}

.menu-text {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .menu-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-footer {
  margin-top: auto;
  padding-bottom: 2rem; /* 로그아웃 버튼이 잘리지 않도록 패딩 추가 */
}

.footer-button {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
