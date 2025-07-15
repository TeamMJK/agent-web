// API 관련 상수
export const API_BASE_URL = 'https://www.mjk.o-r.kr';

// 토큰 관련 상수
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
};

// 토큰 만료 시간 (일)
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 7,
  REFRESH_TOKEN: 30
};

// 라우트 이름
export const ROUTE_NAMES = {
  LOGIN: 'Login',
  MAIN: 'Main',
  WORKSPACE: 'WorkSpace',
  SENSITIVE_INFO: 'SensitiveInfo',
  PASSPORT_INFO: 'PassportInfo'
};

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// 성별 옵션
export const GENDER_OPTIONS = [
  { value: '', label: '선택하세요' },
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' }
];

// 색상 팔레트
export const CALENDAR_COLORS = [
  '#8b5cf6',
  '#7ED321',
  '#F5A623',
  '#D0021B',
  '#9013FE',
  '#50E3C2'
];

// 메시지
export const MESSAGES = {
  LOGIN_SUCCESS: '로그인이 성공적으로 완료되었습니다.',
  LOGIN_FAILURE: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
  SIGNUP_SUCCESS: '회원가입이 성공적으로 완료되었습니다!',
  SIGNUP_FAILURE: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
  PROFILE_UPDATE_SUCCESS: '프로필이 성공적으로 업데이트되었습니다.',
  PROFILE_UPDATE_FAILURE: '프로필 업데이트 중 오류가 발생했습니다.',
  VALIDATION_EMAIL: '유효한 이메일 주소를 입력해주세요.',
  VALIDATION_PASSWORD: '비밀번호를 입력해주세요.',
  VALIDATION_REQUIRED: '필수 항목을 입력해주세요.',
  DELETE_CONFIRM: '이 일정을 삭제하시겠습니까?'
};

// 필터 옵션
export const FILTER_OPTIONS = [
  { id: 'all', label: '전체' },
  { id: 'accommodation', label: '숙소' },
  { id: 'flight', label: '항공' },
  { id: 'rental', label: '렌트카' },
  { id: 'restaurant', label: '맛집' }
];

// 폼 필드 정의
export const USER_FIELDS = [
  { key: 'name', label: '이름', type: 'text' },
  { key: 'email', label: '이메일', type: 'email' },
  { key: 'firstName', label: '성', type: 'text' },
  { key: 'lastName', label: '이름', type: 'text' },
  { key: 'phoneNumber', label: '전화번호', type: 'tel' },
  { key: 'birthDate', label: '생년월일', type: 'date' },
  { key: 'passportNumber', label: '여권번호', type: 'text' },
  { key: 'passportExpireDate', label: '여권 만료일', type: 'date' }
];
