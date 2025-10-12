<template>
  <div class="agoda-list-screen">
    <!-- 헤더 영역 -->
    <div class="header-section">
      <button class="back-button" @click="goBack">
        <i class="pi pi-arrow-left"></i>
        <span>돌아가기</span>
      </button>
      <h1 class="page-title">호텔 검색 결과</h1>
      <div class="search-info">
        <i class="pi pi-map-marker"></i>
        <span>{{ destination }}</span>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">호텔 정보를 불러오는 중...</p>
    </div>

    <!-- 에러 메시지 -->
    <BaseMessage v-if="errorMessage" type="error" @close="errorMessage = ''">
      {{ errorMessage }}
    </BaseMessage>

    <!-- 호텔 리스트 -->
    <div v-if="!isLoading && hotels.length > 0" class="hotels-container">
      <div class="results-count">
        <i class="pi pi-list"></i>
        <span>총 {{ hotels.length }}개의 호텔을 찾았습니다</span>
      </div>

      <div class="hotels-grid">
        <div v-for="hotel in hotels" :key="hotel.hotelId" class="hotel-card">
          <!-- 호텔 이미지 -->
          <div class="hotel-image-wrapper">
            <img 
              :src="hotel.imageURL" 
              :alt="hotel.hotelName"
              class="hotel-image"
              @error="handleImageError"
            />
            <div v-if="hotel.discountPercentage > 0" class="discount-badge">
              -{{ hotel.discountPercentage }}%
            </div>
            <div v-if="hotel.freeWifi" class="wifi-badge">
              <i class="pi pi-wifi"></i>
            </div>
          </div>

          <!-- 호텔 정보 -->
          <div class="hotel-content" :class="{ 'expanded': hotel.showDetails }">
            <!-- 호텔 이름 및 평점 -->
            <div class="hotel-header">
              <h3 class="hotel-name">{{ hotel.hotelName }}</h3>
              <div class="rating-section">
                <div class="star-rating">
                  <i 
                    v-for="n in 5" 
                    :key="n" 
                    class="pi"
                    :class="n <= Math.floor(hotel.starRating) ? 'pi-star-fill' : 'pi-star'"
                  ></i>
                  <span class="star-value">{{ hotel.starRating.toFixed(1) }}</span>
                </div>
                <div v-if="hotel.reviewScore" class="review-score">
                  <i class="pi pi-comments"></i>
                  <span>{{ hotel.reviewScore.toFixed(1) }}</span>
                </div>
              </div>
            </div>

            <!-- 호텔 특징 -->
            <div class="hotel-features">
              <div v-if="hotel.includeBreakfast" class="feature-tag">
                <i class="pi pi-check-circle"></i>
                <span>조식 포함</span>
              </div>
              <div v-if="hotel.freeWifi" class="feature-tag">
                <i class="pi pi-wifi"></i>
                <span>무료 Wi-Fi</span>
              </div>
            </div>

            <!-- 호텔 상세 정보 -->
            <div 
              v-if="hotel.agodaHotelInfo && hasHotelDetails(hotel)" 
              class="hotel-details-wrapper"
              :class="{ 'expanded': hotel.showDetails }"
            >
              <div class="hotel-details">
                <div v-if="hotel.agodaHotelInfo.advantage" class="detail-item">
                  <div class="detail-label">
                    <i class="pi pi-thumbs-up"></i>
                    <span>장점</span>
                  </div>
                  <p class="detail-text">{{ hotel.agodaHotelInfo.advantage }}</p>
                </div>
                
                <div v-if="hotel.agodaHotelInfo.disadvantage" class="detail-item">
                  <div class="detail-label">
                    <i class="pi pi-thumbs-down"></i>
                    <span>단점</span>
                  </div>
                  <p class="detail-text">{{ hotel.agodaHotelInfo.disadvantage }}</p>
                </div>

                <div v-if="hotel.agodaHotelInfo.touristAttraction" class="detail-item">
                  <div class="detail-label">
                    <i class="pi pi-map"></i>
                    <span>관광지</span>
                  </div>
                  <p class="detail-text">{{ hotel.agodaHotelInfo.touristAttraction }}</p>
                </div>

                <div v-if="hotel.agodaHotelInfo.restaurant" class="detail-item">
                  <div class="detail-label">
                    <i class="pi pi-shopping-bag"></i>
                    <span>레스토랑</span>
                  </div>
                  <p class="detail-text">{{ hotel.agodaHotelInfo.restaurant }}</p>
                </div>
              </div>
              
              <!-- 더보기 버튼 (상세 정보가 잘린 경우에만) -->
              <button 
                v-if="!hotel.showDetails"
                class="expand-details-btn"
                @click="toggleDetails(hotel)"
              >
                <i class="pi pi-chevron-down"></i>
                <span>더보기</span>
              </button>
            </div>

            <!-- 가격 및 예약 버튼 -->
            <div class="hotel-footer">
              <div class="price-section">
                <div v-if="hotel.crossedOutRate && hotel.crossedOutRate > 0" class="original-price">
                  {{ formatPrice(hotel.crossedOutRate, hotel.currency) }}
                </div>
                <div class="current-price">
                  <span class="price-amount">{{ formatPrice(hotel.dailyRate, hotel.currency) }}</span>
                  <span class="price-unit">/박</span>
                </div>
              </div>
              <a 
                :href="hotel.landingURL" 
                target="_blank" 
                rel="noopener noreferrer"
                class="book-button"
              >
                <span>예약하기</span>
                <i class="pi pi-external-link"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 결과 없음 -->
    <div v-if="!isLoading && hotels.length === 0 && !errorMessage" class="no-results">
      <i class="pi pi-inbox"></i>
      <h3>검색 결과가 없습니다</h3>
      <p>다른 검색어로 다시 시도해주세요</p>
    </div>

    <!-- 리뷰 모달 -->
    <ReviewModal
      :show="showReviewModal"
      @close="closeReviewModal"
      @submit="handleReviewSubmit"
    />
  </div>
