<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <img src="@/assets/icon.png" alt="logo" class="sidebar-logo-img" @click="goToHome" />
    </div>
    <ul class="menu-items">
      <li data-label="메인" :class="{ active: $route.name === 'Main' }">
        <router-link to="/main" data-label="메인">
          <i class="pi pi-home"></i>
        </router-link>
      </li>
      <li data-label="워크스페이스" :class="{ active: $route.name === 'WorkSpace' }">
        <router-link to="/workspace" data-label="워크스페이스">
          <i class="pi pi-briefcase"></i>
        </router-link>
      </li>
      <li data-label="영수증" :class="{ active: $route.name === 'ReceiptScreen' }">
        <router-link to="/receipt" data-label="영수증">
          <i class="pi pi-receipt"></i>
        </router-link>
      </li>
      <li data-label="출장 요청" :class="{ active: $route.name === 'PromptScreen' }">
        <router-link to="/prompt" data-label="출장 요청">
          <i class="pi pi-send"></i>
        </router-link>
      </li>
      <!-- 모바일 전용 메뉴 -->
      <li data-label="내 정보" class="mobile-only">
        <a href="#" @click.prevent="showUserInfo" data-label="내 정보">
          <i class="pi pi-user"></i>
        </a>
      </li>
    </ul>
    <div class="sidebar-footer">
      <button data-label="내 정보" class="footer-button" @click="showUserInfo">
        <i class="pi pi-user"></i>
      </button>
      <button data-label="로그아웃" class="footer-button" @click="logout">
        <i class="pi pi-sign-out"></i>
      </button>
    </div>

    <!-- 내 정보 팝업 -->
    <div v-if="showUserModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="header-info">
            <div class="profile-icon">
              <i class="pi pi-user"></i>
            </div>
            <div class="header-text">
              <h3>내 정보</h3>
              <p class="header-subtitle">개인정보를 확인하고 수정할 수 있습니다</p>
            </div>
          </div>
          <button class="btn btn-close" @click="closeModal">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-section">
            <div class="section-title">
              <i class="pi pi-id-card"></i>
              <span>기본 정보</span>
            </div>
            
            <div class="form-grid">
              <!-- 이름(한글) 필드 -->
              <div class="form-group">
                <label>이름(한글)</label>
                <div class="field-container">
                  <div class="input-wrapper">
                    <input 
                      v-if="!editingFields.name"
                      :value="userInfo.name || '-'"
                      type="text"
                      readonly
                      class="readonly-field"
                    />
                    <input 
                      v-else
                      v-model="userInfo.name"
                      type="text"
                      class="editable-field"
                      @blur="stopEditing('name')"
                      @keyup.enter="stopEditing('name')"
                      ref="editInput"
                    />
                  </div>
                  <button 
                    class="edit-btn" 
                    @mousedown.prevent="toggleEdit('name')"
                    :title="editingFields.name ? '저장' : '수정'"
                  >
                    <i :class="editingFields.name ? 'pi pi-check' : 'pi pi-pencil'"></i>
                  </button>
                </div>
              </div>

              <!-- 이름(영문)과 성(영문) 필드 - 한 줄에 배치 -->
              <div class="form-group-row">
                <div class="form-group half-width">
                  <label>이름(영문)</label>
                  <div class="field-container">
                    <div class="input-wrapper">
                      <input 
                        v-if="!editingFields.firstName"
                        :value="userInfo.firstName || '-'"
                        type="text"
                        readonly
                        class="readonly-field"
                      />
                      <input 
                        v-else
                        v-model="userInfo.firstName"
                        type="text"
                        class="editable-field"
                        @blur="stopEditing('firstName')"
                        @keyup.enter="stopEditing('firstName')"
                        ref="editInput"
                      />
                    </div>
                    <button 
                      class="edit-btn" 
                      @mousedown.prevent="toggleEdit('firstName')"
                      :title="editingFields.firstName ? '저장' : '수정'"
                    >
                      <i :class="editingFields.firstName ? 'pi pi-check' : 'pi pi-pencil'"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group half-width">
                  <label>성(영문)</label>
                  <div class="field-container">
                    <div class="input-wrapper">
                      <input 
                        v-if="!editingFields.lastName"
                        :value="userInfo.lastName || '-'"
                        type="text"
                        readonly
                        class="readonly-field"
                      />
                      <input 
                        v-else
                        v-model="userInfo.lastName"
                        type="text"
                        class="editable-field"
                        @blur="stopEditing('lastName')"
                        @keyup.enter="stopEditing('lastName')"
                        ref="editInput"
                      />
                    </div>
                    <button 
                      class="edit-btn" 
                      @mousedown.prevent="toggleEdit('lastName')"
                      :title="editingFields.lastName ? '저장' : '수정'"
                    >
                      <i :class="editingFields.lastName ? 'pi pi-check' : 'pi pi-pencil'"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 전화번호 필드 -->
              <div class="form-group">
                <label>전화번호</label>
                <div class="field-container">
                  <div class="input-wrapper">
                    <input 
                      v-if="!editingFields.phoneNumber"
                      :value="userInfo.phoneNumber || '-'"
                      type="tel"
                      readonly
                      class="readonly-field"
                    />
                    <input 
                      v-else
                      v-model="userInfo.phoneNumber"
                      type="tel"
                      class="editable-field"
                      @blur="stopEditing('phoneNumber')"
                      @keyup.enter="stopEditing('phoneNumber')"
                      ref="editInput"
                    />
                  </div>
                  <button 
                    class="edit-btn" 
                    @mousedown.prevent="toggleEdit('phoneNumber')"
                    :title="editingFields.phoneNumber ? '저장' : '수정'"
                  >
                    <i :class="editingFields.phoneNumber ? 'pi pi-check' : 'pi pi-pencil'"></i>
                  </button>
                </div>
              </div>

              <!-- 생년월일 필드 - ModernDatePicker 사용 -->
              <div class="form-group">
                <label>생년월일</label>
                <div class="field-container date-field">
                  <div class="input-wrapper">
                    <div v-if="!editingFields.birthDate" class="readonly-field date-readonly">
                      {{ formatDateDisplay(userInfo.birthDate) || '-' }}
                    </div>
                    <ModernDatePicker 
                      v-else
                      v-model="userInfo.birthDate"
                      placeholder="생년월일을 선택하세요"
                      @blur="stopEditing('birthDate')"
                    />
                  </div>
                  <button 
                    class="edit-btn" 
                    @mousedown.prevent="toggleEdit('birthDate')"
                    :title="editingFields.birthDate ? '저장' : '수정'"
                  >
                    <i :class="editingFields.birthDate ? 'pi pi-check' : 'pi pi-pencil'"></i>
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label>성별</label>
                <div class="field-container">
                  <div class="input-wrapper">
                    <div v-if="editingFields.gender" class="gender-segmented" role="radiogroup" aria-label="성별 선택">
                      <button type="button" :aria-pressed="userInfo.gender==='Male'" :class="['gender-option', { active: userInfo.gender==='Male'}]" @click="userInfo.gender='Male'">남성</button>
                      <button type="button" :aria-pressed="userInfo.gender==='Female'" :class="['gender-option', { active: userInfo.gender==='Female'}]" @click="userInfo.gender='Female'">여성</button>
                    </div>
                    <input 
                      v-else
                      :value="getGenderDisplay(userInfo.gender)"
                      readonly
                      class="readonly-field"
                    />
                  </div>
                  <button 
                    class="edit-btn" 
                    @mousedown.prevent="toggleEdit('gender')"
                    :title="editingFields.gender ? '저장' : '수정'"
                  >
                    <i :class="editingFields.gender ? 'pi pi-check' : 'pi pi-pencil'"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-section" v-if="passportFields.some(field => userInfo[field.key])">
            <div class="section-title">
              <i class="pi pi-bookmark"></i>
              <span>여권 정보</span>
            </div>
            
            <div class="form-grid">
              <div class="form-group" v-for="field in nonDatePassportFields" :key="field.key">
                <label>{{ field.label }}</label>
                <div class="field-container">
                  <div class="input-wrapper">
                    <input 
                      v-if="!editingFields[field.key]"
                      :value="userInfo[field.key] || '-'"
                      :type="field.type"
                      readonly
                      class="readonly-field"
                    />
                    <input 
                      v-else
                      v-model="userInfo[field.key]"
                      :type="field.type"
                      class="editable-field"
                      @blur="stopEditing(field.key)"
                      @keyup.enter="stopEditing(field.key)"
                      ref="editInput"
                    />
                  </div>
                  <button 
                    class="edit-btn" 
                    @mousedown.prevent="toggleEdit(field.key)"
                    :title="editingFields[field.key] ? '저장' : '수정'"
                  >
                    <i :class="editingFields[field.key] ? 'pi pi-check' : 'pi pi-pencil'"></i>
                  </button>
                </div>
              </div>

              <!-- 여권 만료일 필드 - ModernDatePicker 사용 -->
              <div class="form-group">
                <label>여권 만료일</label>
                <div class="field-container date-field">
                  <div class="input-wrapper">
                    <div v-if="!editingFields.passportExpireDate" class="readonly-field date-readonly">
                      {{ formatDateDisplay(userInfo.passportExpireDate) || '-' }}
                    </div>
                    <ModernDatePicker 
                      v-else
                      v-model="userInfo.passportExpireDate"
                      placeholder="여권 만료일을 선택하세요"
                      @blur="stopEditing('passportExpireDate')"
                    />
                  </div>
                  <button 
                    class="edit-btn" 
                    @mousedown.prevent="toggleEdit('passportExpireDate')"
                    :title="editingFields.passportExpireDate ? '저장' : '수정'"
                  >
                    <i :class="editingFields.passportExpireDate ? 'pi pi-check' : 'pi pi-pencil'"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 성공/에러 메시지 -->
          <div v-if="message.show" style="margin: var(--spacing-xl) var(--spacing-3xl) 0;">
            <BaseMessage :type="message.type" @close="message.show = false">
              {{ message.text }}
            </BaseMessage>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn btn-cancel">
              <i class="pi pi-times"></i>
              닫기
            </button>
            <button @click="saveAllChanges" class="btn btn-submit" :disabled="!hasUnsavedChanges">
              <i class="pi pi-save"></i>
              전체 저장
            </button>
          </div>
          
          <!-- 회원탈퇴 섹션 -->
          <div class="danger-section">
            <div class="section-title danger">
              <i class="pi pi-exclamation-triangle"></i>
              <span>계정 삭제</span>
            </div>
            <p class="danger-description">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <button @click="showWithdrawModal" class="btn btn-danger">
              <i class="pi pi-trash"></i>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 회원탈퇴 확인 팝업 -->
    <div v-if="showWithdrawConfirmModal" class="modal-overlay" @click="closeWithdrawModal">
      <div class="modal-content withdraw-modal" @click.stop>
        <div class="modal-header danger-header">
          <div class="header-info">
            <div class="profile-icon danger-icon">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <div class="header-text">
              <h3>회원 탈퇴</h3>
              <p class="header-subtitle">정말로 계정을 삭제하시겠습니까?</p>
            </div>
          </div>
          <button class="btn btn-close" @click="closeWithdrawModal">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="withdraw-content">
            <div class="warning-message">
              <i class="pi pi-exclamation-triangle"></i>
              <div>
                <h4>계정 삭제 시 다음 정보가 영구적으로 삭제됩니다:</h4>
                <ul>
                  <li>개인정보 및 프로필 데이터</li>
                  <li>저장된 출장 일정 및 기록</li>
                  <li>업로드한 영수증 및 파일</li>
                </ul>
                <p><strong>이 작업은 되돌릴 수 없습니다.</strong></p>
              </div>
            </div>
            
            <div class="confirmation-input">
              <label>계속하려면 아래 입력란에 <strong>"회원 탈퇴"</strong>를 정확히 입력하세요:</label>
              <input 
                v-model="withdrawConfirmText"
                type="text"
                placeholder="회원 탈퇴"
                class="confirm-input"
                @input="checkWithdrawConfirmation"
              />
            </div>
            
            <!-- 에러 메시지 -->
            <div v-if="withdrawMessage.show" class="withdraw-message">
              <BaseMessage :type="withdrawMessage.type" @close="withdrawMessage.show = false">
                {{ withdrawMessage.text }}
              </BaseMessage>
            </div>
            
            <div class="withdraw-actions">
              <button type="button" @click="closeWithdrawModal" class="btn btn-cancel">
                <i class="pi pi-times"></i>
                취소
              </button>
              <button 
                @click="confirmWithdraw" 
                class="btn btn-danger-confirm" 
                :disabled="!isWithdrawConfirmed || isWithdrawing"
              >
                <i class="pi pi-trash"></i>
                <span v-if="isWithdrawing">탈퇴 중...</span>
                <span v-else>탈퇴 확정</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="js">
