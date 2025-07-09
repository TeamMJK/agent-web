import axios from 'axios';
import Cookies from 'js-cookie';

// API 기본 URL 설정
const BASE_URL = 'http://15.164.89.233:8080';

// 토큰 관리 유틸리티
export const tokenManager = {
  // 토큰 저장
  setTokens(accessToken, refreshToken) {
    Cookies.set('accessToken', accessToken, { expires: 7, secure: true, sameSite: 'strict' });
    Cookies.set('refreshToken', refreshToken, { expires: 30, secure: true, sameSite: 'strict' });
  },

  // 액세스 토큰 조회
  getAccessToken() {
    return Cookies.get('accessToken');
  },

  // 리프레시 토큰 조회
  getRefreshToken() {
    return Cookies.get('refreshToken');
  },

  // 토큰 삭제 (로그아웃)
  clearTokens() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  },

  // 토큰 존재 여부 확인
  hasValidToken() {
    return !!this.getAccessToken();
  }
};

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          // 토큰 갱신 시도
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
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
    updateProfile: (userData) => apiClient.patch('/members/me', userData)
  },

  // 일정 관련 API (추후 구현)
  schedule: {
    getAll: () => apiClient.get('/schedules'),
    create: (scheduleData) => apiClient.post('/schedules', scheduleData),
    update: (id, scheduleData) => apiClient.put(`/schedules/${id}`, scheduleData),
    delete: (id) => apiClient.delete(`/schedules/${id}`)
  }
};

// 기본 export
export default apiService;
