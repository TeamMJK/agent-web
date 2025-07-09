<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <button class="sidebar-logo-button" @click="goToHome">
        <i class="pi pi-prime"></i>
      </button>
    </div>
    <ul class="menu-items">
      <li data-label="메인" :class="{ active: $route.name === 'Main' }">
        <router-link to="/main">
          <i class="pi pi-home"></i>
        </router-link>
      </li>
      <li data-label="워크스페이스" :class="{ active: $route.name === 'WorkSpace' }">
        <router-link to="/workspace">
          <i class="pi pi-briefcase"></i>
        </router-link>
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
          <h3>내 정보</h3>
          <button class="close-btn" @click="closeModal">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group" v-for="field in userFields" :key="field.key">
            <label>{{ field.label }}</label>
            <div class="field-container">
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
              <button 
                class="edit-btn" 
                @click="toggleEdit(field.key)"
                :title="editingFields[field.key] ? '저장' : '수정'"
              >
                <i :class="editingFields[field.key] ? 'pi pi-check' : 'pi pi-pencil'"></i>
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>성별</label>
            <div class="field-container">
              <select 
                v-if="editingFields.gender"
                v-model="userInfo.gender"
                @blur="stopEditing('gender')"
                class="editable-field"
              >
                <option value="">선택하세요</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
              <input 
                v-else
                :value="getGenderDisplay(userInfo.gender)"
                readonly
                class="readonly-field"
              />
              <button 
                class="edit-btn" 
                @click="toggleEdit('gender')"
                :title="editingFields.gender ? '저장' : '수정'"
              >
                <i :class="editingFields.gender ? 'pi pi-check' : 'pi pi-pencil'"></i>
              </button>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">닫기</button>
            <button @click="saveAllChanges" class="save-btn" :disabled="!hasUnsavedChanges">
              전체 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { apiService } from '../services/api';

export default {
  name: "AppSidebar",
  data() {
    return {
      showUserModal: false,
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
      userFields: [
        { key: 'name', label: '이름', type: 'text' },
        { key: 'email', label: '이메일', type: 'email' },
        { key: 'firstName', label: '성', type: 'text' },
        { key: 'lastName', label: '이름', type: 'text' },
        { key: 'phoneNumber', label: '전화번호', type: 'tel' },
        { key: 'birthDate', label: '생년월일', type: 'date' },
        { key: 'passportNumber', label: '여권번호', type: 'text' },
        { key: 'passportExpireDate', label: '여권 만료일', type: 'date' }
      ]
    };
  },
  computed: {
    hasUnsavedChanges() {
      return JSON.stringify(this.userInfo) !== JSON.stringify(this.originalUserInfo);
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/main');
    },
    logout() {
      this.$router.push('/');
    },
    async showUserInfo() {
      this.showUserModal = true;
      await this.fetchUserInfo();
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
      if (this.editingFields[fieldKey]) {
        this.stopEditing(fieldKey);
      } else {
        this.startEditing(fieldKey);
      }
    },
    
    startEditing(fieldKey) {
      this.$set(this.editingFields, fieldKey, true);
      this.$nextTick(() => {
        const inputs = this.$refs.editInput;
        if (inputs && inputs.length) {
          const input = inputs[inputs.length - 1];
          input.focus();
        }
      });
    },
    
    async stopEditing(fieldKey) {
      if (this.editingFields[fieldKey]) {
        try {
          // 개별 필드 저장
          await this.saveFieldChange(fieldKey);
          this.$set(this.editingFields, fieldKey, false);
        } catch (error) {
          console.error(`${fieldKey} 저장 실패:`, error);
          // 에러 발생 시 원래 값으로 되돌리기
          this.userInfo[fieldKey] = this.originalUserInfo[fieldKey];
        }
      }
    },
    
    async saveFieldChange(fieldKey) {
      const updateData = {
        [fieldKey]: this.userInfo[fieldKey]
      };
      
      await apiService.user.updateProfile(updateData);
      // 성공 시 원본 데이터 업데이트
      this.originalUserInfo[fieldKey] = this.userInfo[fieldKey];
    },
    
    async saveAllChanges() {
      try {
        await apiService.user.updateProfile(this.userInfo);
        this.originalUserInfo = { ...this.userInfo };
        this.editingFields = {};
        // TODO: 성공 메시지 표시
      } catch (error) {
        console.error('사용자 정보 수정 실패:', error);
        // TODO: 에러 메시지 표시
      }
    },
    
    getGenderDisplay(gender) {
      switch (gender) {
        case 'MALE': return '남성';
        case 'FEMALE': return '여성';
        default: return '-';
      }
    },
    
    closeModal() {
      this.showUserModal = false;
      this.editingFields = {};
      // 저장되지 않은 변경사항 되돌리기
      this.userInfo = { ...this.originalUserInfo };
    }
  },
};
</script>

<style scoped>
.sidebar {
  width: 80px;
  background-color: #232323;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  position: fixed;
  top: 16px;
  left: 16px;
  bottom: 16px;
  z-index: 100;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 16px;
}

.sidebar-logo-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #ffffff;
  font-size: 1.8rem;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.sidebar-logo-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}

.menu-items li {
  position: relative;
}

.menu-items a {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #888888;
  text-decoration: none;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  min-height: 48px;
}

.menu-items a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.menu-items li.active a {
  background-color: #4A90E2;
  color: #ffffff;
}

.menu-items a i {
  font-size: 1.4rem;
}

.menu-items li:hover::after {
  content: attr(data-label);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 16px;
  background-color: #2a2a2a;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 101;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 1px solid #333333;
}

.sidebar-footer {
  margin-top: auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-button {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: #888888;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  position: relative;
}

.footer-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
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
  margin-left: 16px;
  background-color: #2a2a2a;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 101;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border: 1px solid #333333;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #232323;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #333333;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #333333;
}

.modal-header h3 {
  color: #ffffff;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #888888;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}

.close-btn:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #ffffff;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4A90E2;
}

.form-group select option {
  background-color: #1a1a1a;
  color: #ffffff;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.cancel-btn,
.save-btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background-color: #333333;
  color: #ffffff;
}

.cancel-btn:hover {
  background-color: #444444;
}

.save-btn {
  background-color: #4A90E2;
  color: #ffffff;
}

.save-btn:hover {
  background-color: #357ABD;
}

.field-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.readonly-field {
  flex: 1;
  padding: 12px;
  background-color: #2a2a2a;
  border: 1px solid #333333;
  border-radius: 6px;
  color: #cccccc;
  font-size: 0.9rem;
  box-sizing: border-box;
  cursor: default;
}

.editable-field {
  flex: 1;
  padding: 12px;
  background-color: #1a1a1a;
  border: 1px solid #4A90E2;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.editable-field:focus {
  outline: none;
  border-color: #357ABD;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.edit-btn {
  background: none;
  border: none;
  color: #888888;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.edit-btn:hover {
  color: #4A90E2;
  background-color: rgba(74, 144, 226, 0.1);
}

.edit-btn i {
  font-size: 0.9rem;
}

.save-btn:disabled {
  background-color: #333333;
  color: #666666;
  cursor: not-allowed;
}

.save-btn:disabled:hover {
  background-color: #333333;
}
</style>
