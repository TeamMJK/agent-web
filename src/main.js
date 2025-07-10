import { createApp } from 'vue';
import App from './App.vue';
import routes from './router';
import 'primeicons/primeicons.css';
import './styles/variables.css'; // 전역 CSS 파일
import './styles/scrollbar.css' // 전역 스크롤바 스타일

const app = createApp(App);

app.use(routes);

app.mount('#app');