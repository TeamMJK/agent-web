import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'primeicons/primeicons.css';
import './styles/variables.css'; // 전역 CSS 파일

const app = createApp(App);

app.use(router);

app.mount('#app');