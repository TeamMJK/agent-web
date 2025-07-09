<template>
  <div class="sensitive-info-container">
    <h1 class="title">민감 정보 입력</h1>
    <p class="description">서비스 이용을 위해 추가 정보를 입력해주세요.</p>

    <form @submit.prevent="handleSubmit" class="sensitive-info-form">
      <div class="form-group">
        <label for="name">이름(한글)</label>
        <input type="text" id="name" v-model="formData.name" placeholder="예: 홍길동" required />
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label for="firstName">성(영문)</label>
          <input type="text" id="firstName" v-model="formData.firstName" placeholder="예: HONG" required />
        </div>
        <div class="form-group half">
          <label for="lastName">이름(영문)</label>
          <input type="text" id="lastName" v-model="formData.lastName" placeholder="예: GILDONG" required />
        </div>
      </div>
      <div class="form-group">
        <label for="phoneNumber">전화번호(+82)</label>
        <input type="tel" id="phoneNumber" v-model="formData.phoneNumber" placeholder="예: 1012345678" required />
      </div>
      <div class="form-group">
        <label for="gender">성별</label>
        <select id="gender" v-model="formData.gender" required>
          <option value="">선택</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>
      <div class="form-group">
        <label for="birthDate">생년월일</label>
        <input type="date" id="birthDate" v-model="formData.birthDate" placeholder="YYYY-MM-DD" required />
      </div>

      <button type="submit" class="submit-btn">저장하고 계속하기</button>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'SensitiveInfoForm',
  data() {
    return {
      formData: {
        name: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        birthDate: '',
        // passportNumber: '', // Removed
        // passportExpireDate: '', // Removed
      },
      errorMessage: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = '';

      // Validation for name (Korean characters only)
      const koreanRegex = /^[가-힣]+$/;
      if (!koreanRegex.test(this.formData.name)) {
        this.errorMessage = '이름은 한글만 입력해주세요.';
        return;
      }

      // Validation for firstName and lastName (English uppercase letters only)
      const uppercaseEnglishRegex = /^[A-Z]+$/;
      if (!uppercaseEnglishRegex.test(this.formData.firstName)) {
        this.errorMessage = '성은 영문 대문자만 입력해주세요.';
        return;
      }
      if (!uppercaseEnglishRegex.test(this.formData.lastName)) {
        this.errorMessage = '이름(영문)은 영문 대문자만 입력해주세요.';
        return;
      }

      try {
        const response = await api.post('/members/sensitive-member-info', this.formData);
        console.log('민감 정보 저장 성공:', response.data);
        this.$router.push('/main'); // Redirect to main page on success
      } catch (error) {
        console.error('민감 정보 저장 실패:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = `저장 실패: ${error.response.data.message}`;
        } else {
          this.errorMessage = '민감 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      }
    },
  },
};
</script>

<style scoped>
.sensitive-info-container {
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

.sensitive-info-form .form-group {
  margin-bottom: 20px;
}

.sensitive-info-form label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #ccc;
}

.sensitive-info-form input[type="text"],
.sensitive-info-form input[type="tel"],
.sensitive-info-form input[type="date"],
.sensitive-info-form select {
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

.sensitive-info-form input:focus,
.sensitive-info-form select:focus {
  border-color: #4A90E2;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row .form-group.half {
  flex: 1;
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
