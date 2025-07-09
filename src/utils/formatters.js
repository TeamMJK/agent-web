import { GENDER_OPTIONS } from './constants';

// 날짜 포맷팅
export const formatDate = (date, locale = 'ko-KR') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale);
};

// 상세 날짜 포맷팅
export const formatDetailedDate = (date, locale = 'ko-KR') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

// 간단한 날짜 포맷팅
export const formatShortDate = (date, locale = 'ko-KR') => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// 날짜 범위 포맷팅
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = formatShortDate(startDate);
  const end = formatShortDate(endDate);
  
  if (startDate === endDate) {
    return start;
  }
  return `${start} - ${end}`;
};

// ISO 날짜 문자열로 변환
export const formatDateToISO = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

// 성별 표시 포맷팅
export const formatGender = (gender) => {
  const option = GENDER_OPTIONS.find(opt => opt.value === gender);
  return option ? option.label : '-';
};

// 전화번호 포맷팅
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '-';
  
  // 11자리 전화번호 (010-1234-5678)
  if (phoneNumber.length === 11) {
    return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  
  // 10자리 전화번호 (02-123-4567)
  if (phoneNumber.length === 10) {
    return phoneNumber.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }
  
  return phoneNumber;
};

// 이메일 마스킹
export const maskEmail = (email) => {
  if (!email) return '-';
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return email;
  }
  
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

// 여권번호 마스킹
export const maskPassportNumber = (passportNumber) => {
  if (!passportNumber) return '-';
  
  if (passportNumber.length <= 4) {
    return passportNumber;
  }
  
  return passportNumber.substring(0, 2) + '*'.repeat(passportNumber.length - 4) + passportNumber.substring(passportNumber.length - 2);
};

// 숫자에 천 단위 구분자 추가
export const formatNumber = (number) => {
  if (typeof number !== 'number') return number;
  return number.toLocaleString();
};

// 통화 포맷팅
export const formatCurrency = (amount, currency = 'KRW') => {
  if (typeof amount !== 'number') return amount;
  
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};