import { apiService } from '../../services/api';
import ModernDatePicker from '../common/ModernDatePicker.vue';
import BaseMessage from '../common/BaseMessage.vue';
import { showConfirm } from '../../utils/dialog.js';
import { pushMessage } from '@/utils/notify.js';

export default {
  name: "AppSidebar",
  components: {
    ModernDatePicker,
    BaseMessage
  },
  data() {
    return {
      showUserModal: false,
      showWithdrawConfirmModal: false,
      userInfo: {
        name: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        birthDate: '',
        passportNumber: '',
        passportExpireDate: ''
      },
      editingFields: {},
      originalUserInfo: {},
      message: {
        show: false,
        type: 'success',
        text: ''
      },
      // 회원탈퇴 관련 데이터
      withdrawConfirmText: '',
      isWithdrawConfirmed: false,
      isWithdrawing: false,
      withdrawMessage: {
        show: false,
        type: 'error',
        text: ''
      },
      basicFields: [
        { key: 'name', label: '이름(한글)', type: 'text' },
        { key: 'firstName', label: '이름(영문)', type: 'text' },
        { key: 'lastName', label: '성(영문)', type: 'text' },
        { key: 'phoneNumber', label: '전화번호', type: 'tel' },
        { key: 'birthDate', label: '생년월일', type: 'string' }
      ],
      passportFields: [
        { key: 'passportNumber', label: '여권번호', type: 'text' },
        { key: 'passportExpireDate', label: '여권 만료일', type: 'string' }
      ]
    };
  },
  computed: {
    hasUnsavedChanges() {
      return JSON.stringify(this.userInfo) !== JSON.stringify(this.originalUserInfo);
    },
    nonDateBasicFields() {
      return this.basicFields.filter(field => field.type !== 'string' || field.key !== 'birthDate');
    },
    nonDatePassportFields() {
      return this.passportFields.filter(field => field.type !== 'string' || field.key !== 'passportExpireDate');
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/main');
    },
    async logout() {
      const confirmed = await showConfirm({
        title: '로그아웃',
        message: '정말로 로그아웃하시겠습니까?',
        confirmText: '예',
        cancelText: '아니오',
        confirmVariant: 'primary',
        iconType: 'question'
      });

      if (confirmed) {
        try {
          await apiService.auth.logout();
          this.$router.push('/login');
        } catch (error) {
          console.error('로그아웃 실패:', error);
          // 에러가 발생해도 로그인 페이지로 이동
          this.$router.push('/login');
        }
      }
    },
    async showUserInfo() {
      try {
        const response = await apiService.user.getProfile();
        // 민감정보 조회 성공 - 모달 표시
        this.userInfo = { ...response.data };
        this.originalUserInfo = { ...response.data };
        this.showUserModal = true;
      } catch (error) {
        // 민감정보 조회 실패 시 확인 팝업 표시
        console.log('민감정보 조회 실패:', error);
        const confirmed = await showConfirm({
          title: '민감정보 입력 필요',
          message: '사용자 정보를 조회하려면 여권 정보 등 민감정보 입력이 필요합니다.\n지금 입력하시겠습니까?',
          confirmText: '입력하기',
          cancelText: '취소',
          confirmVariant: 'confirm',
          iconType: 'info'
        });

        if (confirmed) {
          // 민감정보 입력 화면으로 이동
          this.$router.push('/sensitive-info');
        }
      }
    },
    
    async fetchUserInfo() {
      try {
        const response = await apiService.user.getProfile();
        this.userInfo = { ...response.data };
        this.originalUserInfo = { ...response.data };
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // TODO: 에러 토스트 메시지 표시
      }
    },
    
    toggleEdit(fieldKey) {
      // 현재 편집 상태를 직접 토글
      const isCurrentlyEditing = this.editingFields[fieldKey];
      
      if (isCurrentlyEditing) {
        // 편집 모드 종료
        this.editingFields = {
          ...this.editingFields,
          [fieldKey]: false
        };
        console.log(`${fieldKey} 필드 편집 완료 (로컬 저장)`);
      } else {
        // 편집 모드 시작
        this.editingFields = {
          ...this.editingFields,
          [fieldKey]: true
        };
        this.$nextTick(() => {
          const inputs = this.$refs.editInput;
          if (inputs && inputs.length) {
            const input = inputs[inputs.length - 1];
            input.focus();
          }
        });
      }
    },
    
    startEditing(fieldKey) {
      // 편집 모드 시작 - 반응형 업데이트를 위해 객체 재할당
      this.editingFields = {
        ...this.editingFields,
        [fieldKey]: true
      };
      this.$nextTick(() => {
        const inputs = this.$refs.editInput;
        if (inputs && inputs.length) {
          const input = inputs[inputs.length - 1];
          input.focus();
        }
      });
    },
    
    stopEditing(fieldKey) {
      // 개별 필드 편집 완료 (로컬에서만 저장, API 호출 없음)
      // 반응형 업데이트를 위해 객체 재할당
      this.editingFields = {
        ...this.editingFields,
        [fieldKey]: false
      };
      // 로컬 상태만 업데이트, API 호출하지 않음
      console.log(`${fieldKey} 필드 편집 완료 (로컬 저장)`);
    },
    
    async saveAllChanges() {
      // 전체 저장 버튼을 눌렀을 때만 PATCH API 호출
      
      // Validation for name (Korean characters only)
      if (this.userInfo.name) {
        const koreanRegex = /^[가-힣\s]+$/;
        if (!koreanRegex.test(this.userInfo.name)) {
          this.showMessage('error', '이름(한글)은 한글만 입력해주세요.');
          return;
        }
      }

      // Validation for firstName and lastName (English uppercase letters only)
      if (this.userInfo.firstName) {
        const uppercaseEnglishRegex = /^[A-Z\s]+$/;
        if (!uppercaseEnglishRegex.test(this.userInfo.firstName)) {
          this.showMessage('error', '이름(영문)은 영문 대문자만 입력해주세요.');
          return;
        }
      }
      
      if (this.userInfo.lastName) {
        const uppercaseEnglishRegex = /^[A-Z\s]+$/;
        if (!uppercaseEnglishRegex.test(this.userInfo.lastName)) {
          this.showMessage('error', '성(영문)은 영문 대문자만 입력해주세요.');
          return;
        }
      }

      // Phone number validation
      if (this.userInfo.phoneNumber) {
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(this.userInfo.phoneNumber)) {
          this.showMessage('error', '전화번호는 10-11자리 숫자로 입력해주세요.');
          return;
        }
      }

      try {
        console.log('전체 저장 API 호출:', this.userInfo);
        
        await apiService.user.updateProfile(this.userInfo);
        
        // 성공 시 원본 데이터 업데이트
        this.originalUserInfo = { ...this.userInfo };
        this.editingFields = {};
        
  // 모달 닫고 글로벌 성공 알림
  this.closeModal();
  pushMessage({ type: 'success', text: '사용자 정보가 저장되었습니다.' });
      } catch (error) {
        console.error('사용자 정보 수정 실패:', error);
        // 에러 메시지 표시
        this.showMessage('error', '사용자 정보 저장 중 오류가 발생했습니다.');
      }
    },
    
    getGenderDisplay(gender) {
      switch (gender) {
        case 'MALE':
        case 'Male':
          return '남성';
        case 'FEMALE':
        case 'Female':
          return '여성';
        default: return '-';
      }
    },
    
    formatDateDisplay(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    closeModal() {
      this.showUserModal = false;
      this.editingFields = {};
      // 저장되지 않은 변경사항 되돌리기
      this.userInfo = { ...this.originalUserInfo };
    },
    
    showMessage(type, text) {
      this.message = { show: true, type, text };
      setTimeout(() => {
        this.message.show = false;
      }, 3000);
    },
    
    // 회원탈퇴 관련 메서드
    showWithdrawModal() {
      this.showUserModal = false; // 내 정보 모달 닫기
      this.showWithdrawConfirmModal = true;
      this.withdrawConfirmText = '';
      this.isWithdrawConfirmed = false;
      this.withdrawMessage.show = false;
    },
    
    closeWithdrawModal() {
      this.showWithdrawConfirmModal = false;
      this.withdrawConfirmText = '';
      this.isWithdrawConfirmed = false;
      this.isWithdrawing = false;
      this.withdrawMessage.show = false;
    },
    
    checkWithdrawConfirmation() {
      this.isWithdrawConfirmed = this.withdrawConfirmText === '회원 탈퇴';
    },
    
    async confirmWithdraw() {
      if (!this.isWithdrawConfirmed) {
        this.showWithdrawMessage('error', '"회원 탈퇴"를 정확히 입력해주세요.');
        return;
      }
      
      this.isWithdrawing = true;
      
      try {
        await apiService.user.deleteAccount();
        
        // 성공 시 로그아웃 처리
        this.closeWithdrawModal();
        pushMessage({ type: 'success', text: '회원탈퇴가 완료되었습니다.' });
        
        // 로그인 페이지로 이동
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
        
      } catch (error) {
        console.error('회원탈퇴 실패:', error);
        this.showWithdrawMessage('error', '회원탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        this.isWithdrawing = false;
      }
    },
    
    showWithdrawMessage(type, text) {
      this.withdrawMessage = { show: true, type, text };
      setTimeout(() => {
        this.withdrawMessage.show = false;
      }, 3000);
    }
  },
};
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background-color: var(--color-bg-secondary);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-2xl) 0;
  position: fixed;
  top: var(--sidebar-margin);
  left: var(--sidebar-margin);
  bottom: var(--sidebar-margin);
  z-index: var(--z-sidebar);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

