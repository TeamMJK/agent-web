/**
 * 커스텀 알림 및 확인 대화상자 유틸리티
 * 브라우저 기본 alert, confirm을 대체합니다.
 */

// Vue 3의 createApp을 사용한 동적 컴포넌트 마운트
import { createApp } from 'vue';
import BaseConfirm from '@/components/common/BaseConfirm.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';

/**
 * 확인 대화상자를 표시합니다
 * @param {Object} options - 확인 대화상자 옵션
 * @param {string} options.message - 표시할 메시지
 * @param {string} options.title - 제목 (기본값: '확인')
 * @param {string} options.confirmText - 확인 버튼 텍스트 (기본값: '확인')
 * @param {string} options.cancelText - 취소 버튼 텍스트 (기본값: '취소')
 * @param {string} options.confirmVariant - 확인 버튼 변형 (기본값: 'confirm')
 * @param {string} options.iconType - 아이콘 타입 (기본값: 'question')
 * @returns {Promise<boolean>} 확인 시 true, 취소 시 false
 */
export function showConfirm(options = {}) {
    return new Promise((resolve) => {
        const {
            message,
            title = '확인',
            confirmText = '확인',
            cancelText = '취소',
            confirmVariant = 'confirm',
            iconType = 'question'
        } = options;

        // 컨테이너 요소 생성
        const container = document.createElement('div');
        document.body.appendChild(container);

        // Vue 앱 생성
        const app = createApp(BaseConfirm, {
            show: true,
            title,
            message,
            confirmText,
            cancelText,
            confirmVariant,
            iconType,
            onConfirm: () => {
                cleanup();
                resolve(true);
            },
            onCancel: () => {
                cleanup();
                resolve(false);
            },
            onClose: () => {
                cleanup();
                resolve(false);
            }
        });

        // 컴포넌트 등록
        app.component('BaseModal', BaseModal);
        app.component('BaseButton', BaseButton);

        // 마운트
        app.mount(container);

        // 정리 함수
        function cleanup() {
            app.unmount();
            document.body.removeChild(container);
        }
    });
}

/**
 * 경고 대화상자를 표시합니다
 * @param {Object} options - 경고 대화상자 옵션
 * @param {string} options.message - 표시할 메시지
 * @param {string} options.title - 제목 (기본값: '경고')
 * @param {string} options.confirmText - 확인 버튼 텍스트 (기본값: '확인')
 * @returns {Promise<void>}
 */
export function showAlert(options = {}) {
    const {
        message,
        title = '알림',
        confirmText = '확인'
    } = options;

    return showConfirm({
        message,
        title,
        confirmText,
        iconType: 'info',
        // 취소 버튼 숨기기 위한 설정 (BaseConfirm 컴포넌트에서 cancelText가 없으면 숨김)
        cancelText: ''
    });
}

/**
 * 삭제 확인 대화상자를 표시합니다
 * @param {Object} options - 삭제 확인 대화상자 옵션
 * @param {string} options.message - 표시할 메시지 (기본값: '정말 삭제하시겠습니까?')
 * @param {string} options.title - 제목 (기본값: '삭제 확인')
 * @returns {Promise<boolean>}
 */
export function showDeleteConfirm(options = {}) {
    const {
        message = '정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.',
        title = '삭제 확인'
    } = options;

    return showConfirm({
        message,
        title,
        confirmText: '삭제',
        cancelText: '취소',
        confirmVariant: 'confirm',
        iconType: 'warning'
    });
}
