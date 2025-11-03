import { createRouter, createWebHistory } from 'vue-router';
import MainScreen from '../components/layout/MainScreen.vue';
import WorkSpaceScreen from '../components/workspace/WorkSpaceScreen.vue';
import ReceiptScreen from '../components/receipt/ReceiptScreen.vue';
import SensitiveInfoForm from '../components/forms/SensitiveInfoForm.vue';
import LoginScreen from '../components/auth/LoginScreen.vue';
import PrivacyConsentScreen from '../components/auth/PrivacyConsentScreen.vue';
import PrivacyPolicyScreen from '../components/policy/PrivacyPolicyScreen.vue';
import TermsOfServiceScreen from '../components/policy/TermsOfServiceScreen.vue';
import PromptScreen from '../components/prompt/PromptScreen.vue';
import AgodaListScreen from '../components/prompt/AgodaListScreen.vue';
import { tokenManager } from '../services/api';

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
    path: '/prompt',
    name: 'PromptScreen',
    component: PromptScreen,
    meta: { requiresAuth: true },
  },
  {
    path: '/agoda-list',
    name: 'AgodaListScreen',
    component: AgodaListScreen,
    meta: { requiresAuth: true },
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyScreen',
    component: PrivacyPolicyScreen,
    meta: { requiresAuth: false, hideUI: true },
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfServiceScreen',
    component: TermsOfServiceScreen,
    meta: { requiresAuth: false, hideUI: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // OAuth 콜백 처리: /main?token=...&refreshToken=... 형태로 오면 쿼리 파라미터만 제거
  if (to.path === '/main' && to.query.token) {
    console.log('Google OAuth 콜백 처리 - 백엔드에서 이미 쿠키 설정됨');

    // Google OAuth 사용자임을 표시
    sessionStorage.setItem('isOAuthUser', 'true');
    console.log('라우터에서 isOAuthUser 설정:', sessionStorage.getItem('isOAuthUser'));

    // 쿼리 파라미터 제거하고 메인 페이지로 이동
    return next({ path: '/main', query: {} });
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 인증이 필요 없는 페이지 (로그인, 약관 등)는 바로 진행
  if (!requiresAuth) {
    return next();
  }

  // 인증이 필요한 페이지는 서버에 인증 상태 확인 (HttpOnly 쿠키 사용)
  if (requiresAuth) {
    // 로그인 직후에는 인증 체크 우회 (쿠키가 즉시 반영되지 않을 수 있음)
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      console.log('[라우터] 로그인 직후, 인증 체크 우회');
      sessionStorage.removeItem('justLoggedIn');
      return next();
    }

    try {
      console.log(`[라우터] ${to.path} 페이지 접근, 인증 확인 중...`);
      const isAuthenticated = await tokenManager.checkAuth();
      console.log(`[라우터] 인증 상태:`, isAuthenticated);

      if (!isAuthenticated) {
        console.log(`[라우터] 인증 실패, /login으로 리디렉션`);
        // 인증이 필요한 페이지에 토큰 없이 접근 시 로그인 페이지로 리디렉션
        return next('/login');
      }

      console.log(`[라우터] 인증 성공, ${to.path} 페이지로 진입`);
    } catch (error) {
      // 인증 확인 실패 시 로그인 페이지로 리디렉션
      console.error('[라우터] 인증 확인 중 에러:', error);
      return next('/login');
    }
  }

  // 민감정보 체크 제거 - MainScreen에서 VNC 요청 시 체크하도록 변경
  next();
});

export default router;