/* 모바일: 하단 네비게이션 바 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: 68px;
    top: auto;
    left: 0;
    bottom: 0;
    flex-direction: row;
    padding: 0;
    border-radius: 0;
    border-top: 1px solid var(--color-border-secondary);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  }
}

.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--spacing-4xl);
  padding: 0 var(--spacing-lg);
}

@media (max-width: 768px) {
  .sidebar-header {
    display: none;
  }
}

.sidebar-logo-img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  background: transparent;
  display: block;
  cursor: pointer;
  border-radius: 16px;
  padding: 9px;
  transition: background-color 0.15s ease;
}

.sidebar-logo-img:hover {
  background-color: var(--color-bg-card-hover);
}

.menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-lg);
}

@media (max-width: 768px) {
  .menu-items {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 0 var(--spacing-md);
    gap: 0;
  }
}

.menu-items li {
  position: relative;
}

@media (max-width: 768px) {
  .menu-items li {
    flex: 1;
  }
  
  .menu-items li.mobile-only {
    display: block;
  }
}

.menu-items li.mobile-only {
  display: none;
}

.menu-items a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: var(--radius-lg);
  width: 100%;
  box-sizing: border-box;
  min-height: 48px;
}

@media (max-width: 768px) {
  .menu-items a {
    flex-direction: column;
    padding: var(--spacing-sm);
    gap: 2px;
    min-height: 56px;
    border-radius: var(--radius-md);
  }
}

.menu-items a:hover {
  background-color: var(--color-bg-card-hover);
  color: var(--color-text-primary);
}

.menu-items li.active a {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
}

.menu-items a i {
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  .menu-items a i {
    font-size: 1.3rem;
  }
  
  .menu-items a::after {
    content: attr(data-label);
    font-size: 10px;
    font-weight: var(--font-weight-medium);
    color: currentColor;
    margin-top: 2px;
  }
}

.menu-items li:hover::after {
  content: attr(data-label);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: var(--spacing-lg);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 14px;
  white-space: nowrap;
  z-index: 101;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-primary);
}

@media (max-width: 768px) {
  .menu-items li:hover::after {
    display: none;
  }
}

.sidebar-footer {
  margin-top: auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .sidebar-footer {
    display: none;
  }
}

.footer-button {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  position: relative;
}

.footer-button:hover {
  background-color: var(--color-bg-card-hover);
  color: var(--color-text-primary);
}

.footer-button i {
  font-size: 1.4rem;
}

.footer-button:hover::after {
  content: attr(data-label);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: var(--spacing-lg);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 14px;
  white-space: nowrap;
  z-index: 101;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border-primary);
}

/* Gender segmented control */
.gender-segmented {
  display: inline-flex;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  width: 100%;
  height: 40px;
}
.gender-option {
  flex: 1;
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-sm);
  transition: background 0.12s ease, color 0.12s ease;
}
.gender-option:not(:last-child) {
  border-right: 1px solid var(--color-border-secondary);
}
.gender-option.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  backdrop-filter: blur(12px);
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-2xl);
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  overflow: hidden;
  border: 1px solid var(--color-border-secondary);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3xl);
  background: var(--gradient-accent);
  border-bottom: 1px solid var(--color-border-secondary);
  position: relative;
}

