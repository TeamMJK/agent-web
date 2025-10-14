import axios from 'axios';
import { API_BASE_URL, HTTP_STATUS } from '../utils/constants';

// 토큰 관리 유틸리티 (백엔드 HttpOnly 쿠키 사용)
export const tokenManager = {
  // 백엔드에서 HttpOnly 쿠키로 토큰을 관리하므로 인증 상태 확인만 수행
  async checkAuth() {
    try {
      console.log('[checkAuth] /members/me 호출 시작');
      const response = await apiClient.get('/members/me');
      console.log('[checkAuth] 응답 상태:', response.status);
      return response.status === 200;
    } catch (error) {
      const statusCode = error.response?.status;
      console.log('[checkAuth] 에러 발생!');
      console.log('[checkAuth] 상태 코드:', statusCode);
      console.log('[checkAuth] 에러 메시지:', error.response?.data);
      console.log('[checkAuth] 전체 에러:', error);

      // 401 (Unauthorized)만 인증 실패로 처리
      // 500 (서버 에러) 등은 인증 성공으로 간주 (서버 문제이므로)
      if (statusCode === 401 || statusCode === 403) {
        return false; // 인증 실패
      }

      // 그 외의 에러(네트워크 에러, 500 등)는 인증 성공으로 간주
      // 쿠키가 있다면 일시적인 서버 문제로 판단
      console.log('[checkAuth] 401/403이 아닌 에러, 인증 성공으로 간주');
      return true;
    }
  },

  // 로그아웃 시 백엔드 API 호출
  async clearTokens() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }
};

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // HttpOnly 쿠키를 포함하여 요청
});