</template>

<script>
import BaseMessage from '@/components/common/BaseMessage.vue';
import ReviewModal from '@/components/common/ReviewModal.vue';
import { apiService } from '@/services/api.js';
import { pushMessage } from '@/utils/notify.js';

export default {
  name: 'AgodaListScreen',
  components: {
    BaseMessage,
    ReviewModal
  },
  data() {
    return {
      hotels: [],
      destination: '',
      isLoading: false,
      errorMessage: '',
      showReviewModal: false
    };
  },
  created() {
    // 쿼리 파라미터에서 응답 데이터 받기
    if (this.$route.query.responseData) {
      try {
        const responseData = JSON.parse(this.$route.query.responseData);
        
        // 응답이 배열인 경우 첫 번째 요소 사용
        const data = Array.isArray(responseData) ? responseData[0] : responseData;
        
        // 각 호텔에 showDetails 속성 추가
        this.hotels = (data.results || []).map(hotel => ({
          ...hotel,
          showDetails: false
        }));
        this.destination = data.destination || '';
        
        console.log(`로드된 호텔 수: ${this.hotels.length}개, 목적지: ${this.destination}`);
        
        // 호텔 데이터를 성공적으로 받았으면 리뷰 모달 표시
        if (this.hotels.length > 0) {
          this.checkAndShowReviewModal();
        }
      } catch (error) {
        console.error('응답 데이터 파싱 오류:', error);
        this.errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.';
      }
    } else {
      this.errorMessage = '검색 결과가 없습니다.';
    }
  },
  methods: {
    goBack() {
      this.$router.push('/main');
    },
    toggleDetails(hotel) {
      // Vue 3의 반응성을 위해 새 배열로 업데이트
      const index = this.hotels.findIndex(h => h.hotelId === hotel.hotelId);
      if (index !== -1) {
        this.hotels[index] = {
          ...this.hotels[index],
          showDetails: !this.hotels[index].showDetails
        };
      }
    },
    hasHotelDetails(hotel) {
      const info = hotel.agodaHotelInfo;
      return info && (info.advantage || info.disadvantage || info.touristAttraction || info.restaurant);
    },
    formatPrice(price, currency) {
      if (!price) return '-';
      const formatter = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: currency || 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      return formatter.format(price);
    },
    handleImageError(event) {
      // 이미지 로드 실패 시 기본 이미지로 대체
      event.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
    },
    // 리뷰 존재 여부 확인 후 모달 표시
    async checkAndShowReviewModal() {
      try {
        const existingReview = await apiService.getReview();
        
        // 200 OK로 리뷰가 반환되면 이미 작성한 사용자
        if (existingReview) {
          console.log('이미 리뷰를 작성한 사용자입니다.');
          return;
        }
        
        // 리뷰가 없으면 모달 표시 (약간의 딜레이 후)
        setTimeout(() => {
          this.showReviewModal = true;
        }, 1500); // 1.5초 후 표시
        
      } catch (error) {
        // 에러 발생 시에도 리뷰 모달 표시 (네트워크 오류 등)
        console.log('리뷰 확인 중 오류 발생, 리뷰 모달을 표시합니다:', error);
        setTimeout(() => {
          this.showReviewModal = true;
        }, 1500);
      }
    },
    // 리뷰 모달 닫기
    closeReviewModal() {
      this.showReviewModal = false;
    },
    // 리뷰 제출 완료
    handleReviewSubmit(response) {
      console.log('리뷰 제출 완료:', response);
      pushMessage({ type: 'success', text: '소중한 리뷰 감사합니다!' });
    }
  }
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

.agoda-list-screen {
  font-family: "Pretendard Variable", Pretendard, sans-serif;
  min-height: 100vh;
  background-color: var(--bg-primary, #1a1a1a);
  color: var(--text-primary, #ffffff);
  padding: 2rem;
  padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2 + 2rem);
}

@media (max-width: 768px) {
  .agoda-list-screen {
    padding-left: 1rem;
  }
}

/* 헤더 영역 */
.header-section {
  max-width: 1400px;
  margin: 0 auto 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--text-secondary, #888888);
  font-size: 0.95rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.back-button:hover {
  color: var(--text-primary, #ffffff);
  background-color: rgba(255, 255, 255, 0.05);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  letter-spacing: -1px;
}

.search-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary, #888888);
  font-size: 1.1rem;
}

.search-info i {
  color: var(--color-primary, #4f86f7);
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1.5rem;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--color-primary, #4f86f7);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: 0.2s;
  border-top-color: rgba(79, 134, 247, 0.6);
}

.spinner-ring:nth-child(3) {
  animation-delay: 0.4s;
  border-top-color: rgba(255, 255, 255, 0.6);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  color: var(--text-secondary, #888888);
  margin: 0;
}

/* 호텔 리스트 */
.hotels-container {
  max-width: 1400px;
  margin: 0 auto;
}

.results-count {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: var(--text-secondary, #888888);
}

.results-count i {
  color: var(--color-primary, #4f86f7);
}

.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

/* 호텔 카드 */
.hotel-card {
  background-color: var(--bg-secondary, #232323);
  border: 1px solid var(--border-color, #333333);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: var(--color-primary, #4f86f7);
}

.hotel-image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #e74c3c;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.wifi-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.hotel-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 호텔 헤더 */
.hotel-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hotel-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #ffffff);
  line-height: 1.4;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-rating .pi {
  color: #ffa500;
  font-size: 0.9rem;
}

.star-value {
  margin-left: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary, #888888);
}

.review-score {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: var(--text-secondary, #888888);
}

.review-score i {
  color: var(--color-primary, #4f86f7);
}

/* 호텔 특징 */
.hotel-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: rgba(79, 134, 247, 0.1);
  border: 1px solid rgba(79, 134, 247, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--color-primary, #4f86f7);
}

.feature-tag i {
  font-size: 0.8rem;
}

/* 호텔 상세 정보 래퍼 */
.hotel-details-wrapper {
  position: relative;
  flex-shrink: 0;
}

.hotel-details-wrapper:not(.expanded) {
  max-height: 200px;
  overflow: hidden;
}

.hotel-details-wrapper.expanded {
  max-height: none;
  overflow: visible;
}

/* 호텔 상세 정보 */
.hotel-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

/* 블러 효과 오버레이 */
.hotel-details-wrapper:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-secondary, #232323));
  pointer-events: none;
  z-index: 1;
}

/* 더보기 버튼 */
.expand-details-btn {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: var(--bg-secondary, #232323);
  border: 1px solid var(--color-primary, #4f86f7);
  border-radius: 16px;
  color: var(--color-primary, #4f86f7);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.expand-details-btn:hover {
  background-color: var(--color-primary, #4f86f7);
  color: white;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 3px 10px rgba(79, 134, 247, 0.4);
}

.expand-details-btn i {
  font-size: 0.7rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary, #888888);
}

.detail-label i {
  font-size: 0.85rem;
  color: var(--color-primary, #4f86f7);
}

.detail-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-primary, #ffffff);
  line-height: 1.5;
}

/* 호텔 푸터 */
.hotel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, #333333);
  margin-top: auto;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.original-price {
  font-size: 0.9rem;
  color: var(--text-secondary, #888888);
  text-decoration: line-through;
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary, #4f86f7);
}

.price-unit {
  font-size: 0.9rem;
  color: var(--text-secondary, #888888);
}

.book-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: var(--color-primary, #4f86f7);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.book-button:hover {
  background-color: #357ABD;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 134, 247, 0.3);
}

.book-button i {
  font-size: 0.9rem;
}

/* 결과 없음 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  text-align: center;
}

.no-results i {
  font-size: 4rem;
  color: var(--text-secondary, #888888);
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #ffffff);
}

.no-results p {
  font-size: 1rem;
  margin: 0;
  color: var(--text-secondary, #888888);
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .hotels-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .agoda-list-screen {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .hotels-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .hotel-card {
    border-radius: 12px;
  }

  .hotel-image-wrapper {
    height: 200px;
  }

  .hotel-content {
    padding: 1rem;
  }

  .hotel-name {
    font-size: 1.1rem;
  }

  .hotel-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .book-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .agoda-list-screen {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .search-info {
    font-size: 0.95rem;
  }
}
</style>
