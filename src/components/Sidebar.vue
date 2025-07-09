<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <button class="sidebar-logo-button" @click="goToHome">
        <i class="pi pi-prime"></i>
      </button>
    </div>
    <ul class="menu-items">
      <li data-label="메인" :class="{ active: $route.name === 'Main' }">
        <router-link to="/main">
          <i class="pi pi-home"></i>
        </router-link>
      </li>
      <li data-label="워크스페이스" :class="{ active: $route.name === 'WorkSpace' }">
        <router-link to="/workspace">
          <i class="pi pi-briefcase"></i>
        </router-link>
      </li>
    </ul>
    <div class="sidebar-footer">
      <button data-label="로그아웃" class="footer-button" @click="logout">
        <i class="pi pi-sign-out"></i>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppSidebar",
  methods: {
    goToHome() {
      this.$router.push('/main');
    },
    logout() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 80px;
  background-color: #1e1e1e;
  border: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: fixed;
  top: 16px;
  left: 16px;
  bottom: 16px;
  z-index: 100;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.sidebar-logo-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #f0f0f0;
  font-size: 2rem;
}

.menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.menu-items li, .sidebar-footer button {
  position: relative;
}

.menu-items a, .footer-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 0;
  color: #a0a0a0;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-items a:hover, .footer-button:hover {
  background-color: #2c2c2e;
  color: #ffffff;
}

.menu-items li.active a {
  background-color: #3a6ffb;
  color: #ffffff;
}

.menu-items a i, .footer-button i {
  font-size: 1.6rem;
}

.menu-items li:hover::after,
.sidebar-footer button:hover::after {
  content: attr(data-label);
  position: absolute;
  left: 100px; /* 사이드바 너비(80px) + 간격(20px) */
  top: 50%;
  transform: translateY(-50%);
  background-color: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 101;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.sidebar-footer {
  margin-top: auto;
}

.footer-button {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
