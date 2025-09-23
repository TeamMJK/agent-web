<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-container" :class="{ 'expanded': showPrivacySection }">
      <div class="popup-header">
        <h2 class="popup-title">회원가입</h2>
        <button class="btn btn-close" @click="closePopup">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <form @submit.prevent="handleNext" class="signup-form">
        <!-- 이메일/비밀번호 입력 단계 -->
        <div v-if="!showPrivacySection" class="form-step">
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
                :disabled="emailVerification.isVerified"
              />
              <button 
                type="button" 
                class="verify-btn"
                @click="sendVerificationCode"
                :disabled="emailVerification.isSending || emailVerification.isVerified"
              >
                <span v-if="!emailVerification.isSending && !emailVerification.isVerified">인증</span>
                <span v-else-if="emailVerification.isSending">
                  <i class="pi pi-spinner pi-spin"></i>
                </span>
                <span v-else-if="emailVerification.isVerified">
                  <i class="pi pi-check"></i>
                </span>
              </button>
            </div>
          </div>

          <!-- 이메일 인증 코드 입력 필드 (동적 표시) -->
          <div v-if="emailVerification.showVerificationField && !emailVerification.isVerified" class="input-group">
            <label for="verificationCode">인증 번호</label>
            <div class="input-wrapper">
              <i class="pi pi-key input-icon"></i>
              <input 
                type="text" 
                id="verificationCode" 
                v-model="emailVerification.verificationCode" 
                placeholder="인증 번호를 입력하세요" 
                required 
              />
              <button 
                type="button" 
                class="verify-btn"
                @click="verifyEmailCode"
                :disabled="emailVerification.isVerifying"
              >
                <span v-if="!emailVerification.isVerifying">확인</span>
                <span v-else>
                  <i class="pi pi-spinner pi-spin"></i>
                </span>
              </button>
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
                placeholder="비밀번호를 입력하세요" 
                required 
              />
            </div>
          </div>
          
          <button type="submit" class="btn btn-submit" :disabled="isLoading || !emailVerification.isVerified">
            <span v-if="!isLoading">다음</span>
            <span v-else>
              <i class="pi pi-spinner pi-spin"></i>
              처리 중...
            </span>
          </button>
        </div>

        <!-- 개인정보 조항 단계 -->
        <div v-else class="form-step">
          <!-- 개인정보 조항 및 동의 -->
          <div class="privacy-section">
            <div class="privacy-header">
              <h3>개인정보 처리 동의</h3>
            </div>
            
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
            <button type="button" class="btn btn-back" @click="goBack" :disabled="isLoading">
              이전
            </button>
            <button type="submit" class="btn btn-submit" :disabled="isLoading || !canSignUp">
              <span v-if="!isLoading">회원가입</span>
              <span v-else>
                <i class="pi pi-spinner pi-spin"></i>
                처리 중...
              </span>
            </button>
          </div>
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
      // 이메일 인증 관련
      emailVerification: {
        isSending: false,
        isVerifying: false,
        showVerificationField: false,
        isVerified: false,
        verificationCode: ''
      },
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
      },
      showPrivacySection: false
    };
  },
  computed: {
    canSignUp() {
      return this.consent.personalInfo && 
             this.consent.passportInfo && 
             this.consent.thirdParty;
    },
    canProceedToPrivacy() {
      return this.emailVerification.isVerified;
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
      // 팝업이 닫힐 때 상태 초기화
      this.resetForm();
    },
    resetForm() {
      this.email = '';
      this.password = '';
      this.showPrivacySection = false;
      this.emailVerification = {
        isSending: false,
        isVerifying: false,
        showVerificationField: false,
        isVerified: false,
        verificationCode: ''
      };
      this.consent = {
        personalInfo: false,
        passportInfo: false,
        thirdParty: false,
        optional: false
      };
      this.consentAll = false;
      this.showDetails = {
        personalInfo: false,
        passportInfo: false,
        thirdParty: false,
        optional: false
      };
      this.message.show = false;
    },
    async handleNext() {
      this.message.show = false;

      if (!this.showPrivacySection) {
        // 이메일/비밀번호 입력 단계에서 다음 단계로 이동
        if (!this.email) {
          this.showMessage('error', '이메일을 입력해주세요.');
          return;
        }
        if (!this.password) {
          this.showMessage('error', '비밀번호를 입력해주세요.');
          return;
        }
        // 이메일 형식 검증
        if (!/^[^@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
          this.showMessage('error', '유효한 이메일 주소를 입력해주세요.');
          return;
        }
        // 이메일 인증 확인
        if (!this.emailVerification.isVerified) {
          this.showMessage('error', '이메일 인증을 완료해주세요.');
          return;
        }

        // 개인정보 조항 단계로 이동
        this.showPrivacySection = true;
      } else {
        // 개인정보 동의 단계에서 회원가입 처리
        await this.handleSignUp();
      }
    },
    goBack() {
      this.showPrivacySection = false;
      this.message.show = false;
    },
    async handleSignUp() {
      // 필수 동의 항목 확인
      if (!this.canSignUp) {
        this.showMessage('error', '필수 개인정보 처리 동의 항목을 모두 체크해주세요.');
        return;
      }

      this.isLoading = true;

      try {
        const response = await apiService.auth.register({
          email: this.email,
          password: this.password,
          consents: {
            personalInfo: this.consent.personalInfo,
            passportInfo: this.consent.passportInfo,
            thirdParty: this.consent.thirdParty,
            optional: this.consent.optional
          }
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
    },

    // 이메일 인증 코드 발송
    async sendVerificationCode() {
      if (!this.email) {
        this.showMessage('error', '이메일을 입력해주세요.');
        return;
      }
      
      // 이메일 형식 검증
      if (!/^[^@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.showMessage('error', '유효한 이메일 주소를 입력해주세요.');
        return;
      }

      this.emailVerification.isSending = true;
      this.message.show = false;

      try {
        await apiService.auth.sendVerificationCode(this.email);
        this.emailVerification.showVerificationField = true;
        this.showMessage('success', '인증 코드가 이메일로 발송되었습니다.');
      } catch (error) {
        console.error('인증 코드 발송 실패:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.showMessage('error', error.response.data.message);
        } else {
          this.showMessage('error', '인증 코드 발송 중 오류가 발생했습니다.');
        }
      } finally {
        this.emailVerification.isSending = false;
      }
    },

    // 이메일 인증 코드 검증
    async verifyEmailCode() {
      if (!this.emailVerification.verificationCode) {
        this.showMessage('error', '인증 코드를 입력해주세요.');
        return;
      }

      this.emailVerification.isVerifying = true;
      this.message.show = false;

      try {
        await apiService.auth.verifyEmail(this.email, this.emailVerification.verificationCode);
        this.emailVerification.isVerified = true;
        this.showMessage('success', '이메일 인증이 완료되었습니다.');
      } catch (error) {
        console.error('이메일 인증 실패:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.showMessage('error', error.response.data.message);
        } else {
          this.showMessage('error', '인증 코드가 올바르지 않습니다.');
        }
      } finally {
        this.emailVerification.isVerifying = false;
      }
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
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
  transition: max-width 0.3s ease;
}

.popup-container.expanded {
  max-width: 680px;
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
  gap: var(--spacing-4xl);
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.input-group label {
  color: var(--color-text-muted);
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

.input-wrapper input:disabled {
  background-color: var(--color-bg-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

/* 인증 버튼 스타일 */
.verify-btn {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.verify-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.verify-btn:disabled {
  background: var(--color-bg-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}



/* 인증 완료된 이메일 필드 스타일 */
.input-wrapper input:disabled {
  background-color: var(--color-bg-card);
  border-color: var(--color-success);
}

/* 입력 필드가 인증 버튼과 겹치지 않도록 패딩 조정 */
.input-wrapper:has(.verify-btn) input {
  padding-right: 80px;
}



.message-container {
  padding: 0 var(--spacing-3xl) var(--spacing-2xl);
}

/* 개인정보 조항 스타일 */
.privacy-section {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  margin-top: var(--spacing-xl);
}

.privacy-header h3 {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-lg) 0;
}

.consent-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: background-color 0.2s ease;
}

.consent-item:hover {
  background-color: var(--color-bg-card);
}

.all-consent {
  background-color: var(--color-bg-card);
  border: 2px solid var(--color-primary);
  margin-bottom: var(--spacing-xl);
}

.consent-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
  gap: var(--spacing-md);
}

.consent-checkbox {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-secondary);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.consent-checkbox:checked + .checkbox-custom {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.consent-checkbox:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.consent-text {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.required {
  color: var(--color-danger);
  font-weight: var(--font-weight-semibold);
}

.optional {
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.view-details-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: background-color 0.2s ease;
}

.view-details-btn:hover {
  background-color: var(--color-primary-light);
}

.consent-divider {
  height: 1px;
  background-color: var(--color-border-secondary);
  margin: var(--spacing-lg) 0;
}

.consent-details {
  margin-top: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-card);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);
}

.detail-section {
  margin-bottom: var(--spacing-md);
}

.detail-section h4 {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-xs) 0;
}

.detail-section p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  line-height: 1.6;
  margin: 0;
}

.third-party-table {
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin: var(--spacing-md) 0;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1px;
  background-color: var(--color-border-secondary);
}

.table-row.header {
  background-color: var(--color-bg-tertiary);
}

.table-cell {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-sm) var(--spacing-xs);
  font-size: var(--font-size-xs);
  line-height: 1.4;
}

.table-row.header .table-cell {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.table-cell {
  color: var(--color-text-secondary);
}

.btn-submit:disabled {
  background-color: var(--color-bg-disabled) !important;
  color: var(--color-text-disabled) !important;
  cursor: not-allowed !important;
  opacity: 0.6;
}

.additional-clauses {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-secondary);
}

.clause-section {
  margin-bottom: var(--spacing-lg);
}

.clause-section h4 {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-sm) 0;
}

.clause-section p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  line-height: 1.6;
  margin: 0;
}

.notice {
  background-color: var(--color-primary-light);
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.notice p {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  margin: 0;
  text-align: center;
}

.button-group {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  align-items: baseline;
}

.btn-back {
  flex: 0.8;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: top;
  box-sizing: border-box;
}

.btn-back:hover {
  background: var(--color-bg-card);
  border-color: var(--color-border-secondary);
}

.btn-submit {
  flex: 1;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: top;
  box-sizing: border-box;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-submit:disabled {
  background-color: var(--color-bg-disabled) !important;
  color: #999999 !important;
  cursor: not-allowed !important;
  opacity: 0.6;
}
@media (max-width: 480px) {
  .popup-container {
    width: 95%;
    margin: var(--spacing-lg);
    max-height: 90vh;
    overflow-y: auto;
  }

  .popup-container.expanded {
    width: 95%;
  }
  
  .popup-header,
  .signup-form {
    padding: var(--spacing-lg) var(--spacing-2xl) var(--spacing-2xl);
  }
  
  .popup-title {
    font-size: var(--font-size-xl);
  }

  .privacy-section {
    padding: var(--spacing-lg);
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .table-cell {
    border-bottom: 1px solid var(--color-border-secondary);
    padding: var(--spacing-sm);
  }

  .table-row.header .table-cell:before {
    content: attr(data-label) ': ';
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .consent-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .view-details-btn {
    align-self: flex-end;
  }

  .button-group {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .btn-back,
  .btn-submit {
    width: 100%;
  }

  /* 모바일에서 인증 버튼 크기 조정 */
  .verify-btn {
    min-width: 50px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .input-wrapper:has(.verify-btn) input {
    padding-right: 70px;
  }


}
</style>