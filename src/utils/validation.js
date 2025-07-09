import { MESSAGES } from './constants';

// 이메일 유효성 검사
export const validateEmail = (email) => {
  const emailRegex = /^[^@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return '이메일을 입력해주세요.';
  }
  if (!emailRegex.test(email)) {
    return MESSAGES.VALIDATION_EMAIL;
  }
  return null;
};

// 비밀번호 유효성 검사
export const validatePassword = (password) => {
  if (!password) {
    return MESSAGES.VALIDATION_PASSWORD;
  }
  if (password.length < 8) {
    return '비밀번호는 8자 이상이어야 합니다.';
  }
  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    return '비밀번호는 특수문자를 포함해야 합니다.';
  }
  return null;
};

// 한글 이름 유효성 검사
export const validateKoreanName = (name) => {
  const koreanRegex = /^[가-힣]+$/;
  if (!name) {
    return '이름을 입력해주세요.';
  }
  if (!koreanRegex.test(name)) {
    return '이름은 한글만 입력해주세요.';
  }
  return null;
};

// 영문 이름 유효성 검사
export const validateEnglishName = (name, fieldName = '이름') => {
  const uppercaseEnglishRegex = /^[A-Z]+$/;
  if (!name) {
    return `${fieldName}을(를) 입력해주세요.`;
  }
  if (!uppercaseEnglishRegex.test(name)) {
    return `${fieldName}은(는) 영문 대문자만 입력해주세요.`;
  }
  return null;
};

// 전화번호 유효성 검사
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneNumber) {
    return '전화번호를 입력해주세요.';
  }
  if (!phoneRegex.test(phoneNumber)) {
    return '올바른 전화번호 형식을 입력해주세요.';
  }
  return null;
};

// 날짜 유효성 검사
export const validateDate = (date, fieldName = '날짜') => {
  if (!date) {
    return `${fieldName}을(를) 선택해주세요.`;
  }
  return null;
};

// 날짜 범위 유효성 검사
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return '시작일과 종료일을 모두 선택해주세요.';
  }
  if (startDate > endDate) {
    return '종료일은 시작일보다 늦어야 합니다.';
  }
  return null;
};

// 여권번호 유효성 검사
export const validatePassportNumber = (passportNumber) => {
  const passportRegex = /^[A-Z]{1,2}[0-9]{6,9}$/;
  if (!passportNumber) {
    return '여권번호를 입력해주세요.';
  }
  if (!passportRegex.test(passportNumber)) {
    return '올바른 여권번호 형식을 입력해주세요. (예: AB1234567)';
  }
  return null;
};

// 일반 필수 필드 유효성 검사
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName}을(를) 입력해주세요.`;
  }
  return null;
};
