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
    login: (credentials) => apiClient.post('/login', credentials),
    register: (userData) => apiClient.post('/members', userData),
    logout: () => {
      tokenManager.clearTokens();
      return Promise.resolve();
    }
  },

  // 사용자 정보 관련 API
  user: {
    getProfile: () => apiClient.get('/members/me'),
    updateProfile: (userData) => apiClient.patch('/members/me', userData),
    updateSensitiveInfo: (sensitiveData) => apiClient.post('/members/sensitive-member-info', sensitiveData),
    updatePassportInfo: (passportData) => apiClient.post('/members/sensitive-passport-info', passportData)
  },

  // 일정 관련 API
  schedule: {
    getAll: () => apiClient.get('/schedules'),
    create: (scheduleData) => apiClient.post('/schedules', scheduleData),
    update: (id, scheduleData) => apiClient.put(`/schedules/${id}`, scheduleData),
    delete: (id) => apiClient.delete(`/schedules/${id}`)
  }
};

// 기본 export
export default apiService;