.header-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.profile-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.profile-icon i {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
}

.header-text h3 {
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-body {
  padding: 0;
  max-height: calc(85vh - 120px);
  overflow-y: auto;
}

.form-section {
  padding: var(--spacing-3xl);
  border-bottom: 1px solid var(--color-border-secondary);
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.section-title i {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-2xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 영문 이름/성 필드를 한 줄에 배치 */
.form-group-row {
  display: flex;
  gap: var(--spacing-lg);
  grid-column: 1 / -1;
}

.form-group-row .form-group {
  flex: 1;
  min-width: 0;
}

.form-group.half-width {
  flex: 1;
  min-width: 0;
}

.form-group label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}

.field-container {
  display: flex;
  align-items: stretch;
  gap: var(--spacing-sm);
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
  border: 1px solid var(--color-border-primary);
}

.input-wrapper {
  flex: 1;
}

.readonly-field,
.editable-field {
  width: 100%;
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-primary);
  box-sizing: border-box;
  outline: none;
}

.readonly-field {
  background: transparent;
  color: var(--color-text-secondary);
  cursor: default;
}

.editable-field {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-primary);
}

.editable-field:focus {
  border-color: var(--color-primary-hover);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.editable-field option {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* 모달 내 커스텀 버튼 스타일 */
.edit-btn {
  background: var(--color-bg-card);
  border: none;
  color: var(--color-text-muted);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: auto;
  border: 1px solid transparent;
}

.edit-btn:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
  border-color: var(--color-primary-border);
  transform: scale(1.05);
}

.edit-btn i {
  font-size: var(--font-size-sm);
}

/* 날짜 필드 스타일 */
.date-field {
  align-items: stretch;
}

.date-field .input-wrapper {
  display: flex;
  align-items: stretch;
}

.date-readonly {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: var(--spacing-md);
}

/* ModernDatePicker 스타일 조정 */
.date-field .modern-datepicker-wrapper {
  width: 100%;
}

.date-field .datepicker-container .date-display {
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  margin: 0;
  min-height: 48px;
}

.date-field .datepicker-container.focused .date-display {
  border-color: var(--color-primary-hover);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-actions {
  display: flex;
  align-items: stretch; /* 두 버튼 모두 같은 높이 강제 */
  gap: var(--spacing-lg);
  padding: var(--spacing-xl) var(--spacing-2xl);
  margin-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-secondary);
}

.form-actions .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  height: 50px; /* 고정 동일 높이 */
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: 0 var(--spacing-xl);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
  min-width: 0;
  line-height: 1;
  box-sizing: border-box;
  border: 1px solid var(--color-border-secondary);
  margin: 0; /* 예측치 못한 상하 마진 제거 */
}

