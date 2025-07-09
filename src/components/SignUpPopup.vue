<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <button class="close-btn" @click="closePopup"><i class="pi pi-times"></i></button>
      <h2 class="popup-title">회원가입</h2>
      <form @submit.prevent="handleSignUp">
        <div class="input-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" placeholder="example@email.com" required />
        </div>
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" placeholder="특수문자 포함 8자 이상" required pattern="^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$" />
        </div>
        <button type="submit" class="signup-btn">회원가입</button>
      </form>
      <p v-if="successMessage" class="message success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="message error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { apiService } from '../services/api';

export default {
  name: 'SignUpPopup',
  data() {
    return {
      email: '',
      password: '',
      successMessage: '', // Added
      errorMessage: '',   // Added
    };
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    async handleSignUp() {
      this.successMessage = ''; // Clear previous messages
      this.errorMessage = '';   // Clear previous messages

      try {
          const response = await apiService.auth.register({
          email: this.email,
          password: this.password,
        });
        console.log('회원가입 성공:', response.data);
        this.successMessage = '회원가입이 성공적으로 완료되었습니다!';
        // Delay closing to allow user to see success message
        setTimeout(() => {
            this.closePopup();
        }, 2000); // Close after 2 seconds
      } catch (error) {
        console.error('회원가입 실패:', error);
        if (error.response && error.response.data && error.response.data.message) {
            this.errorMessage = `회원가입 실패: ${error.response.data.message}`;
        } else {
            this.errorMessage = '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      }
    },
  },
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background-color: #232323;
  padding: 40px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.popup-title {
  color: #fff;
  text-align: center;
  margin: 0 0 32px 0;
  font-size: 24px;
  font-weight: 500;
  width: 100%;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.input-group {
  margin-bottom: 24px;
  width: 100%;
}

.input-group label {
  display: block;
  color: #bbb;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 16px;
  box-sizing: border-box;
  outline: none;
}

.input-group input:focus {
  border-color: #4A90E2;
}

.signup-btn {
  width: 100%;
  padding: 16px;
  background-color: #4A90E2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 16px;
}

.signup-btn:hover {
  background-color: #357ABD;
}

.message {
  text-align: center;
  margin: 8px 0 0 0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  box-sizing: border-box;
}

.success-message {
  background-color: #4CAF50;
  color: white;
}

.error-message {
  background-color: #f44336;
  color: white;
}
</style>