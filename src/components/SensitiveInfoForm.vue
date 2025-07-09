<template>
  <div class="sensitive-info-container">
    <div class="header-section">
      <div class="icon-wrapper">
        <i class="pi pi-shield"></i>
      </div>
      <h1 class="title">민감 정보 입력</h1>
      <p class="description">안전한 서비스 이용을 위해 추가 정보를 입력해주세요.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="sensitive-info-form">
      <div class="form-group">
        <label for="name">
          <i class="pi pi-user"></i>
          이름(한글)
        </label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          placeholder="예: 홍길동" 
          required 
        />
      </div>
      
      <div class="form-row">
        <div class="form-group half">
          <label for="firstName">
            <i class="pi pi-id-card"></i>
            성(영문)
          </label>
          <input 
            type="text" 
            id="firstName" 
            v-model="formData.firstName" 
            placeholder="예: HONG" 
            required 
          />
        </div>
        <div class="form-group half">
          <label for="lastName">
            <i class="pi pi-id-card"></i>
            이름(영문)
          </label>
          <input 
            type="text" 
            id="lastName" 
            v-model="formData.lastName" 
            placeholder="예: GILDONG" 
            required 
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="phoneNumber">
          <i class="pi pi-phone"></i>
          전화번호
        </label>
        <div class="phone-input-wrapper">
          <span class="country-code">+82</span>
          <input 
            type="tel" 
            id="phoneNumber" 
            v-model="formData.phoneNumber" 
            placeholder="1012345678" 
            required 
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="gender">
          <i class="pi pi-users"></i>
          성별
        </label>
        <select id="gender" v-model="formData.gender" required>
          <option value="">선택해주세요</option>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="birthDate">
          <i class="pi pi-calendar"></i>
          생년월일
        </label>
        <input 
          type="date" 
          id="birthDate" 
          v-model="formData.birthDate" 
          required 
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="isLoading">
        <span v-if="!isLoading">
          <i class="pi pi-check"></i>
          저장하고 계속하기
        </span>
        <span v-else>
          <i class="pi pi-spinner pi-spin"></i>
          저장 중...
        </span>
      </button>
    </form>

    <div v-if="errorMessage" class="error-message">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
import { apiService } from '../services/api';

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
      },
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = '';
      this.isLoading = true;

      // Validation for name (Korean characters only)
      const koreanRegex = /^[가-힣\s]+$/;
      if (!koreanRegex.test(this.formData.name)) {
        this.errorMessage = '이름은 한글만 입력해주세요.';
        this.isLoading = false;
        return;
      }

      // Validation for firstName and lastName (English uppercase letters only)
      const uppercaseEnglishRegex = /^[A-Z\s]+$/;
      if (!uppercaseEnglishRegex.test(this.formData.firstName)) {
        this.errorMessage = '성은 영문 대문자만 입력해주세요.';
        this.isLoading = false;
        return;
      }
      if (!uppercaseEnglishRegex.test(this.formData.lastName)) {
        this.errorMessage = '이름(영문)은 영문 대문자만 입력해주세요.';
        this.isLoading = false;
        return;
      }

      // Phone number validation
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(this.formData.phoneNumber)) {
        this.errorMessage = '전화번호는 10-11자리 숫자로 입력해주세요.';
        this.isLoading = false;
        return;
      }

      try {
        const response = await apiService.user.updateSensitiveInfo(this.formData);
        console.log('민감 정보 저장 성공:', response.data);
        this.$router.push('/passport-info');
      } catch (error) {
        console.error('민감 정보 저장 실패:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = '민감 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.sensitive-info-container {
  min-height: 100vh;
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl) var(--spacing-2xl);
  font-family: var(--font-family-primary);
  box-sizing: border-box;
}

.header-section {
  text-align: center;
  margin-bottom: var(--spacing-5xl);
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background: var(--gradient-accent);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
}

.icon-wrapper i {
  font-size: var(--font-size-3xl);
  color: var(--color-text-primary);
}

.title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-lg);
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  margin: 0;
  line-height: 1.5;
}

.sensitive-info-form {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.form-group label i {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: var(--spacing-xl);
  background-color: var(--color-bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-family: var(--font-family-primary);
  box-sizing: border-box;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-group input::placeholder {
  color: var(--color-text-placeholder);
}

.form-group select option {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.form-row {
  display: flex;
  gap: var(--spacing-2xl);
}

.form-group.half {
  flex: 1;
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--color-bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.phone-input-wrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.country-code {
  padding: var(--spacing-xl);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-lg);
  border-right: 1px solid var(--color-border-secondary);
}

.phone-input-wrapper input {
  border: none;
  background: transparent;
  box-shadow: none;
  flex: 1;
}

.phone-input-wrapper input:focus {
  border: none;
  box-shadow: none;
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-2xl);
  background: var(--gradient-accent);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  box-shadow: var(--shadow-md);
  margin-top: var(--spacing-xl);
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background-color: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  max-width: 600px;
  width: 100%;
  box-sizing: border-box;
}

.pi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .sensitive-info-container {
    padding: var(--spacing-2xl) var(--spacing-lg);
  }
  
  .form-row {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .title {
    font-size: var(--font-size-3xl);
  }
  
  .description {
    font-size: var(--font-size-base);
  }
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .icon-wrapper i {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .sensitive-info-container {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .title {
    font-size: var(--font-size-2xl);
  }
  
  .form-group input,
  .form-group select {
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
  }
  
  .country-code {
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
  }
  
  .submit-btn {
    padding: var(--spacing-xl);
    font-size: var(--font-size-base);
  }
}
</style>