.form-actions .btn i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 1.1em;
}

.form-actions .btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.form-actions .btn-cancel { flex: 1 1 0; }

.form-actions .btn-submit { flex: 4 1 0; background: var(--gradient-accent); color: var(--color-text-primary); border: 1px solid var(--color-primary-border, transparent); height: 50px; }

.form-actions .btn-cancel:hover:not(:disabled) {
  background: var(--color-bg-card-hover);
  color: var(--color-text-primary);
}

.form-actions .btn-submit:hover:not(:disabled) {
  filter: brightness(0.95);
}

/* 회원탈퇴 섹션 스타일 */
.danger-section {
  padding: var(--spacing-3xl);
  border-top: 1px solid var(--color-border-secondary);
  background: var(--color-bg-tertiary);
}

.section-title.danger {
  color: var(--color-danger);
}

.section-title.danger i {
  color: var(--color-danger);
}

.danger-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-md) 0 var(--spacing-2xl);
  line-height: 1.5;
}

.btn-danger {
  background: var(--color-danger);
  color: var(--color-text-primary);
  border: 1px solid var(--color-danger);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  height: 44px;
  padding: 0 var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-danger:hover {
  background: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
  transform: translateY(-1px);
}

/* 회원탈퇴 확인 모달 스타일 */
.withdraw-modal {
  max-width: 480px;
  width: 90vw;
  box-sizing: border-box;
}

.danger-header {
  background: linear-gradient(135deg, var(--color-danger) 0%, var(--color-danger-hover) 100%);
}

.danger-icon {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.withdraw-content {
  padding: var(--spacing-2xl);
  box-sizing: border-box;
}

.warning-message {
  display: flex;
  gap: var(--spacing-lg);
  background: rgba(var(--color-danger-rgb), 0.1);
  border: 1px solid rgba(var(--color-danger-rgb), 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.warning-message > i {
  color: var(--color-danger);
  font-size: var(--font-size-lg);
  margin-top: 2px;
  flex-shrink: 0;
}

.warning-message h4 {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-md);
}

.warning-message ul {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 0 var(--spacing-md);
  padding-left: var(--spacing-xl);
}

.warning-message li {
  margin-bottom: var(--spacing-xs);
}

.warning-message p {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.confirmation-input {
  margin-bottom: var(--spacing-2xl);
}

.confirmation-input label {
  display: block;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-md);
}

.confirm-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  min-width: 0;
}

.confirm-input:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(var(--color-danger-rgb), 0.1);
}

.confirm-input::placeholder {
  color: var(--color-text-muted);
}

.withdraw-message {
  margin-bottom: var(--spacing-2xl);
}

.withdraw-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: stretch;
  box-sizing: border-box;
}

