import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from '../components/LoginScreen.vue'
import MainScreen from '../components/MainScreen.vue'
import WorkSpaceScreen from '../components/WorkSpaceScreen.vue'
import SensitiveInfoForm from '../components/SensitiveInfoForm.vue'
import PassportInfoForm from '../components/PassportInfoForm.vue' // New import

// 라우트 정의
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginScreen // 기본 경로를 로그인 화면으로 설정
  },
  {
    path: '/main',
    name: 'Main',
    component: MainScreen
    // 실제 앱에서는 네비게이션 가드 등을 사용하여 로그인 여부 확인 후 접근 제어
    // meta: { requiresAuth: true } 
  },
  {
    path: '/workspace',
    name: 'WorkSpace',
    component: WorkSpaceScreen
    // meta: { requiresAuth: true }
  },
  {
    path: '/sensitive-info',
    name: 'SensitiveInfo',
    component: SensitiveInfoForm
  },
  {
    path: '/passport-info',
    name: 'PassportInfo',
    component: PassportInfoForm
  }
  // 추가적인 라우트가 필요하면 여기에 정의
]

// 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // HTML5 히스토리 모드 사용
  routes
})

/*
// 네비게이션 가드 예시 (실제 구현 시 참고)
router.beforeEach((to, from, next) => {
  const isAuthenticated = false; // 실제 로그인 상태 확인 로직 필요
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' }); // 로그인이 필요한 페이지에 비로그인 상태로 접근 시 로그인 페이지로 리디렉션
  } else {
    next(); // 그 외의 경우 정상적으로 네비게이션 진행
  }
});
*/

export default router
