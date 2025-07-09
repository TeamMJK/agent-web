<template>
    <div class="login-outer">
        <div class="login-container">
            <h1 class="login-title">로그인</h1>
            <div v-if="!showPasswordInput" class="login-form">
                <input type="email" v-model="email" placeholder="이메일 주소" class="email-input" />
                <button class="continue-btn" @click="handleEmailContinue">계속</button>
            </div>
            <div v-else class="login-form">
                <input type="email" v-model="email" placeholder="이메일 주소" class="email-input" disabled />
                <input type="password" v-model="password" placeholder="비밀번호" class="email-input password-input" />
                <button class="continue-btn" @click="handleLogin">로그인</button>
            </div>

            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <div class="signup-row">
                <span>계정이 없으신가요?</span>
                <a href="#" @click.prevent="showSignUpPopup = true" class="signup-link">회원 가입</a>
            </div>
            <div class="divider-row">
                <div class="divider"></div>
                <span class="divider-text">또는</span>
                <div class="divider"></div>
            </div>
            <button class="social-btn google" @click="handleGoogleLogin">
                <span class="icon">
                    <!-- Google SVG -->
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <g>
                            <path fill="#4285F4"
                                d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.78h5.5a4.7 4.7 0 01-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.42z" />
                            <path fill="#34A853"
                                d="M10 20c2.7 0 4.96-.9 6.62-2.44l-3.3-2.56c-.92.62-2.1.98-3.32.98-2.56 0-4.73-1.73-5.5-4.06H1.04v2.56A9.99 9.99 0 0010 20z" />
                            <path fill="#FBBC05"
                                d="M4.5 12.92A5.98 5.98 0 013.68 10c0-.5.09-.98.18-1.92V5.52H1.04A10.01 10.01 0 000 10c0 1.56.37 3.04 1.04 4.48l3.46-2.56z" />
                            <path fill="#EA4335"
                                d="M10 4.04c1.48 0 2.8.5 3.84 1.48l2.88-2.88C14.96 1.1 12.7 0 10 0A9.99 9.99 0 001.04 5.52l3.46 2.56C5.27 5.77 7.44 4.04 10 4.04z" />
                        </g>
                    </svg>
                </span>
                <span class="btn-text">Google로 계속하기</span>
            </button>
            
        </div>
        <SignUpPopup v-if="showSignUpPopup" @close="showSignUpPopup = false" />
    </div>
</template>

<script>
import SignUpPopup from './SignUpPopup.vue';
import { apiService, tokenManager } from '../services/api';

export default {
    name: 'LoginScreen',
    components: {
        SignUpPopup,
    },
    data() {
        return {
            email: '',
            password: '', // Added password data property
            showSignUpPopup: false,
            showPasswordInput: false, // Added showPasswordInput
            errorMessage: '', // Added errorMessage
        };
    },
    methods: {
        handleGoogleLogin() {
            console.log('Google 로그인 시도');
            this.errorMessage = 'Google 로그인은 현재 지원되지 않습니다.';
        },
        handleNaverLogin() {
            console.log('Naver 로그인 시도');
            this.errorMessage = 'Naver 로그인은 현재 지원되지 않습니다.';
        },
        handleEmailContinue() {
            this.errorMessage = ''; // Clear previous error message

            if (!this.email) {
                this.errorMessage = '이메일을 입력해주세요.';
                return;
            }
            // Basic email format validation
            if (!/^[^@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
                this.errorMessage = '유효한 이메일 주소를 입력해주세요.';
                return;
            }
            this.showPasswordInput = true; // Show password input
        },
        async handleLogin() {
            this.errorMessage = '';

            if (!this.password) {
                this.errorMessage = '비밀번호를 입력해주세요.';
                return;
            }

            try {
                const response = await apiService.auth.login({
                    email: this.email,
                    password: this.password,
                });

                if (response.data && response.data.accessToken && response.data.refreshToken) {
                    tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);

                    // 사용자 정보 확인
                    try {
                        const memberInfoResponse = await apiService.user.getProfile();
                        const memberData = memberInfoResponse.data;

                        // 민감 정보 확인
                        if (!memberData || Object.keys(memberData).length === 0 || 
                            !memberData.name || !memberData.firstName || !memberData.lastName || 
                            !memberData.phoneNumber || !memberData.gender || !memberData.birthDate) {
                            this.$router.push('/sensitive-info');
                        }
                        // 여권 정보 확인
                        else if (!memberData.passportNumber || memberData.passportNumber === '' ||
                                 !memberData.passportExpireDate || memberData.passportExpireDate === '') {
                            this.$router.push('/passport-info');
                        }
                        else {
                            this.$router.push('/main');
                        }
                    } catch (memberInfoError) {
                        console.error('Failed to fetch member info:', memberInfoError);
                        this.$router.push('/main');
                    }
                } else {
                    this.errorMessage = '로그인 응답 형식이 올바르지 않습니다.';
                }
            } catch (error) {
                console.error('로그인 실패:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    this.errorMessage = `로그인 실패: ${error.response.data.message}`;
                } else {
                    this.errorMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
                }
            }
        }
    }
}
</script>

<style scoped>
.login-outer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    background: #181818;
    padding: 24px;
    box-sizing: border-box;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
}

.login-title {
    font-size: 2.4rem;
    font-weight: 400;
    margin: 0 0 48px 0;
    color: #fff;
    text-align: center;
    letter-spacing: -1px;
}

.login-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 24px;
}

.email-input {
    width: 100%;
    font-size: 1.1rem;
    padding: 18px 20px;
    border: 1.5px solid #232323;
    border-radius: 999px;
    margin-bottom: 16px;
    background: #232323;
    color: #fff;
    outline: none;
    box-sizing: border-box;
}

.email-input:focus {
    border-color: #4A90E2;
}

.email-input::placeholder {
    color: #888;
}

.continue-btn {
    width: 100%;
    padding: 18px 0;
    background: #2056b3;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 8px;
}

.continue-btn:hover {
    background: #163d7a;
}

.signup-row {
    width: 100%;
    text-align: center;
    margin-bottom: 24px;
    font-size: 1rem;
    color: #bbb;
}

.signup-link {
    color: #2056b3;
    margin-left: 4px;
    text-decoration: none;
    font-weight: 500;
}

.signup-link:hover {
    text-decoration: underline;
}

.divider-row {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 24px 0;
}

.divider {
    flex: 1;
    height: 1px;
    background: #232323;
}

.divider-text {
    margin: 0 16px;
    color: #888;
    font-size: 0.95rem;
    white-space: nowrap;
}

.social-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 20px;
    border: 1.5px solid #232323;
    border-radius: 999px;
    background: #232323;
    color: #fff;
    font-size: 1.08rem;
    font-weight: 500;
    margin-bottom: 16px;
    cursor: pointer;
}

.social-btn:last-child {
    margin-bottom: 0;
}

.social-btn:hover {
    background: #222;
    border-color: #2056b3;
}

.social-btn .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
}

.social-btn .btn-text {
    font-size: 1.08rem;
    font-weight: 500;
    color: #fff;
}

.error-message {
    color: #ff4d4d;
    font-size: 0.9rem;
    margin: 16px 0;
    text-align: center;
    width: 100%;
    padding: 12px 16px;
    background-color: rgba(255, 77, 77, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 77, 77, 0.3);
}

.password-input {
    margin-bottom: 16px;
}
</style>