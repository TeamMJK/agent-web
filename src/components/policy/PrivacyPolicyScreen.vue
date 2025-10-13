<template>
  <div class="policy-page-outer">
    <div class="policy-page-container">
      <div class="policy-header">
        <button class="back-button" @click="goBack">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1 class="policy-title">개인정보처리방침</h1>
        <p class="policy-subtitle">MJK 서비스 개인정보 처리 안내</p>
      </div>
      
      <div class="policy-content">
        <div class="policy-section">
          <h2>1. 개인정보 처리 안내</h2>
          
          <div class="section-content">
            <h3>1.1 처리 목적 및 근거</h3>
            <p>MJK는 항공권 및 호텔 등 자동화 예약 서비스를 제공하고, 오류 대응·서비스 개선, 법령상 의무 이행 등의 목적으로 아래와 같은 개인정보를 처리합니다.</p>
            <p>본 처리는 서비스 계약 이행 및 관련 법령에 근거하여 수집·이용됩니다.(개인정보보호법 제15조제1항제2호)</p>
          </div>

          <div class="section-content">
            <h3>1.2 수집 항목</h3>
            <ul>
              <li>이름(여권상 영문명 포함)</li>
              <li>성별</li>
              <li>이메일 주소</li>
              <li>휴대전화번호</li>
              <li>생년월일</li>
              <li>서비스 이용 중 자동 생성 정보(접속로그, 기기정보, 쿠키 등)</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>1.3 보유 및 이용 기간</h3>
            <ul>
              <li>서비스 이용 기간 중 지속적으로 보관(반복적으로 예약 서비스를 제공하기 위해 필요)</li>
              <li>베타 테스트 종료일(2025년 9월 31일) 이후 30일 이내 파기</li>
              <li>관련 법령에서 별도 보관 기간이 정해진 경우 해당 기간까지 보관</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>1.4 개인정보보호책임자</h3>
            <ul>
              <li>이름: 최명재</li>
              <li>소속: MJK 대표</li>
              <li>연락처: mjkagent@gmail.com / 010-9964-7303</li>
            </ul>
          </div>
        </div>

        <div class="policy-section">
          <h2>2. 고유식별정보(여권정보) 처리 동의</h2>
          
          <p>여권정보는 개인정보보호법상 고유식별정보로 별도 동의가 필요합니다.(개인정보보호법 제24조)</p>
          <p>반복적/상시 예약 서비스 제공을 위해 아래 정보를 지속적으로 암호화하여 보관하며, 동의 거부 시 서비스 이용이 불가할 수 있습니다.</p>

          <div class="section-content">
            <h3>2.1 수집 항목</h3>
            <ul>
              <li>여권번호</li>
              <li>발급국가</li>
              <li>발급일 및 만료일</li>
              <li>여권상 영문성명</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>2.2 처리 목적</h3>
            <ul>
              <li>항공권 예약 및 발권대행</li>
              <li>사용자 편의를 위한 반복적 서비스 제공</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>2.3 보유 및 이용 기간</h3>
            <ul>
              <li>서비스 이용 기간 중 지속 보관</li>
              <li>베타 테스트 종료일 이후 30일 이내 파기</li>
              <li>법령상 별도의 보관 의무가 있는 경우 해당 기간까지 보관</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>2.4 보안 조치</h3>
            <ul>
              <li>KMS(Key Management Service) 기반의 암호화 저장 및 관리</li>
              <li>안전한 암호 알고리즘 사용, 키 관리 절차 수립·이행</li>
            </ul>
          </div>
        </div>

        <div class="policy-section">
          <h2>3. 개인정보 제3자 제공</h2>
          
          <p>MJK 서비스 특성상 반복적/상시 예약 및 호텔·항공권·여행 상품 자동화를 위해 아래 외부 업체에 개인정보를 제공합니다. 동의 거부 시 관련 서비스 이용이 제한될 수 있습니다.</p>

          <div class="table-wrapper">
            <table class="info-table">
              <thead>
                <tr>
                  <th>제공받는 자</th>
                  <th>제공 항목</th>
                  <th>제공 목적</th>
                  <th>보유 및 이용 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>국내외 항공사</td>
                  <td>여권정보, 이름, 성별</td>
                  <td>항공권 예약 및 발권</td>
                  <td>예약 완료 후 항공사 정책에 따름</td>
                </tr>
                <tr>
                  <td>글로벌 여행 플랫폼<br>(아고다 등)</td>
                  <td>이름, 이메일, 연락처, 여권정보</td>
                  <td>항공권·호텔 예약 연동</td>
                  <td>예약 완료 후 플랫폼 정책에 따름</td>
                </tr>
                <tr>
                  <td>국내 여행사</td>
                  <td>이름, 이메일, 연락처</td>
                  <td>호텔 예약</td>
                  <td>예약 완료 후 7일 이내 파기</td>
                </tr>
                <tr>
                  <td>결제 서비스 제공업체</td>
                  <td>이름, 이메일, 연락처</td>
                  <td>결제 처리</td>
                  <td>결제 완료 후 5년 보관</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section-content">
            <ul>
              <li>제공은 암호화된 API 통신 및 최소한의 정보로 한정</li>
              <li>제공받는 자의 개인정보보호 정책 사전 검토</li>
            </ul>
          </div>
        </div>

        <div class="policy-section">
          <h2>4. 선택적 정보 활용</h2>
          
          <p>더 나은 서비스 제공 및 신규 기능 안내, 피드백 요청 등을 위해 아래 정보 활용에 동의하실 수 있습니다. 동의하지 않아도 서비스 이용에는 제한이 없습니다.</p>

          <div class="section-content">
            <h3>4.1 수집 및 활용 항목</h3>
            <ul>
              <li>이메일 주소</li>
              <li>휴대전화번호</li>
              <li>서비스 이용 패턴</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>4.2 활용 목적</h3>
            <ul>
              <li>서비스 개선 및 신규 기능 안내</li>
              <li>맞춤형 예약 추천 및 고객 피드백 수집</li>
              <li>베타 테스트 관련 공지사항 전달</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>4.3 보유 및 이용 기간</h3>
            <p>동의 철회 또는 베타 테스트 종료일까지</p>
          </div>
        </div>

        <div class="policy-section">
          <h2>5. 정보주체의 권리 및 행사 방법</h2>
          
          <div class="section-content">
            <ul>
              <li>개인정보 열람, 정정·삭제, 처리정지, 동의 철회 요청 가능</li>
              <li>여권정보 삭제·처리 중단 요구 시 서비스 이용 제한 가능(베타 테스트 운영 목적상 필요)</li>
              <li>동의 철회: 마이페이지, 이메일에서 언제든 신청 가능</li>
              <li>베타 테스트 종료 후 30일 이내 전체 개인정보 완전 파기, 파기 통지</li>
            </ul>
          </div>
        </div>

        <div class="policy-section">
          <h2>6. 개인정보 안전성 확보 조치</h2>
          
          <div class="section-content">
            <h3>기술적 보호</h3>
            <ul>
              <li>KMS 기반 안전한 암호화</li>
              <li>전송시 SSL/TLS 적용</li>
              <li>접근 통제 및 접근 로그 관리</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>관리적 보호</h3>
            <ul>
              <li>개인정보처리방침 수립·시행</li>
              <li>취급자 교육/점검</li>
              <li>보호조직 운영</li>
            </ul>
          </div>

          <div class="section-content">
            <h3>물리적 보호</h3>
            <ul>
              <li>서버실 출입 통제</li>
              <li>시스템 접근 기록 3년 보관</li>
              <li>정기적 보안 점검 및 암호화 키 관리·교체</li>
            </ul>
          </div>
        </div>

        <div class="policy-section">
          <h2>7. 개인정보 수집·이용의 법적 근거 및 서비스 특성</h2>
          
          <div class="section-content">
            <ul>
              <li>계약의 이행 및 관련 법령(개인정보보호법 제15조, 제24조 등) 근거</li>
              <li>반복적·상시 예약 서비스 특성상 여권정보 등 필수 정보의 지속 보관 필요성 명시</li>
              <li>KMS 기반 암호화 등 안전성 확보 및 투명성 강화</li>
            </ul>
          </div>
        </div>

        <div class="notice-section">
          <p><strong>※ 본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.</strong></p>
          <p>개인정보 관련 문의사항은 아래 연락처로 연락해주시기 바랍니다.</p>
          <p class="contact-info">
            이메일: mjkagent@gmail.com<br>
            전화: 010-9964-7303
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicyScreen',
  methods: {
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.policy-page-outer {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: var(--bg-primary, #1a1a1a);
  padding: 24px;
  box-sizing: border-box;
}

.policy-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  background: var(--bg-secondary, #2a2a2a);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.policy-header {
  position: relative;
  padding: 32px 32px 24px;
  text-align: center;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  background: var(--bg-secondary, #2a2a2a);
}

.back-button {
  position: absolute;
  left: 24px;
  top: 32px;
  background: none;
  border: none;
  color: var(--text-primary, #ffffff);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.policy-title {
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 12px 0;
  color: var(--text-primary, #ffffff);
  letter-spacing: -0.5px;
}

.policy-subtitle {
  font-size: 1rem;
  color: var(--text-secondary, #888888);
  margin: 0;
}

.policy-content {
  padding: 32px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 스크롤바 스타일 */
.policy-content::-webkit-scrollbar {
  width: 8px;
}

.policy-content::-webkit-scrollbar-track {
  background: transparent;
}

.policy-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.policy-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.policy-section {
  margin-bottom: 40px;
}

.policy-section:last-child {
  margin-bottom: 0;
}

.policy-section h2 {
  color: var(--accent-blue, #4dabf7);
  font-size: 1.4rem;
  font-weight: 500;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--accent-blue, #4dabf7);
}

.policy-section > p {
  color: var(--text-primary, #cccccc);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 16px 0;
}

.section-content {
  margin-bottom: 24px;
}

.section-content:last-child {
  margin-bottom: 0;
}

.section-content h3 {
  color: var(--text-primary, #ffffff);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.section-content p {
  color: var(--text-primary, #cccccc);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 8px 0;
}

.section-content ul {
  margin: 0;
  padding-left: 20px;
  color: var(--text-primary, #cccccc);
  font-size: 0.95rem;
  line-height: 1.7;
}

.section-content li {
  margin-bottom: 8px;
}

.table-wrapper {
  overflow-x: auto;
  margin: 20px 0;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  overflow: hidden;
}

.info-table th,
.info-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-table thead th {
  background: rgba(74, 171, 247, 0.1);
  color: var(--accent-blue, #4dabf7);
  font-weight: 500;
  font-size: 0.9rem;
  border-bottom: 2px solid var(--accent-blue, #4dabf7);
}

.info-table tbody td {
  color: var(--text-primary, #cccccc);
  font-size: 0.9rem;
}

.info-table tbody tr:last-child td {
  border-bottom: none;
}

.notice-section {
  margin-top: 40px;
  padding: 24px;
  background: rgba(255, 193, 7, 0.08);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
}

.notice-section p {
  color: var(--text-primary, #ffffff);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 12px 0;
}

.notice-section p:last-child {
  margin-bottom: 0;
}

.notice-section strong {
  color: #ffc107;
}

.contact-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 193, 7, 0.2);
  color: var(--accent-blue, #4dabf7);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .policy-page-outer {
    padding: 16px;
  }
  
  .policy-header {
    padding: 24px 20px 16px;
  }
  
  .back-button {
    left: 16px;
    top: 24px;
    font-size: 1.3rem;
  }
  
  .policy-title {
    font-size: 1.6rem;
  }
  
  .policy-subtitle {
    font-size: 0.9rem;
  }
  
  .policy-content {
    padding: 24px 20px;
    max-height: calc(100vh - 150px);
  }
  
  .policy-section h2 {
    font-size: 1.2rem;
  }
  
  .section-content h3 {
    font-size: 1rem;
  }
  
  .section-content p,
  .section-content ul {
    font-size: 0.9rem;
  }
  
  .info-table {
    font-size: 0.85rem;
  }
  
  .info-table th,
  .info-table td {
    padding: 10px;
  }
}
</style>
