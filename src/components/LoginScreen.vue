<template>
    <div class="login-outer">
        <div class="login-container">
            <h1 class="login-title">앙 기모띠이이</h1>
            <input type="email" v-model="email" placeholder="이메일 주소" class="email-input" />
            <button class="continue-btn" @click="handleEmailContinue">계속</button>
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

export default {
    name: 'LoginScreen',
    components: {
        SignUpPopup,
    },
    data() {
        return {
            email: '',
            showSignUpPopup: false,
        };
    },
    methods: {
        handleGoogleLogin() {
            console.log('Google 로그인 시도');
        },
        handleNaverLogin() {
            console.log('Naver 로그인 시도');
        },
        handleEmailContinue() {
            if (this.email) {
                console.log(`이메일로 계속: ${this.email}`);
            } else {
                alert('이메일을 입력해주세요.');
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
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
    padding: 0 24px;
}

.login-title {
    font-size: 2.4rem;
    font-weight: 600;
    margin-bottom: 40px;
    margin-top: 0;
    color: #fff;
    text-align: center;
    letter-spacing: -1px;
}

.email-input {
    width: 100%;
    font-size: 1.1rem;
    padding: 18px 20px;
    border: 1.5px solid #232323;
    border-radius: 999px;
    margin-bottom: 18px;
    background: #232323;
    color: #fff;
    outline: none;
    box-sizing: border-box;
    transition: border 0.2s;
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
    /* 더 진한 파랑 */
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 28px;
    cursor: pointer;
}

.continue-btn:hover {
    background: #163d7a;
    /* 더 진한 파랑 */
}

.signup-row {
    width: 100%;
    text-align: center;
    margin-bottom: 18px;
    font-size: 1rem;
    color: #bbb;
}

.signup-link {
    color: #2056b3;
    /* 더 진한 파랑 */
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
    margin: 18px 0 18px 0;
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
    justify-content: flex-start;
    gap: 10px;
    padding: 15px 18px;
    border: 1.5px solid #232323;
    border-radius: 999px;
    background: #232323;
    color: #fff;
    font-size: 1.08rem;
    font-weight: 500;
    margin-bottom: 14px;
    cursor: pointer;
    transition: background 0.2s, border 0.2s;
}

.social-btn:last-child {
    margin-bottom: 0;
}

.social-btn:hover {
    background: #222;
    border-color: #2056b3;
    /* 더 진한 파랑 */
}

.social-btn .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
}

.social-btn .btn-text {
    flex: 1;
    text-align: left;
    margin-left: 8px;
    font-size: 1.08rem;
    font-weight: 500;
    color: #fff;
}

.google .btn-text {
    color: #fff;
}

.naver {
    border: 1.5px solid #02B050FF;
    background: #02B050FF;
    color: #fff;
}

.naver:hover {
    background: #029946FF;
    border-color: #01642EFF;
}
</style>