import { createApp } from 'vue';
import App from './App.vue';
import routes from './router';
import 'primeicons/primeicons.css';
import './styles/variables.css'; // 전역 CSS 파일
import './styles/scrollbar.css' // 전역 스크롤바 스타일
import './styles/common-buttons.css'; // 공통 버튼 스타일
import './styles/common-forms.css'; // 공통 폼 스타일
import './styles/common-modals.css'; // 공통 모달 스타일
import './styles/common-utilities.css'; // 공통 유틸리티 스타일

const app = createApp(App);

app.use(routes);

app.mount('#app');