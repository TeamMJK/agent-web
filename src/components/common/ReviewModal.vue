<template>
  <BaseModal
    :show="show"
    title="서비스 리뷰"
    subtitle="서비스를 평가해주세요"
    @close="handleClose"
  >
    <div class="review-modal-content">
      <!-- 별점 선택 -->
      <FormGroup label="별점" :required="true">
        <div class="star-rating">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="star-button"
            :class="{ active: star <= rating }"
            @click="setRating(star)"
            :aria-label="`${star}점`"
          >
            <i :class="star <= rating ? 'pi pi-star-fill' : 'pi pi-star'"></i>
          </button>
        </div>
        <p class="rating-text">{{ ratingText }}</p>
      </FormGroup>

      <!-- 리뷰 내용 -->
      <FormGroup
        label="리뷰 내용"
        :error-message="errors.reviewContent"
        help-text="서비스에 대한 의견을 자유롭게 작성해주세요"
      >
        <textarea
          v-model="reviewContent"
          placeholder="리뷰를 작성해주세요..."
          rows="5"
          class="review-textarea"
          :class="{ error: errors.reviewContent }"
        ></textarea>
      </FormGroup>

      <!-- 메시지 -->
      <BaseMessage v-if="message.show" :type="message.type" @close="message.show = false">
        {{ message.text }}
      </BaseMessage>
    </div>

    <template #actions>
      <BaseButton variant="cancel" @click="handleClose" :disabled="isSubmitting">
        나중에
      </BaseButton>
      <BaseButton
        variant="confirm"
        @click="handleSubmit"
        :loading="isSubmitting"
        :disabled="!rating"
      >
        제출
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import BaseMessage from './BaseMessage.vue';
import FormGroup from './FormGroup.vue';
import apiService from '@/services/api.js';

export default {
  name: 'ReviewModal',
  components: {
    BaseModal,
    BaseButton,
    BaseMessage,
    FormGroup
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      rating: 0,
      reviewContent: '',
      isSubmitting: false,
      errors: {
        reviewContent: ''
      },
      message: {
        show: false,
        type: 'success',
        text: ''
      }
    };
  },
  computed: {
    ratingText() {
      if (this.rating === 0) return '별점을 선택해주세요';
      const texts = ['', '매우 불만족', '불만족', '보통', '만족', '매우 만족'];
      return `${this.rating}점 - ${texts[this.rating]}`;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    setRating(star) {
      this.rating = star;
      this.errors.reviewContent = '';
    },
    validateForm() {
      this.errors.reviewContent = '';
      
      if (!this.rating) {
        this.showMessage('error', '별점을 선택해주세요');
        return false;
      }
      
      if (this.reviewContent.trim() && this.reviewContent.trim().length < 5) {
        this.errors.reviewContent = '리뷰는 최소 5자 이상 입력해주세요';
        return false;
      }
      
      return true;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;
      
      this.isSubmitting = true;
      
      try {
        const reviewData = {
          rating: this.rating,
          reviewContent: this.reviewContent.trim() || ''
        };
        
        const response = await apiService.submitReview(reviewData);
        
        this.showMessage('success', '리뷰가 성공적으로 제출되었습니다');
        
        // 0.5초 후 모달 닫기
        setTimeout(() => {
          this.$emit('submit', response);
          this.handleClose();
        }, 500);
        
      } catch (error) {
        console.error('리뷰 제출 실패:', error);
        this.showMessage('error', error.message || '리뷰 제출 중 오류가 발생했습니다');
      } finally {
        this.isSubmitting = false;
      }
    },
    handleClose() {
      if (!this.isSubmitting) {
        this.$emit('close');
      }
    },
    resetForm() {
      this.rating = 0;
      this.reviewContent = '';
      this.errors.reviewContent = '';
      this.message.show = false;
    },
    showMessage(type, text) {
      this.message = {
        show: true,
        type,
        text
      };
      
      setTimeout(() => {
        this.message.show = false;
      }, 3000);
    }
  }
};
</script>

<style scoped lang="scss">
.review-modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.star-rating {
  display: flex;
  gap: 8px;
  align-items: center;
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 32px;
  color: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
  
  &.active {
    color: #ffc107;
  }
  
  i {
    pointer-events: none;
  }
}

.rating-text {
  margin-top: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-blue);
  }
  
  &.error {
    border-color: #e74c3c;
  }
  
  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .star-button {
    font-size: 28px;
    padding: 2px;
  }
  
  .review-textarea {
    font-size: 16px; /* iOS 자동 줌 방지 */
  }
}
</style>
