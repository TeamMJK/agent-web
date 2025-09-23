<template>
  <div class="privacy-consent-outer">
    <div class="privacy-consent-container">
      <div class="consent-header">
        <h1 class="consent-title">개인정보 처리 동의</h1>
        <p class="consent-subtitle">서비스 이용을 위해 개인정보 처리에 동의해주세요</p>
      </div>
      
      <form @submit.prevent="handleConsent" class="consent-form">
        <!-- 개인정보 조항 -->
        <div class="privacy-section">
          <!-- 전체 동의 -->
          <div class="consent-item all-consent">
            <label class="consent-label">
              <input 
                type="checkbox" 
                v-model="consentAll" 
                @change="toggleAllConsent"
                class="consent-checkbox"
              />
              <span class="checkbox-custom"></span>
              <span class="consent-text">모든 약관에 동의합니다</span>
            </label>
          </div>

          <div class="consent-divider"></div>

          <!-- 개별 동의 항목들 -->
          <div class="consent-item">
            <label class="consent-label">
              <input 
                type="checkbox" 
                v-model="consent.personalInfo" 
                @change="updateAllConsent"
                class="consent-checkbox"
              />
              <span class="checkbox-custom"></span>
              <span class="consent-text">
                <span class="required">(필수)</span> 개인정보 처리 안내
              </span>
            </label>
            <button type="button" class="view-details-btn" @click="toggleDetails('personalInfo')">
              <i class="pi" :class="showDetails.personalInfo ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
            </button>
          </div>

          <div v-if="showDetails.personalInfo" class="consent-details">
            <div class="detail-section">
              <h4>1.1 처리 목적 및 근거</h4>
              <p>MJK는 항공권 및 호텔 등 자동화 예약 서비스를 제공하고, 오류 대응·서비스 개선, 법령상 의무 이행 등의 목적으로 아래와 같은 개인정보를 처리합니다.<br>
              본 처리는 서비스 계약 이행 및 관련 법령에 근거하여 수집·이용됩니다.(개인정보보호법 제15조제1항제2호)</p>
            </div>
            <div class="detail-section">
              <h4>1.2 수집 항목</h4>
              <p>이름(여권상 영문명 포함), 성별, 이메일 주소, 휴대전화번호, 생년월일, 서비스 이용 중 자동 생성 정보(접속로그, 기기정보, 쿠키 등)</p>
            </div>
            <div class="detail-section">
              <h4>1.3 보유 및 이용 기간</h4>
              <p>서비스 이용 기간 중 지속적으로 보관(반복적으로 예약 서비스를 제공하기 위해 필요)<br>
              베타 테스트 종료일(2025년 9월 31일) 이후 30일 이내 파기<br>
              관련 법령에서 별도 보관 기간이 정해진 경우 해당 기간까지 보관</p>
            </div>
            <div class="detail-section">
              <h4>1.4 개인정보보호책임자</h4>
              <p>이름: 최명재<br>소속: MJK 대표<br>연락처: cmj06181@naver.com / 010-9964-7303</p>
            </div>
          </div>

          <div class="consent-item">
            <label class="consent-label">
              <input 
                type="checkbox" 
                v-model="consent.passportInfo" 
                @change="updateAllConsent"
                class="consent-checkbox"
              />
              <span class="checkbox-custom"></span>
              <span class="consent-text">
                <span class="required">(필수)</span> 고유식별정보(여권정보) 처리 동의
              </span>
            </label>
            <button type="button" class="view-details-btn" @click="toggleDetails('passportInfo')">
              <i class="pi" :class="showDetails.passportInfo ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
            </button>
          </div>

          <div v-if="showDetails.passportInfo" class="consent-details">
            <p>여권정보는 개인정보보호법상 고유식별정보로 별도 동의가 필요합니다.(개인정보보호법 제24조)<br>
            반복적/상시 예약 서비스 제공을 위해 아래 정보를 지속적으로 암호화하여 보관하며, 동의 거부 시 서비스 이용이 불가할 수 있습니다.</p>
            <div class="detail-section">
              <h4>2.1 수집 항목</h4>
              <p>여권번호, 발급국가, 발급일 및 만료일, 여권상 영문성명</p>
            </div>
            <div class="detail-section">
              <h4>2.2 처리 목적</h4>
              <p>항공권 예약 및 발권대행, 사용자 편의를 위한 반복적 서비스 제공</p>
            </div>
            <div class="detail-section">
              <h4>2.3 보유 및 이용 기간</h4>
              <p>서비스 이용 기간 중 지속 보관<br>
              베타 테스트 종료일 이후 30일 이내 파기<br>
              법령상 별도의 보관 의무가 있는 경우 해당 기간까지 보관</p>
            </div>
            <div class="detail-section">
              <h4>2.4 보안 조치</h4>
              <p>KMS(Key Management Service) 기반의 암호화 저장 및 관리<br>
              안전한 암호 알고리즘 사용, 키 관리 절차 수립·이행</p>
            </div>
          </div>

          <div class="consent-item">
            <label class="consent-label">
              <input 
                type="checkbox" 
                v-model="consent.thirdParty" 
                @change="updateAllConsent"
                class="consent-checkbox"
              />
              <span class="checkbox-custom"></span>
              <span class="consent-text">
                <span class="required">(필수)</span> 개인정보 제3자 제공 동의
              </span>
            </label>
            <button type="button" class="view-details-btn" @click="toggleDetails('thirdParty')">
              <i class="pi" :class="showDetails.thirdParty ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
            </button>
          </div>

          <div v-if="showDetails.thirdParty" class="consent-details">
            <p>MJK 서비스 특성상 반복적/상시 예약 및 호텔·항공권·여행 상품 자동화를 위해 아래 외부 업체에 개인정보를 제공합니다. 동의 거부 시 관련 서비스 이용이 제한될 수 있습니다.</p>
            <div class="third-party-table">
              <div class="table-row header">
                <div class="table-cell">제공받는 자</div>
                <div class="table-cell">제공 항목</div>
                <div class="table-cell">제공 목적</div>
                <div class="table-cell">보유 및 이용 기간</div>
              </div>
              <div class="table-row">
                <div class="table-cell">국내외 항공사</div>
                <div class="table-cell">여권정보, 이름, 성별</div>
                <div class="table-cell">항공권 예약 및 발권</div>
                <div class="table-cell">예약 완료 후 항공사 정책에 따름</div>
              </div>
              <div class="table-row">
                <div class="table-cell">글로벌 여행 플랫폼 (아고다 등)</div>
                <div class="table-cell">이름, 이메일, 연락처, 여권정보</div>
                <div class="table-cell">항공권·호텔 예약 연동</div>
                <div class="table-cell">예약 완료 후 플랫폼 정책에 따름</div>
              </div>
              <div class="table-row">
                <div class="table-cell">국내 여행사</div>
                <div class="table-cell">이름, 이메일, 연락처</div>
                <div class="table-cell">호텔 예약</div>
                <div class="table-cell">예약 완료 후 7일 이내 파기</div>
              </div>
              <div class="table-row">
                <div class="table-cell">결제 서비스 제공업체</div>
                <div class="table-cell">이름, 이메일, 연락처</div>
                <div class="table-cell">결제 처리</div>
                <div class="table-cell">결제 완료 후 5년 보관</div>
              </div>
            </div>
            <p>제공은 암호화된 API 통신 및 최소한의 정보로 한정<br>
            제공받는 자의 개인정보보호 정책 사전 검토</p>
          </div>

          <div class="consent-item">
            <label class="consent-label">
              <input 
                type="checkbox" 
                v-model="consent.optional" 
                @change="updateAllConsent"
                class="consent-checkbox"
              />
              <span class="checkbox-custom"></span>
              <span class="consent-text">
                <span class="optional">(선택)</span> 선택적 정보 활용 동의
              </span>
            </label>
            <button type="button" class="view-details-btn" @click="toggleDetails('optional')">
              <i class="pi" :class="showDetails.optional ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
            </button>
          </div>

          <div v-if="showDetails.optional" class="consent-details">
            <p>더 나은 서비스 제공 및 신규 기능 안내, 피드백 요청 등을 위해 아래 정보 활용에 동의하실 수 있습니다. 동의하지 않아도 서비스 이용에는 제한이 없습니다.</p>
            <div class="detail-section">
              <h4>4.1 수집 및 활용 항목</h4>
              <p>이메일 주소, 휴대전화번호, 서비스 이용 패턴</p>
            </div>
            <div class="detail-section">
              <h4>4.2 활용 목적</h4>
              <p>서비스 개선 및 신규 기능 안내<br>
              맞춤형 예약 추천 및 고객 피드백 수집<br>
              베타 테스트 관련 공지사항 전달</p>
            </div>
            <div class="detail-section">
              <h4>4.3 보유 및 이용 기간</h4>
              <p>동의 철회 또는 베타 테스트 종료일까지</p>
            </div>
          </div>

          <!-- 추가 조항들 -->
          <div class="additional-clauses">
            <div class="clause-section">
              <h4>5. 정보주체의 권리 및 행사 방법</h4>
              <p>개인정보 열람, 정정·삭제, 처리정지, 동의 철회 요청 가능<br>
              여권정보 삭제·처리 중단 요구 시 서비스 이용 제한 가능(베타 테스트 운영 목적상 필요)<br>
              동의 철회: 마이페이지, 이메일에서 언제든 신청 가능<br>
              베타 테스트 종료 후 30일 이내 전체 개인정보 완전 파기, 파기 통지</p>
            </div>

            <div class="clause-section">
              <h4>6. 개인정보 안전성 확보 조치</h4>
              <p>기술적 보호: KMS 기반 안전한 암호화, 전송시 SSL/TLS 적용, 접근 통제, 접근 로그 관리<br>
              관리적 보호: 개인정보처리방침 수립·시행, 취급자 교육/점검, 보호조직 운영<br>
              물리적 보호: 서버실 출입 통제, 시스템 접근 기록 3년 보관<br>
              정기적 보안 점검 및 암호화 키 관리·교체</p>
            </div>

            <div class="clause-section">
              <h4>7. 개인정보 수집·이용의 법적 근거 및 서비스 특성</h4>
              <p>계약의 이행 및 관련 법령(개인정보보호법 제15조, 제24조 등) 근거<br>
              반복적·상시 예약 서비스 특성상 여권정보 등 필수 정보의 지속 보관 필요성 명시<br>
              KMS 기반 암호화 등 안전성 확보 및 투명성 강화</p>
            </div>

            <div class="notice">
              <p><strong>※ 모든 항목에 동의하실 경우 각 동의란에 체크해주시기 바랍니다.</strong></p>
            </div>
          </div>
        </div>
        
        <div class="button-group">
          <button type="submit" class="btn btn-submit" :disabled="isLoading || !canProceed">
            <span v-if="!isLoading">동의하고 계속하기</span>
            <span v-else>
              <i class="pi pi-spinner pi-spin"></i>
              처리 중...
            </span>
          </button>
        </div>
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
import BaseMessage from '../common/BaseMessage.vue';