.withdraw-actions .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  height: 50px;
  padding: 0 var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  box-sizing: border-box;
  line-height: 1;
}

.withdraw-actions .btn-cancel {
  flex: 1;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  border-color: var(--color-border-secondary);
}

.withdraw-actions .btn-cancel:hover {
  background: var(--color-bg-card-hover);
  color: var(--color-text-primary);
}

.withdraw-actions .btn-danger-confirm {
  flex: 2;
  background: var(--color-danger);
  color: var(--color-text-primary);
  border-color: var(--color-danger);
}

.withdraw-actions .btn-danger-confirm:hover:not(:disabled) {
  background: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
  transform: translateY(-1px);
}

.withdraw-actions .btn-danger-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }
  
  .withdraw-modal {
    width: 95vw;
    max-width: none;
  }
  
  .modal-content {
    max-width: 100%;
  }
  
  .modal-header {
    padding: var(--spacing-2xl);
  }
  
  .header-info {
    gap: var(--spacing-md);
  }
  
  .profile-icon {
    width: 48px;
    height: 48px;
  }
  
  .profile-icon i {
    font-size: var(--font-size-lg);
  }
  
  .form-section {
    padding: var(--spacing-2xl);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
  
  /* 모바일에서는 영문 이름/성 필드도 세로 배치 */
  .form-group-row {
    flex-direction: column;
    gap: var(--spacing-xl);
  }
  
  .form-actions {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-2xl);
  }
  
  .cancel-btn,
  .save-btn {
    justify-content: center;
    width: 100%;
  }
  
  .danger-section {
    padding: var(--spacing-2xl);
  }
  
  .withdraw-content {
    padding: var(--spacing-xl);
  }
  
  .warning-message {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }
  
  .withdraw-actions {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .withdraw-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-text h3 {
    font-size: var(--font-size-lg);
  }
  
  .header-subtitle {
    font-size: var(--font-size-xs);
  }
  
  .section-title {
    font-size: var(--font-size-base);
  }
  
  .withdraw-modal {
    width: 98vw;
    margin: 0;
  }
  
  .withdraw-content {
    padding: var(--spacing-md);
  }
  
  .warning-message {
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
  }
  
  .confirmation-input label {
    font-size: var(--font-size-xs);
  }
  
  .confirm-input {
    padding: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
}
</style>
