import { createRouter, createWebHistory } from 'vue-router';
import MainScreen from '../components/layout/MainScreen.vue';
import WorkSpaceScreen from '../components/workspace/WorkSpaceScreen.vue';
import ReceiptScreen from '../components/receipt/ReceiptScreen.vue';
import SensitiveInfoForm from '../components/forms/SensitiveInfoForm.vue';
import LoginScreen from '../components/auth/LoginScreen.vue';
import PrivacyConsentScreen from '../components/auth/PrivacyConsentScreen.vue';
import TestPromptScreen from '../components/test/TestPromptScreen.vue';
import PromptScreen from '../components/prompt/PromptScreen.vue';
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
    path: '/receipt',
    name: 'ReceiptScreen',
    component: ReceiptScreen,
    meta: { requiresAuth: true },
  },
  {
    path: '/privacy-consent',
    name: 'PrivacyConsentScreen',
    component: PrivacyConsentScreen,
    meta: { requiresAuth: true, hideUI: true },
  },
  {
    path: '/sensitive-info',
    name: 'SensitiveInfoForm',
    component: SensitiveInfoForm,
    meta: { requiresAuth: true, hideUI: true },
  },
  {
    path: '/test-prompt-screen',
    name: 'TestPromptScreen',
    component: TestPromptScreen,
    meta: { requiresAuth: false, hideUI: true },
  },
  {
    path: '/prompt',
    name: 'PromptScreen',
    component: PromptScreen,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // OAuth 콜백 처리: /main?token=...&refreshToken=... 파라미터가 있으면 토큰 설정
  if (to.path === '/main' && to.query.token) {
    console.log('Google OAuth 콜백 처리 - 라우터에서 토큰 설정');
    tokenManager.setTokens(to.query.token, to.query.refreshToken || to.query.token);

    // Google OAuth 사용자임을 표시
    sessionStorage.setItem('isOAuthUser', 'true');
    console.log('라우터에서 isOAuthUser 설정:', sessionStorage.getItem('isOAuthUser'));

    // 쿼리 파라미터 제거하고 메인 페이지로 이동
    return next({ path: '/main', query: {} });
  }

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
    // 인증이 필요한 페이지 접근 시 민감 정보 확인 (민감정보 단계 제거됨)
    try {
      await apiService.user.getProfile();
      // 민감 정보가 있으면, privacy-consent나 sensitive-info 페이지 접근 시 main으로 리디렉션
      if (to.path === '/privacy-consent' || to.path === '/sensitive-info') {
        return next('/main');
      }
    } catch (error) {
      // 민감정보 단계가 제거되었으므로, 민감정보가 없어도 main으로 이동 가능
      // 500 에러가 발생해도 로그인 플로우를 계속 진행
      console.log('프로필 조회 실패 (민감정보 없음) - main으로 이동 허용');
    }
  }

  next();
});

export default router;