export default {
  name: 'PrivacyConsentScreen',
  components: {
    BaseMessage
  },
  data() {
    return {
      message: {
        show: false,
        type: 'success',
        text: ''
      },
      isLoading: false,
      consent: {
        personalInfo: false,
        passportInfo: false,
        thirdParty: false,
        optional: false
      },
      consentAll: false,
      showDetails: {
        personalInfo: false,
        passportInfo: false,
        thirdParty: false,
        optional: false
      }
    };
  },
  mounted() {
    // 이미 동의한 사용자라면 바로 민감정보 입력 페이지로 이동
    const privacyConsent = sessionStorage.getItem('privacyConsent');
    if (privacyConsent) {
      const consentData = JSON.parse(privacyConsent);
      // 필수 동의 항목이 모두 체크되어 있다면 바로 이동
      if (consentData.personalInfo && consentData.passportInfo && consentData.thirdParty) {
        this.$router.push('/sensitive-info');
        return;
      }
    }
  },
  computed: {
    canProceed() {
      return this.consent.personalInfo && 
             this.consent.passportInfo && 
             this.consent.thirdParty;
    }
  },
  methods: {
    async handleConsent() {
      // 필수 동의 항목 확인
      if (!this.canProceed) {
        this.showMessage('error', '필수 개인정보 처리 동의 항목을 모두 체크해주세요.');
        return;
      }

      this.isLoading = true;

      try {
        // 세션 스토리지에 동의 상태 저장
        sessionStorage.setItem('privacyConsent', JSON.stringify({
          personalInfo: this.consent.personalInfo,
          passportInfo: this.consent.passportInfo,
          thirdParty: this.consent.thirdParty,
          optional: this.consent.optional,
          timestamp: Date.now()
        }));

        // 민감정보 입력 페이지로 이동
        this.$router.push('/sensitive-info');
      } catch (error) {
        console.error('개인정보 동의 처리 실패:', error);
        this.showMessage('error', '동의 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        this.isLoading = false;
      }
    },
    
    showMessage(type, text) {
      this.message = { show: true, type, text };
    },
    
    toggleAllConsent() {
      const allChecked = this.consentAll;
      this.consent.personalInfo = allChecked;
      this.consent.passportInfo = allChecked;
      this.consent.thirdParty = allChecked;
      this.consent.optional = allChecked;
    },
    
    updateAllConsent() {
      this.consentAll = this.consent.personalInfo && 
                       this.consent.passportInfo && 
                       this.consent.thirdParty && 
                       this.consent.optional;
    },
    
    toggleDetails(section) {
      this.showDetails[section] = !this.showDetails[section];
    }
  }
};
</script>

<style scoped>
.privacy-consent-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: #1a1a1a;
  padding: 24px;
  box-sizing: border-box;
}

