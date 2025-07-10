<template>
  <div class="login-container">
    <!-- 기존 로그인 UI가 여기에 있다고 가정합니다. -->
    <h1>로그인</h1>
    <button @click="handleLogin">카카오 로그인</button>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { apiService } from '@/services/api';

export default {
  name: 'LoginView',
  data() {
    return {
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      // 이 부분은 실제 소셜 로그인 로직으로 대체되어야 합니다.
      // 로그인 성공 후 토큰을 받았다고 가정합니다.
      console.log('로그인 시도...');
      
      // 로그인 성공 후 민감 정보 확인 및 리디렉션
      await this.checkSensitiveInfoAndRedirect();
    },
    async checkSensitiveInfoAndRedirect() {
      try {
        // 1-2. 로그인한 사용자의 민감정보 조회가 성공했을때 (메인페이지로 이동)
        await apiService.user.getMe();
        this.$router.push('/main');
      } catch (error) {
        // 1-1. 로그인한 사용자의 민감정보가 없을때 (민감정보 입력으로 리다이렉트)
        if (error.response && error.response.status === 500) {
          this.$router.push('/sensitive-info');
        } else {
          // 기타 예외 처리
          console.error('An unexpected error occurred:', error);
          this.errorMessage = '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      }
    }
  },
  mounted() {
    // 페이지 로드 시 URL에 특정 파라미터(예: code)가 있는 경우,
    // 소셜 로그인 콜백으로 간주하고 로그인 처리를 시작할 수 있습니다.
    // const code = this.$route.query.code;
    // if (code) {
    //   this.handleLogin(code);
    // }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
