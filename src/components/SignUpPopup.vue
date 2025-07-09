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
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUpPopup',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    async handleSignUp() {
      try {
        const response = await axios.post('/members', {
          email: this.email,
          password: this.password,
        });
        console.log('회원가입 성공:', response.data);
        this.closePopup();
      } catch (error) {
        console.error('회원가입 실패:', error);
        // 사용자에게 에러 메시지를 보여주는 로직 추가 가능
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
  background-color: #2a2a2a;
  padding: 40px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 28px;
  cursor: pointer;
}

.popup-title {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: 600;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  color: #bbb;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: #333;
  color: #fff;
  font-size: 16px;
}

.signup-btn {
  width: 100%;
  padding: 14px;
  background-color: #2056b3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.signup-btn:hover {
  background-color: #163d7a;
}
</style>