.privacy-consent-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.consent-header {
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid var(--color-border-secondary);
}

.consent-title {
  font-size: 2.2rem;
  font-weight: 400;
  margin: 0 0 12px 0;
  color: #fff;
  letter-spacing: -1px;
}

.consent-subtitle {
  font-size: 1rem;
  color: #888;
  margin: 0;
}

.consent-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.privacy-section {
  padding: 24px 32px;
  max-height: 60vh;
  overflow-y: auto;
  flex: 1;
}

/* 스크롤바 스타일링 */
.privacy-section::-webkit-scrollbar {
  width: 8px;
}

.privacy-section::-webkit-scrollbar-track {
  background: transparent;
}

.privacy-section::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.privacy-section::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.consent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.all-consent {
  padding: 20px 0;
  border-bottom: 2px solid var(--color-primary);
  margin-bottom: 16px;
}

.consent-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.consent-checkbox {
  display: none;
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid #555;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.consent-checkbox:checked + .checkbox-custom {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.consent-checkbox:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.consent-text {
  color: #fff;
  font-size: 1rem;
  line-height: 1.4;
}

.all-consent .consent-text {
  font-size: 1.1rem;
  font-weight: 500;
}

.required {
  color: #ff6b6b;
  font-weight: 500;
  margin-right: 4px;
}

