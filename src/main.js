import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 라우터 임포트

import 'primeicons/primeicons.css';

// Vue 앱 생성 및 라우터 사용 설정
const app = createApp(App)
app.use(router) // 라우터 플러그인 등록
app.mount('#app')
