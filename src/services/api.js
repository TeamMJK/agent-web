import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, TOKEN_KEYS, TOKEN_EXPIRY, HTTP_STATUS } from '../utils/constants';

// 토큰 관리 유틸리티
export const tokenManager = {
  // 토큰 저장
  setTokens(accessToken, refreshToken) {
    Cookies.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken, { 
      expires: TOKEN_EXPIRY.ACCESS_TOKEN, 
      secure: true, 
      sameSite: 'strict' 
    });
    Cookies.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken, { 
      expires: TOKEN_EXPIRY.REFRESH_TOKEN, 
      secure: true, 
      sameSite: 'strict' 
    });
  },

  // 액세스 토큰 조회
  getAccessToken() {
    return Cookies.get(TOKEN_KEYS.ACCESS_TOKEN);
  },

  // 리프레시 토큰 조회
  getRefreshToken() {
    return Cookies.get(TOKEN_KEYS.REFRESH_TOKEN);
  },

  // 토큰 삭제 (로그아웃)
  clearTokens() {
    Cookies.remove(TOKEN_KEYS.ACCESS_TOKEN);
    Cookies.remove(TOKEN_KEYS.REFRESH_TOKEN);
  },

  // 토큰 존재 여부 확인
  hasValidToken() {
    return !!this.getAccessToken();
  }
};

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터: 모든 요청에 자동으로 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          // 토큰 갱신 시도
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          tokenManager.setTokens(accessToken, newRefreshToken);
          
          // 원래 요청에 새 토큰 적용 후 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        tokenManager.clearTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
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
     * POST /login
     * @param {Object} credentials { email, password }
     * @returns {Promise} accessToken, refreshToken 반환
     */
    login: (credentials) => apiClient.post('/login', credentials),

    /**
     * 회원가입
     * POST /members
     * @param {Object} userData 회원가입 정보
     * @returns {Promise}
     */
    register: (userData) => apiClient.post('/members', userData),

    /**
     * 로그아웃 (로컬 토큰 삭제)
     * 클라이언트에서 토큰만 삭제, 서버 통신 없음
     */
    logout: () => {
      tokenManager.clearTokens();
      return Promise.resolve();
    }
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
     * @param {Object} allSensitiveData
     * @returns {Promise}
     */
    saveSensitiveInfo: (allSensitiveData) => {
      return apiClient.post('/members/sensitive-member-info', allSensitiveData);
    }
  },    

  // 회사 관련 API
  company: {
    /**
     * 회사 생성
     * POST /companies
     * @param {Object} companyData { name, workspace }
     * @returns {Promise} 생성된 회사 ID 반환
     */
    create: (companyData) => apiClient.post('/companies', companyData),

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
     * 초대 코드 생성
     * GET /companies/invitation
     * @returns {Promise} 초대 코드 반환 (string)
     */
    generateInvitationCode: () => apiClient.get('/companies/invitation'),
  },
};

// 기본 export
export default apiService;