.optional {
  color: #4dabf7;
  font-weight: 500;
  margin-right: 4px;
}

.view-details-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.view-details-btn:hover {
  color: var(--color-primary);
}

.consent-divider {
  height: 1px;
  background: var(--color-border-secondary);
  margin: 8px 0 16px;
}

.consent-details {
  margin-top: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--color-primary);
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  color: var(--color-primary);
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.detail-section p {
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.third-party-table {
  margin: 16px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, 0.05);
}

.table-row.header {
  background: rgba(74, 171, 247, 0.1);
}

.table-cell {
  padding: 12px;
  font-size: 0.85rem;
  color: #ccc;
  background: rgba(26, 26, 26, 0.8);
}

.table-row.header .table-cell {
  color: var(--color-primary);
  font-weight: 500;
  background: rgba(74, 171, 247, 0.05);
}

.additional-clauses {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.clause-section {
  margin-bottom: 24px;
}

.clause-section h4 {
  color: var(--color-primary);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.clause-section p {
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.notice {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  text-align: center;
}

.notice p {
  color: #ffc107;
  font-size: 0.95rem;
  margin: 0;
}

.button-group {
  padding: 24px 32px;
  border-top: 1px solid var(--color-border-secondary);
  background: rgba(255, 255, 255, 0.02);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  min-height: 52px;
}

.btn-submit {
  width: 100%;
  background: var(--color-primary);
  color: #fff;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-submit:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
}

.message-container {
  padding: 0 32px 24px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .privacy-consent-outer {
    padding: 16px;
  }
  
  .privacy-consent-container {
    max-width: 100%;
  }
  
  .consent-header {
    padding: 24px 20px 16px;
  }
  
  .consent-title {
    font-size: 1.8rem;
  }
  
  .privacy-section {
    padding: 20px;
    max-height: 55vh;
  }
  
  .button-group {
    padding: 20px;
  }
  
  .message-container {
    padding: 0 20px 20px;
  }
  
  .table-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .table-cell {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .table-row:not(.header) .table-cell:before {
    content: attr(data-label) ': ';
    font-weight: 500;
    color: var(--color-primary);
    display: inline-block;
    min-width: 80px;
  }
}
</style>