// 응답 인터셉터: 401 에러 시 로그인 페이지로 리디렉션
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 에러 시 로그인 페이지로 리디렉션 (백엔드에서 토큰 갱신 처리)
    // 단, 이미 로그인 페이지에 있거나 로그인 관련 페이지인 경우 리디렉션하지 않음
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      const currentPath = window.location.pathname;
      const noRedirectPaths = ['/login', '/signup', '/privacy-policy', '/terms-of-service'];

      if (!noRedirectPaths.includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API 서비스 객체
export const apiService = {
  // 인증 관련 API
  auth: {
    /**
     * 로그인
     * POST /auth/login
     * @param {Object} credentials { email, password }
     * @returns {Promise} accessToken, refreshToken 반환
     */
    login: (credentials) => apiClient.post('/auth/login', credentials),

    /**
     * 구글 로그인
     * GET /auth/login
     * @returns {Promise} 구글 로그인 URL 반환
     */
    googleLogin: () => apiClient.get('/auth/login'),

    /**
     * 회원가입
     * POST /members
     * @param {Object} userData 회원가입 정보
     * @returns {Promise}
     */
    register: (userData) => apiClient.post('/members', userData),

    /**
     * 로그아웃 (백엔드에 로그아웃 요청)
     * 백엔드에서 HttpOnly 쿠키 삭제
     */
    logout: () => tokenManager.clearTokens(),

    /**
     * 이메일 인증 코드 발송
     * POST /emails/send
     * @param {string} email 인증할 이메일 주소
     * @returns {Promise}
     */
    sendVerificationCode: (email) => apiClient.post('/emails/send', { email }),

    /**
     * 이메일 인증 코드 검증
     * POST /emails/verify
     * @param {string} email 이메일 주소
     * @param {string} code 인증 코드
     * @returns {Promise}
     */
    verifyEmail: (email, code) => apiClient.post('/emails/verify', { email, code })
  },

  // 사용자 정보 관련 API
  user: {
    /**
     * 내 프로필 조회
     * GET /members/me
     * @returns {Promise} 사용자 정보 반환
     */
    getProfile: () => apiClient.get('/members/me'),

    /**
     * 내 프로필 수정
     * PATCH /members/me
     * @param {Object} userData 수정할 정보
     * @returns {Promise}
     */
    updateProfile: (userData) => apiClient.patch('/members/me', userData),

    /**
     * 민감 정보 저장
     * POST /members/sensitive-member-info
     * @param {Object} allSensitiveData - 민감 정보 객체
     * @param {string} allSensitiveData.name - 이름(한글)
     * @param {string} allSensitiveData.firstName - 이름(영문)
     * @param {string} allSensitiveData.lastName - 성(영문)
     * @param {string} allSensitiveData.phoneNumber - 전화번호
     * @param {string} allSensitiveData.gender - 성별
     * @param {string} allSensitiveData.birthDate - 생년월일 (YYYY-MM-DD)
     * @param {string} allSensitiveData.passportNumber - 여권번호
     * @param {string} allSensitiveData.passportExpireDate - 여권 만료일 (YYYY-MM-DD)
     * @returns {Promise<{memberId: number}>} 생성된 회원 ID
     */
    saveSensitiveInfo: (allSensitiveData) => {
      return apiClient.post('/members/sensitive-member-info', allSensitiveData);
    },

    /**
     * 회원 탈퇴
     * DELETE /members
     * @returns {Promise}
     */
    deleteAccount: () => apiClient.delete('/members')
  },

  // 회사 관련 API
  company: {
    /**
     * 회사 생성
     * POST /companies
     * @param {Object} companyData { name, workspaces, workspaceConfigs }
     * - workspaces: 문자열 배열
     * - workspaceConfigs: 워크스페이스별 설정 객체
     * @returns {Promise} 생성된 회사 ID 반환
     */
    create: (companyData) => {
      const payload = {
        name: companyData.name,
        workspaces: companyData.workspaces || [],
        workspaceConfigs: {}
      };

      // 선택된 워크스페이스만 포함
      (companyData.workspaces || []).forEach(ws => {
        if (companyData.workspaceConfigs && companyData.workspaceConfigs[ws]) {
          payload.workspaceConfigs[ws] = companyData.workspaceConfigs[ws];
        }
      });

      return apiClient.post('/companies', payload);
    },

    /**
     * 회사 수정
     * PATCH /companies
     * @param {Object} companyData { name, workspaces, workspaceConfigs }
     * @param {string} companyData.name - 회사 이름
     * @param {string[]} companyData.workspaces - 워크스페이스 목록
     * @param {Object} companyData.workspaceConfigs - 워크스페이스별 설정
     */
    update: (companyData) => {
      const payload = {
        name: companyData.name,
        workspaces: companyData.workspaces || [],
        workspaceConfigs: {}
      };

      // 선택된 워크스페이스만 포함
      (companyData.workspaces || []).forEach(ws => {
        if (companyData.workspaceConfigs && companyData.workspaceConfigs[ws]) {
          payload.workspaceConfigs[ws] = companyData.workspaceConfigs[ws];
        }
      });

      return apiClient.patch('/companies', payload);
    },

    /**
     * 회사 목록 조회
     * GET /companies
     * @returns {Promise} 회사 이름 반환 (string)
     */
    getList: () => apiClient.get('/companies'),

    /**
     * 회사 참가
     * POST /companies/join
     * @param {Object} joinData { invitationCode }
     * @returns {Promise} 회사 이름 반환 (string)
     */
    join: (joinData) => apiClient.post('/companies/join', joinData),

    /**
     * 초대 코드 생성 및 이메일 발송
     * POST /companies/invitation/send
     * @param {Object} sendData { email }
     * @returns {Promise} 발송 성공 시 상태 코드 201 반환
     */
    sendInvitationCode: (sendData) => apiClient.post('/companies/invitation/send', sendData),
    /**
     * 회사 삭제
     * DELETE /companies
     */
    delete: () => apiClient.delete('/companies')
  },

  // 영수증 관련 API
  receipt: {
    /**
     * 영수증 저장 (텍스트 + 이미지)
     * POST /receipts
     * @param {FormData} formData 영수증 정보와 이미지가 포함된 FormData
     * @returns {Promise} 생성된 영수증 ID 반환
     */
    create: (formData) => {
      return apiClient.post('/receipts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },

    /**
     * 영수증 전체 조회
     * GET /receipts/{receipt-id}
     * @param {number} receiptId 영수증 ID
     * @returns {Promise} 영수증 정보 반환
     */
    getById: (receiptId) => apiClient.get(`/receipts/${receiptId}`),

    /**
     * 영수증 전체 조회
     * GET /receipts
     * @returns {Promise} 영수증 목록 반환
     */
    getList: () => apiClient.get('/receipts'),

    /**
     * 영수증 수정
     * PATCH /receipts/{receiptId}
     * @param {number} receiptId 영수증 ID
     * @param {Object} receiptData 수정할 영수증 데이터
     * @param {string} receiptData.paymentDate - 결제 날짜 (YYYY-MM-DD)
     * @param {string} receiptData.approvalNumber - 승인 번호
     * @param {string} receiptData.storeAddress - 가게 주소
     * @param {number} receiptData.totalAmount - 총 금액
     * @returns {Promise} 수정된 영수증 정보 반환
     */
    update: (receiptId, receiptData) => apiClient.patch(`/receipts/${receiptId}`, receiptData),

    /**
     * 영수증 삭제
     * DELETE /receipts/{receiptId}
     * @param {number} receiptId 영수증 ID
     * @returns {Promise} 삭제 성공 시 상태 코드 204 반환
     */
    delete: (receiptId) => apiClient.delete(`/receipts/${receiptId}`),

    /**
     * 영수증 이미지 OCR 업로드
     * POST /receipts/i/ocr
     * @param {FormData} formData 이미지 파일이 포함된 FormData
     * @returns {Promise} OCR 처리된 영수증 정보 반환
     */
    ocrUpload: (formData) => {
      return apiClient.post('/receipts/i/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
  },

  // 프롬프트 관련 API
  prompts: {
    /**
     * 숙박+항공 통합 프롬프트
     * POST /prompts/integration
     * @param {{ prompt: string }} payload
     */
    integration: (payload) => apiClient.post('/prompts/integration', payload),

    /**
     * 숙박 전용 프롬프트
     * POST /prompts/hotel
     * @param {{ prompt: string }} payload
     */
    hotel: (payload) => apiClient.post('/prompts/hotel', payload, { timeout: 0 }),

    /**
     * 항공 전용 프롬프트
     * POST /prompts/flight
     * @param {{ prompt: string }} payload
     */
    flight: (payload) => apiClient.post('/prompts/flight', payload),

    /**
     * 숙박 리스트 검색 (Agoda)
     * POST /agodas/search
     * @param {{ prompt: string }} payload
     * @returns {Promise<{results: Array, destination: string}>} 호텔 검색 결과 반환
     */
    agodaSearch: (payload) => apiClient.post('/agodas/search', payload, { timeout: 0 }),

    /**
     * VNC 요청 히스토리 조회
     * GET /vnc
     * @returns {Promise<{vncResponseList: Array}>} VNC 요청 히스토리 목록 반환
     */
    getVncHistory: () => apiClient.get('/vnc'),
  },

  // 출장 관련 API
  businessTrips: {
    /**
     * 출장 목록 조회
     * GET /business-trips
     * @returns {Promise} 출장 목록 반환
     */
    getList: () => apiClient.get('/business-trips'),

    /**
     * MJK 워크스페이스 출장 등록
     * POST /business-trips
     * @param {Object} tripData 출장 등록 정보
     * @param {string} tripData.departDate - 출발 날짜 (YYYY-MM-DD)
     * @param {string} tripData.arriveDate - 도착 날짜 (YYYY-MM-DD)
     * @param {string} tripData.destination - 목적지
     * @param {string[]} tripData.names - 출장자 이름 목록
     * @param {string} tripData.serviceType - 서비스 타입 ("FLIGHT" | "HOTEL")
     * @returns {Promise} 생성된 출장 ID 반환
     */
    create: (tripData) => apiClient.post('/business-trips', tripData),

    /**
     * 기업 워크스페이스 출장 MCP 등록
     * POST /business-trips/mcp
     * @param {Object} tripData 출장 등록 정보
     * @param {string} tripData.departDate - 출발 날짜 (YYYY-MM-DD)
     * @param {string} tripData.arriveDate - 도착 날짜 (YYYY-MM-DD)
     * @param {string} tripData.destination - 목적지
     * @param {string[]} tripData.names - 출장자 이름 목록
     * @param {string} tripData.serviceType - 서비스 타입 ("FLIGHT" | "HOTEL")
     * @returns {Promise} 생성된 출장 ID 반환
     */
    createMcp: (tripData) => apiClient.post('/business-trips/mcp', tripData),

    /**
     * 출장 수정
     * PATCH /business-trips/{business-trip-id}
     * @param {number} tripId 출장 ID
     * @param {Object} tripData 출장 수정 정보
     * @param {string} tripData.departDate - 출발 날짜 (YYYY-MM-DD)
     * @param {string} tripData.arriveDate - 도착 날짜 (YYYY-MM-DD)
     * @param {string} tripData.destination - 목적지
     * @param {string[]} tripData.names - 출장자 이름 목록
     * @param {string} tripData.serviceType - 서비스 타입 ("FLIGHT" | "HOTEL")
     * @returns {Promise} 수정된 출장 ID 반환
     */
    update: (tripId, tripData) => apiClient.patch(`/business-trips/${tripId}`, tripData),

    /**
     * 출장 삭제
     * DELETE /business-trips/{business-trip-id}
     * @param {number} tripId 출장 ID
     * @returns {Promise} 삭제 성공 시 상태 코드 204 반환
     */
    delete: (tripId) => apiClient.delete(`/business-trips/${tripId}`),
  },

  /**
   * 리뷰 조회
   * GET /reviews
   * @returns {Promise} 사용자의 리뷰 정보 반환 (200 OK면 리뷰 존재)
   */
  getReview: async () => {
    try {
      const response = await apiClient.get('/reviews/written');
      return response.data;
    } catch (error) {
      // 404나 다른 에러는 리뷰가 없는 것으로 간주
      if (error.response?.status === HTTP_STATUS.NOT_FOUND) {
        return null;
      }
      throw error;
    }
  },

  /**
   * 리뷰 제출
   * POST /reviews
   * @param {Object} reviewData 리뷰 데이터
   * @param {string} reviewData.reviewContent - 리뷰 내용
   * @param {number} reviewData.rating - 별점 (1-5)
   * @returns {Promise} 생성된 리뷰 ID 반환
   */
  submitReview: async (reviewData) => {
    try {
      const response = await apiClient.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('리뷰 제출 중 오류:', error);
      throw new Error(
        error.response?.data?.message ||
        '리뷰 제출 중 오류가 발생했습니다'
      );
    }
  },
};

// 기본 export
export default apiService;
