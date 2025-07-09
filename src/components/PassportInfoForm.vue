<template>
  <div class="passport-info-container">
    <h1 class="title">여권 정보 입력</h1>
    <p class="description">서비스 이용을 위해 여권 정보를 입력해주세요.</p>

    <form @submit.prevent="handleSubmit" class="passport-info-form">
      <div class="form-group">
        <label for="passportNumber">여권 번호</label>
        <input type="text" id="passportNumber" v-model="formData.passportNumber" placeholder="예: AB1234567" required />
      </div>
      <div class="form-group">
        <label for="passportExpireDate">여권 만료일</label>
        <input type="date" id="passportExpireDate" v-model="formData.passportExpireDate" placeholder="YYYY-MM-DD" required />
      </div>

      <button type="submit" class="submit-btn">저장하고 계속하기</button>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'PassportInfoForm',
  data() {
    return {
      formData: {
        passportNumber: '',
        passportExpireDate: '',
      },
      errorMessage: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = '';

      try {
        const response = await api.post('/members/sensitive-passport-info', this.formData);
        console.log('여권 정보 저장 성공:', response.data);
        this.$router.push('/main'); // Redirect to main page on success
      } catch (error) {
        console.error('여권 정보 저장 실패:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = `저장 실패: ${error.response.data.message}`;
        } else {
          this.errorMessage = '여권 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      }
    },
  },
};
</script>

<style scoped>
.passport-info-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background-color: #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  color: #e0e0e0;
  font-family: "Pretendard Variable", Pretendard, sans-serif;
}

.title {
  font-size: 2rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 15px;
  color: #fff;
}

.description {
  text-align: center;
  margin-bottom: 30px;
  color: #bbb;
  font-size: 0.95rem;
}

.passport-info-form .form-group {
  margin-bottom: 20px;
}

.passport-info-form label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #ccc;
}

.passport-info-form input[type="text"],
.passport-info-form input[type="date"] {
  width: 100%;
  padding: 12px;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  outline: none;
}

.passport-info-form input:focus {
  border-color: #4A90E2;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #357ABD;
}

.error-message {
  color: #ff4d4d;
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
}
</style>
