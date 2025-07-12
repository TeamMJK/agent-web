<template>
  <div class="company-menu-container" @mouseenter="showMenu = true" @mouseleave="hideMenuWithDelay">
    <button class="icon-btn company-icon">
      <i class="pi pi-building"></i>
    </button>
    <div v-if="showMenu" class="company-menu-modal" @mouseenter="cancelHideMenu" @mouseleave="hideMenuWithDelay">
      <div v-if="userCompany" class="company-info">
        <div class="company-item">
          {{ userCompany }}
        </div>
      </div>
      <div v-else class="no-company-info">
        회사 정보 없음
      </div>
      <div class="menu-divider"></div>
      
      <!-- 회사가 있는 경우: 초대 코드 생성만 표시 -->
      <template v-if="userCompany">
        <button class="menu-item" @click="openInvitationModal">회사 초대 코드 생성</button>
      </template>
      
      <!-- 회사가 없는 경우: 생성과 참여 둘 다 표시 -->
      <template v-else>
        <button class="menu-item" @click="openCreateCompanyModal">회사 생성</button>
        <button class="menu-item" @click="openJoinCompanyModal">회사 초대 코드로 참여</button>
      </template>
    </div>

    <!-- Company Creation Modal -->
    <div v-if="showCreateCompanyModal" class="modal-overlay" @click.self="closeCreateCompanyModal">
      <div class="modal-content">
        <h2>회사 생성</h2>
        <p>새로운 회사를 생성하여 팀원들과 출장 계획을 함께 관리하세요.</p>
        
        <input type="text" v-model="companyName" placeholder="회사 이름을 입력하세요" class="company-name-input"/>
        
        <div class="workspace-select-container">
          <label class="workspace-label">워크스페이스 유형</label>
          
          <!-- 커스텀 드롭다운 -->
          <div class="custom-dropdown" :class="{ 'dropdown-open': isDropdownOpen }">
            <div class="dropdown-trigger" @click="toggleDropdown">
              <div v-if="selectedWorkspace" class="selected-option">
                <div class="workspace-icon">
                  <img v-if="selectedWorkspace === 'NOTION'" 
                       src="@/assets/notion-icon.png" 
                       alt="Notion" 
                       class="workspace-image" />
                  <img v-else-if="selectedWorkspace === 'SLACK'" 
                       src="@/assets/slack-icon.png" 
                       alt="Slack" 
                       class="workspace-image" />
                  <img v-else-if="selectedWorkspace === 'GOOGLE_WORKSPACE'" 
                       src="@/assets/google-workspace-icon.png" 
                       alt="Google Workspace" 
                       class="workspace-image" />
                  <span v-else-if="selectedWorkspace === 'NONE'" class="workspace-emoji">❌</span>
                </div>
                <span class="option-text">{{ getWorkspaceDisplayName(selectedWorkspace) }}</span>
              </div>
              <span v-else class="placeholder-text">워크스페이스를 선택하세요</span>
              <i class="pi pi-chevron-down dropdown-arrow" :class="{ 'arrow-up': isDropdownOpen }"></i>
            </div>
            
            <div v-if="isDropdownOpen" class="dropdown-menu">
              <div 
                v-for="option in workspaceOptions" 
                :key="option.value"
                class="dropdown-option"
                @click="selectWorkspace(option.value)"
              >
                <div class="workspace-icon">
                  <img v-if="option.value === 'NOTION'" 
                       src="@/assets/notion-icon.png" 
                       alt="Notion" 
                       class="workspace-image" />
                  <img v-else-if="option.value === 'SLACK'" 
                       src="@/assets/slack-icon.png" 
                       alt="Slack" 
                       class="workspace-image" />
                  <img v-else-if="option.value === 'GOOGLE_WORKSPACE'" 
                       src="@/assets/google-workspace-icon.png" 
                       alt="Google Workspace" 
                       class="workspace-image" />
                  <span v-else-if="option.value === 'NONE'" class="workspace-emoji">❌</span>
                </div>
                <span class="option-text">{{ option.label }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="creationMessage" :class="['creation-message', `message-${creationMessageType}`]">
          {{ creationMessage }}
        </div>
        <div class="modal-actions">
          <button @click="closeCreateCompanyModal" class="btn-cancel">취소</button>
          <button @click="handleCreateCompany" class="btn-confirm">생성</button>
        </div>
      </div>
    </div>

    <!-- Company Join Modal -->
    <div v-if="showJoinCompanyModal" class="modal-overlay" @click.self="closeJoinCompanyModal">
      <div class="modal-content">
        <h2>회사 참여</h2>
        <p>초대 코드를 입력하여 기존 회사에 참여하세요.</p>
        <input type="text" v-model="invitationCode" placeholder="초대 코드를 입력하세요" class="company-name-input"/>
        <div v-if="joinMessage" :class="['creation-message', `message-${joinMessageType}`]">
          {{ joinMessage }}
        </div>
        <div class="modal-actions">
          <button @click="closeJoinCompanyModal" class="btn-cancel">취소</button>
          <button @click="handleJoinCompany" class="btn-confirm">참가</button>
        </div>
      </div>
    </div>

    <!-- Invitation Code Generation Modal -->
    <div v-if="showInvitationModal" class="modal-overlay" @click.self="closeInvitationModal">
      <div class="modal-content">
        <h2>초대 코드 생성</h2>
        <p>팀원들이 회사에 참여할 수 있는 초대 코드를 생성합니다.</p>
        
        <div v-if="generatedInvitationCode" class="invitation-code-display">
          <label class="invitation-label">생성된 초대 코드</label>
          <div class="invitation-code-box">
            <span class="invitation-code">{{ generatedInvitationCode }}</span>
            <button @click="copyInvitationCode" class="btn-copy">
              <i class="pi pi-copy"></i>
            </button>
          </div>
          <p class="invitation-note">이 코드를 팀원들과 공유하여 회사에 초대하세요.</p>
        </div>
        
        <div v-if="invitationMessage" :class="['creation-message', `message-${invitationMessageType}`]">
          {{ invitationMessage }}
        </div>
        
        <div class="modal-actions">
          <button @click="closeInvitationModal" class="btn-cancel">닫기</button>
          <button v-if="!generatedInvitationCode" @click="handleGenerateInvitationCode" class="btn-confirm">코드 생성</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api.js';

export default {
  name: 'CompanyMenu',
  data() {
    return {
      showMenu: false,
      showCreateCompanyModal: false,
      showJoinCompanyModal: false,
      showInvitationModal: false,
      companyName: '',
      selectedWorkspace: '',
      isDropdownOpen: false,
      invitationCode: '',
      generatedInvitationCode: '',
      hideMenuTimeout: null,
      userCompany: null,
      creationMessage: '',
      creationMessageType: '',
      joinMessage: '',
      joinMessageType: '',
      invitationMessage: '',
      invitationMessageType: '',
      workspaceOptions: [
        { value: 'NOTION', label: 'Notion' },
        { value: 'SLACK', label: 'Slack' },
        { value: 'GOOGLE_WORKSPACE', label: 'Google Workspace' },
        { value: 'NONE', label: '없음' }
      ]
    };
  },
  methods: {
    showMenuOnHover() {
      if (this.hideMenuTimeout) clearTimeout(this.hideMenuTimeout);
      this.showMenu = true;
    },
    hideMenuWithDelay() {
      this.hideMenuTimeout = setTimeout(() => {
        this.showMenu = false;
      }, 300);
    },
    cancelHideMenu() {
      if (this.hideMenuTimeout) clearTimeout(this.hideMenuTimeout);
    },
    openCreateCompanyModal() {
      this.showMenu = false;
      this.showCreateCompanyModal = true;
      this.creationMessage = '';
      this.creationMessageType = '';
      this.selectedWorkspace = '';
      this.isDropdownOpen = false;
    },
    closeCreateCompanyModal() {
      this.showCreateCompanyModal = false;
      this.companyName = '';
      this.selectedWorkspace = '';
      this.isDropdownOpen = false;
      this.creationMessage = '';
      this.creationMessageType = '';
    },
    openJoinCompanyModal() {
      this.showMenu = false;
      this.showJoinCompanyModal = true;
      this.joinMessage = '';
      this.joinMessageType = '';
    },
    closeJoinCompanyModal() {
      this.showJoinCompanyModal = false;
      this.invitationCode = '';
      this.joinMessage = '';
      this.joinMessageType = '';
    },
    openInvitationModal() {
      this.showMenu = false;
      this.showInvitationModal = true;
      this.generatedInvitationCode = '';
      this.invitationMessage = '';
      this.invitationMessageType = '';
    },
    closeInvitationModal() {
      this.showInvitationModal = false;
      this.generatedInvitationCode = '';
      this.invitationMessage = '';
      this.invitationMessageType = '';
    },
    async handleJoinCompany() {
      this.joinMessage = '';
      if (!this.invitationCode.trim()) {
        this.joinMessage = '초대 코드를 입력해주세요.';
        this.joinMessageType = 'error';
        return;
      }
      try {
        const response = await apiService.company.join({ invitationCode: this.invitationCode });
        if (response.status === 200) {
          const companyName = response.data;
          this.joinMessage = `'${companyName}' 회사에 성공적으로 참가했습니다.`;
          this.joinMessageType = 'success';
          await this.fetchUserCompany();
          setTimeout(() => {
            this.closeJoinCompanyModal();
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to join company:', error);
        this.joinMessage = '회사 참가에 실패했습니다. 초대 코드를 확인해주세요.';
        this.joinMessageType = 'error';
      }
    },
    async handleCreateCompany() {
      this.creationMessage = '';
      if (!this.companyName.trim()) {
        this.creationMessage = '회사 이름을 입력해주세요.';
        this.creationMessageType = 'error';
        return;
      }
      if (!this.selectedWorkspace) {
        this.creationMessage = '워크스페이스 유형을 선택해주세요.';
        this.creationMessageType = 'error';
        return;
      }
      
      try {
        const response = await apiService.company.create({ 
          name: this.companyName,
          workspace: this.selectedWorkspace
        });
        if (response.status === 201) {
            this.creationMessage = '회사가 성공적으로 생성되었습니다.';
            this.creationMessageType = 'success';
            await this.fetchUserCompany();
            setTimeout(() => {
              this.closeCreateCompanyModal();
            }, 1500);
        }
      } catch (error) {
        console.error('Failed to create company:', error);
        this.creationMessage = '회사 생성에 실패했습니다.';
        this.creationMessageType = 'error';
      }
    },
    async handleGenerateInvitationCode() {
      this.invitationMessage = '';
      try {
        const response = await apiService.company.generateInvitationCode();
        if (response.status === 201) {
          this.generatedInvitationCode = response.data;
          this.invitationMessage = '초대 코드가 성공적으로 생성되었습니다.';
          this.invitationMessageType = 'success';
        }
      } catch (error) {
        console.error('Failed to generate invitation code:', error);
        this.invitationMessage = '초대 코드 생성에 실패했습니다. 다시 시도해주세요.';
        this.invitationMessageType = 'error';
      }
    },
    async copyInvitationCode() {
      try {
        await navigator.clipboard.writeText(this.generatedInvitationCode);
        this.invitationMessage = '초대 코드가 클립보드에 복사되었습니다.';
        this.invitationMessageType = 'success';
        setTimeout(() => {
          this.invitationMessage = '';
        }, 2000);
      } catch (error) {
        console.error('Failed to copy invitation code:', error);
        this.invitationMessage = '코드 복사에 실패했습니다.';
        this.invitationMessageType = 'error';
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectWorkspace(value) {
      this.selectedWorkspace = value;
      this.isDropdownOpen = false;
    },
    getWorkspaceDisplayName(workspace) {
      switch (workspace) {
        case 'NOTION': return 'Notion';
        case 'SLACK': return 'Slack';
        case 'GOOGLE_WORKSPACE': return 'Google Workspace';
        case 'NONE': return '없음';
        default: return '';
      }
    },
    async fetchUserCompany() {
      try {
        const response = await apiService.company.getList();
        this.userCompany = response.data; // API 응답이 string이므로 직접 할당
      } catch (error) {
        console.error('Failed to fetch user company:', error);
        this.userCompany = null;
      }
    },
  },
  mounted() {
    this.fetchUserCompany();
  },
  beforeUnmount() {
    if (this.hideMenuTimeout) {
      clearTimeout(this.hideMenuTimeout);
    }
  }
};
</script>

<style scoped>
.company-menu-container {
  position: relative;
  z-index: 110;
}

.company-icon {
  background: none;
  border: none;
  color: #888888;
  cursor: pointer;
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.company-icon:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

.company-menu-modal {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 8px;
  min-width: 220px;
  z-index: 100;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.company-info {
  padding: 4px;
}

.company-list {
  padding: 4px;
}

.company-item {
  padding: 8px 12px;
  color: #e0e0e0;
  font-size: 14px;
  border-radius: 4px;
  background-color: #3a3a3a;
}

.no-company-info {
  padding: 10px 12px;
  color: #888;
  font-size: 14px;
  text-align: center;
}

.menu-divider {
  height: 1px;
  background-color: #444;
  margin: 8px 0;
}

.menu-item {
  background: none;
  border: none;
  color: #e0e0e0;
  padding: 10px 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.menu-item:hover {
  background-color: #3a3a3a;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #232323;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  border: 1px solid #333;
  color: #fff;
  text-align: center;
}

.modal-content h2 {
  margin-top: 0;
  font-weight: 600;
}

.modal-content p {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 20px;
}

.company-name-input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.creation-message {
  font-size: 14px;
  padding: 8px 0;
  margin-bottom: 12px;
  text-align: center;
}

.message-error {
  color: #ff8a8a;
}

.message-success {
  color: #8aff8a;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel, .btn-confirm {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel {
  background-color: #444;
  color: #fff;
}

.btn-confirm {
  background-color: var(--color-primary, #357ABD);
  color: #fff;
}

.workspace-select-container {
  margin-bottom: 16px;
}

.workspace-label {
  display: block;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  margin-bottom: 8px;
}

/* 커스텀 드롭다운 스타일 */
.custom-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  width: 100%;
  padding: 12px 16px;
  /* background: var(--gradient-primary); */
  border: 1px solid var(--color-border-secondary);
  border-radius: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-family: var(--font-family-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  outline: none;
  backdrop-filter: blur(10px);
}

.dropdown-trigger:hover {
  border-color: var(--color-border-hover);
  background: linear-gradient(135deg, var(--color-bg-tertiary) 0%, #3a3a3a 100%);
}

.dropdown-open .dropdown-trigger {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  background: linear-gradient(135deg, var(--color-bg-tertiary) 0%, #3a3a3a 100%);
}

.selected-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.placeholder-text {
  color: var(--color-text-placeholder);
}

.option-text {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.dropdown-arrow {
  color: var(--color-text-muted);
  font-size: 14px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  border: 1px solid var(--color-border-secondary);
  border-radius: 12px;
  backdrop-filter: blur(30px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border-secondary);
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background: var(--color-bg-card-hover);
  color: var(--color-text-primary);
}

.workspace-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.workspace-image {
  width: 18px;
  height: 18px;
  object-fit: contain;
  border-radius: 3px;
}

.workspace-emoji {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 초대 코드 모달 스타일 */
.invitation-code-display {
  margin: 20px 0;
  text-align: left;
}

.invitation-label {
  display: block;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  margin-bottom: 8px;
}

.invitation-code-box {
  display: flex;
  align-items: center;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-secondary);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.invitation-code {
  flex: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  color: var(--color-text-primary);
  letter-spacing: 1px;
  font-weight: var(--font-weight-medium);
}

.btn-copy {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 8px;
}

.btn-copy:hover {
  background: var(--color-bg-card-hover);
  color: var(--color-text-primary);
}

.invitation-note {
  color: var(--color-text-muted);
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
}
</style>
