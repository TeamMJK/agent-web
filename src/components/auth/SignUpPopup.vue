<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-header">
        <h2 class="popup-title">회원가입</h2>
        <button class="btn btn-close" @click="closePopup">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <form @submit.prevent="handleSignUp" class="signup-form">
        <div class="input-group">
          <label for="email">이메일 주소</label>
          <div class="input-wrapper">
            <i class="pi pi-envelope input-icon"></i>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="example@email.com" 
              required 
            />
          </div>
        </div>
        
        <div class="input-group">
          <label for="password">비밀번호</label>
          <div class="input-wrapper">
            <i class="pi pi-lock input-icon"></i>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="특수문자 포함 8자 이상" 
              required 
              pattern="^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$" 
            />
          </div>
          <div class="password-hint">
            <i class="pi pi-info-circle"></i>
            <span>영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요</span>
          </div>
        </div>
        
        <button type="submit" class="btn btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">회원가입</span>
          <span v-else>
            <i class="pi pi-spinner pi-spin"></i>
            처리 중...
          </span>
        </button>
      </form>
      
      <!-- 성공/에러 메시지 -->
      <div class="message-container">
        <BaseMessage v-if="message.show" :type="message.type" @close="message.show = false">
          {{ message.text }}
        </BaseMessage>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '../../services/api';
import BaseMessage from '../common/BaseMessage.vue';
import { pushMessage } from '@/utils/notify.js';

export default {
  name: 'SignUpPopup',
  components: {
    BaseMessage
  },
  data() {
    return {
      email: '',
      password: '',
      message: {
        show: false,
        type: 'success',
        text: ''
      },
      isLoading: false,
    };
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    async handleSignUp() {
      this.message.show = false;
      this.isLoading = true;

      try {
        const response = await apiService.auth.register({
          email: this.email,
          password: this.password,
        });
  console.log('회원가입 성공:', response.data);
  // 글로벌 성공 메시지
  pushMessage({ type: 'success', text: '회원가입이 완료되었습니다. 로그인해주세요.' });
  this.closePopup();
      } catch (error) {
        console.error('회원가입 실패:', error);
        if (error.response && error.response.status === 409) {
          this.showMessage('error', '이메일이 이미 존재합니다.');
        } else if (error.response && error.response.data && error.response.data.message) {
          this.showMessage('error', error.response.data.message);
        } else {
          this.showMessage('error', '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    showMessage(type, text) {
      this.message = { show: true, type, text };
    }
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
  background-color: var(--color-bg-modal);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal);
  backdrop-filter: blur(8px);
}

.popup-container {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-2xl);
  width: 90%;
  max-width: 480px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3xl) var(--spacing-3xl) var(--spacing-xl);
  /* 구분선 제거: border-bottom 삭제하고 여백으로 구분 */
}

.popup-title {
  color: var(--color-text-primary);
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  background: var(--gradient-accent);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.close-btn:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-card-hover);
}

.signup-form {
  /* 하단 패딩 축소로 버튼/메시지와 간격 좁힘 */
  padding: var(--spacing-xl) var(--spacing-3xl) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-group label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--spacing-lg);
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) var(--spacing-5xl);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  box-sizing: border-box;
  outline: none;
}

.input-wrapper input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input-wrapper input::placeholder {
  color: var(--color-text-placeholder);
}

.password-hint {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
}

.password-hint i {
  font-size: var(--font-size-sm);
}

.message-container {
  padding: 0 var(--spacing-3xl) var(--spacing-2xl);
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .popup-container {
    width: 95%;
    margin: var(--spacing-lg);
  }
  
  .popup-header,
  .signup-form {
    padding: var(--spacing-lg) var(--spacing-2xl) var(--spacing-2xl);
  }
  
  .popup-title {
    font-size: var(--font-size-xl);
  }
}
</style>