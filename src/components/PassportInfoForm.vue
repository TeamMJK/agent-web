<template>
  <div class="passport-info-container">
    <div class="header-section">
      <div class="icon-wrapper">
        <i class="pi pi-id-card"></i>
      </div>
      <h1 class="title">여권 정보 입력</h1>
      <p class="description">서비스 이용을 위해 여권 정보를 입력해주세요.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="passport-info-form">
      <div class="form-group">
        <label for="passportNumber">
          <i class="pi pi-id-card"></i>
          여권 번호
        </label>
        <input 
          type="text" 
          id="passportNumber" 
          v-model="formData.passportNumber" 
          placeholder="예: AB1234567" 
          required 
        />
      </div>
      
      <div class="form-group">
        <label for="passportExpireDate">
          <i class="pi pi-calendar"></i>
          여권 만료일
        </label>
        <input 
          type="date" 
          id="passportExpireDate" 
          v-model="formData.passportExpireDate" 
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
  name: 'PassportInfoForm',
  data() {
    return {
      formData: {
        passportNumber: '',
        passportExpireDate: '',
      },
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.errorMessage = '';
      this.isLoading = true;

      try {
        const response = await apiService.user.updatePassportInfo(this.formData);
        console.log('여권 정보 저장 성공:', response.data);
        this.$router.push('/main');
      } catch (error) {
        console.error('여권 정보 저장 실패:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = '여권 정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.passport-info-container {
  min-height: 100vh;
  background: var(--gradient-primary);
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

.passport-info-form {
  width: 100%;
  max-width: 500px;
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

.form-group input {
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

.form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-group input::placeholder {
  color: var(--color-text-placeholder);
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
  max-width: 500px;
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
  .passport-info-container {
    padding: var(--spacing-2xl) var(--spacing-lg);
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
  .passport-info-container {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .title {
    font-size: var(--font-size-2xl);
  }
  
  .form-group input {
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
  }
  
  .submit-btn {
    padding: var(--spacing-xl);
    font-size: var(--font-size-base);
  }
}
</style>
