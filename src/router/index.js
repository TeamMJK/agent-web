import { createRouter, createWebHistory } from 'vue-router';
import MainScreen from '../components/layout/MainScreen.vue';
import WorkSpaceScreen from '../components/workspace/WorkSpaceScreen.vue';
import SensitiveInfoForm from '../components/forms/SensitiveInfoForm.vue';
import LoginScreen from '../components/auth/LoginScreen.vue';
import { apiService, tokenManager } from '../services/api';

const routes = [
  {
    path: '/',
    redirect: '/main',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginScreen, // 컴포넌트 이름 수정
    meta: { requiresAuth: false, hideUI: true },
  },
  {
    path: '/main',
    name: 'MainScreen',
    component: MainScreen,
    meta: { requiresAuth: true },
  },
  {
    path: '/workspace',
    name: 'WorkSpaceScreen',
    component: WorkSpaceScreen,
    meta: { requiresAuth: true },
  },
  {
    path: '/sensitive-info',
    name: 'SensitiveInfoForm',
    component: SensitiveInfoForm,
    meta: { requiresAuth: true, hideUI: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const hasToken = tokenManager.hasValidToken();

  if (requiresAuth && !hasToken) {
    // 인증이 필요한 페이지에 토큰 없이 접근 시 로그인 페이지로 리디렉션
    return next('/login');
  }

  if (to.path === '/login' && hasToken) {
    // 토큰이 있는데 로그인 페이지 접근 시 메인 페이지로 리디렉션
    return next('/main');
  }

  if (requiresAuth && hasToken) {
    // 인증이 필요한 페이지 접근 시 민감 정보 확인
    try {
      await apiService.user.getProfile();
      // 민감 정보가 있으면, sensitive-info 페이지 접근 시 main으로 리디렉션
      if (to.path === '/sensitive-info') {
        return next('/main');
      }
    } catch (error) {
      // 500 에러는 민감 정보가 없다는 의미
      if (error.response && error.response.status === 500) {
        // 민감 정보가 없으면 sensitive-info 페이지로 리디렉션
        if (to.path !== '/sensitive-info') {
          return next('/sensitive-info');
        }
      } else {
        // 다른 종류의 에러 (네트워크 등)
        console.error('An unexpected error occurred during navigation guard:', error);
        // 여기서 로그아웃 처리나 에러 페이지로 보낼 수 있음
        tokenManager.clearTokens();
        return next('/login');
      }
    }
  }

  next();
});

export default router;
