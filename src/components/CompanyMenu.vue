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
        
        <BaseMessage 
          v-if="creationMessage" 
          :type="creationMessageType"
          size="small"
        >
          {{ creationMessage }}
        </BaseMessage>
        <div class="form-actions">
          <BaseButton variant="cancel" @click="closeCreateCompanyModal">취소</BaseButton>
          <BaseButton variant="confirm" @click="handleCreateCompany">생성</BaseButton>
        </div>
      </div>
    </div>

    <!-- Company Join Modal -->
    <div v-if="showJoinCompanyModal" class="modal-overlay" @click.self="closeJoinCompanyModal">
      <div class="modal-content">
        <h2>회사 참여</h2>
        <p>초대 코드를 입력하여 기존 회사에 참여하세요.</p>
        <input type="text" v-model="invitationCode" placeholder="초대 코드를 입력하세요" class="company-name-input"/>
        <BaseMessage 
          v-if="joinMessage" 
          :type="joinMessageType"
          size="small"
        >
          {{ joinMessage }}
        </BaseMessage>
        <div class="form-actions">
          <BaseButton variant="cancel" @click="closeJoinCompanyModal">취소</BaseButton>
          <BaseButton variant="confirm" @click="handleJoinCompany">참가</BaseButton>
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
        
        <BaseMessage 
          v-if="invitationMessage" 
          :type="invitationMessageType"
          size="small"
        >
          {{ invitationMessage }}
        </BaseMessage>
        
        <div class="form-actions">
          <BaseButton variant="cancel" @click="closeInvitationModal">닫기</BaseButton>
          <BaseButton v-if="!generatedInvitationCode" variant="confirm" @click="handleGenerateInvitationCode">코드 생성</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api.js';
import BaseButton from './BaseButton.vue';
import BaseMessage from './BaseMessage.vue';

export default {
  name: 'CompanyMenu',
  components: {
    BaseButton,
    BaseMessage
  },
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
  background: rgba(135, 81, 197, 0.372);
  border: none;
  color: white;
  cursor: pointer;
  padding: 12px;
  border-radius: 40%;
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
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-modal);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  backdrop-filter: blur(12px);
}

.modal-content {
  background-color: var(--color-bg-secondary);
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  border: 1px solid var(--color-border-secondary);
  color: var(--color-text-primary);
  text-align: center;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
  position: relative;
  margin: auto;
  overflow: visible;
}

.modal-content h2 {
  margin-top: 0;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.modal-content p {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.company-name-input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  margin-bottom: 8px;
  box-sizing: border-box;
}

.company-name-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  outline: none;
}


.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
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

/* 워크스페이스 선택 드롭다운 스타일 */
.workspace-select-container {
  margin-bottom: 16px;
  text-align: left;
}

.workspace-label {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.custom-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  box-sizing: border-box;
}

.dropdown-trigger:hover {
  border-color: var(--color-border-hover);
}

.dropdown-open .dropdown-trigger {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.selected-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.placeholder-text {
  color: var(--color-text-muted);
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  color: var(--color-text-muted);
}

.arrow-up {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  z-index: 2000;
  max-height: none;
  overflow-y: visible;
  margin-top: 4px;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border-light);
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background-color: var(--color-bg-hover);
}

.workspace-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.workspace-image {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.workspace-emoji {
  font-size: 16px;
}

.option-text {
  flex: 1;
}

.invitation-code-display {
  margin: 16px 0;
  text-align: left;
}

.invitation-label {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.invitation-code-box {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border-secondary);
  border-radius: 8px;
  margin-bottom: 8px;
}

.invitation-code {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
  color: var(--color-text-primary);
  letter-spacing: 1px;
}
</style>
