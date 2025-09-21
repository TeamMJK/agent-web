<template>
  <div class="company-menu-container" @mouseenter="showMenu = true" @mouseleave="hideMenuWithDelay">
    <!-- 메뉴를 숨기지 않는 경우에만 아이콘과 드롭다운 표시 -->
    <template v-if="!hideMenu">
      <button class="icon-btn company-icon">
        <i class="pi pi-building"></i>
      </button>
      <div v-if="showMenu" class="company-menu-modal" @mouseenter="cancelHideMenu" @mouseleave="hideMenuWithDelay">
        <div v-if="userCompany" class="company-info rich">
          <div class="company-header-line">
            <i class="pi pi-building company-header-icon"></i>
            <span class="company-name-text">{{ userCompany.name }}</span>
          </div>
          <div v-if="userCompany.workspaces && userCompany.workspaces.length" class="workspace-chip-list">
            <span v-for="ws in userCompany.workspaces" :key="ws" class="workspace-chip">
              <span class="chip-badge" :data-type="ws">{{ workspaceShort(ws) }}</span>
              {{ getWorkspaceDisplayName(ws) }}
            </span>
          </div>
        </div>
        <div v-else class="no-company-info">
          회사 정보 없음
        </div>
  <!-- divider removed -->
        <template v-if="userCompany">
          <button class="menu-item" @click="openEditCompanyModal">회사 정보 수정</button>
          <button class="menu-item" @click="openInvitationModal">초대 코드 발송</button>
          <button class="menu-item danger" @click="confirmDeleteCompany">회사 삭제</button>
        </template>
        <template v-else>
          <button class="menu-item" @click="openCreateCompanyModal">회사 생성</button>
          <button class="menu-item" @click="openJoinCompanyModal">초대 코드로 참여</button>
        </template>
      </div>
    </template>

    <!-- Company Creation Modal -->
    <div v-if="showCreateCompanyModal" class="modal-overlay" @click.self="closeCreateCompanyModal">
      <div class="modal-content">
        <h2>회사 생성</h2>
        <p>새로운 회사를 생성하여 팀원들과 출장 계획을 함께 관리하세요.</p>
        
        <input type="text" v-model="companyName" placeholder="회사 이름을 입력하세요" class="company-name-input"/>
        <div class="workspace-multi-select">
          <label class="workspace-label">워크스페이스 선택 (복수 선택)</label>
          <div class="workspace-options-grid">
            <div v-for="option in workspaceOptions" :key="option.value" class="workspace-option" :class="{selected: selectedWorkspaces.includes(option.value)}" @click="toggleWorkspace(option.value)">
              <div class="icon-wrap">
                <img v-if="option.value === 'NOTION'" src="@/assets/notion-icon.png" alt="Notion" class="workspace-image" />
                <img v-else-if="option.value === 'SLACK'" src="@/assets/slack-icon.png" alt="Slack" class="workspace-image" />
                <span v-else-if="option.value === 'NONE'" class="workspace-emoji">❌</span>
              </div>
              <span class="label">{{ option.label }}</span>
              <i v-if="selectedWorkspaces.includes(option.value)" class="pi pi-check checkmark"></i>
            </div>
          </div>
          
          <!-- 동적 워크스페이스 설정 입력 필드 -->
          <div v-if="selectedWorkspaces.includes('NOTION')" class="workspace-config">
            <label class="config-label">Notion 설정</label>
            <input 
              type="password" 
              v-model="workspaceConfigs.NOTION.token" 
              placeholder="Notion API Token을 입력하세요" 
              class="config-input"
            />
            <input 
              type="text" 
              v-model="workspaceConfigs.NOTION.businessTripDatabaseId" 
              placeholder="출장 Database ID를 입력하세요" 
              class="config-input"
            />
            <input 
              type="text" 
              v-model="workspaceConfigs.NOTION.receiptDatabaseId" 
              placeholder="영수증 Database ID를 입력하세요" 
              class="config-input"
            />
          </div>
          
          <div v-if="selectedWorkspaces.includes('SLACK')" class="workspace-config">
            <label class="config-label">Slack 설정</label>
            <input 
              type="password" 
              v-model="workspaceConfigs.SLACK.token" 
              placeholder="Slack API Token을 입력하세요" 
              class="config-input"
            />
            <input 
              type="text" 
              v-model="workspaceConfigs.SLACK.channelId" 
              placeholder="Slack Channel ID를 입력하세요" 
              class="config-input"
            />
          </div>
          
          <div v-if="selectedWorkspaces.length" class="selected-chips">
            <span v-for="ws in selectedWorkspaces" :key="ws" class="workspace-chip small">
              {{ getWorkspaceDisplayName(ws) }}
              <button type="button" class="remove-chip" @click.stop="removeWorkspace(ws)">×</button>
            </span>
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

    <!-- Company Edit Modal -->
    <div v-if="showEditCompanyModal" class="modal-overlay" @click.self="closeEditCompanyModal">
      <div class="modal-content">
        <h2>회사 정보 수정</h2>
        <p>회사명과 워크스페이스를 수정할 수 있습니다.</p>
        <input type="text" v-model="editCompanyName" placeholder="새 회사 이름" class="company-name-input"/>
        <div class="workspace-multi-select">
          <label class="workspace-label">워크스페이스 (복수 선택)</label>
          <div class="workspace-options-grid">
            <div v-for="option in workspaceOptions" :key="option.value" class="workspace-option" :class="{selected: editSelectedWorkspaces.includes(option.value)}" @click="toggleEditWorkspace(option.value)">
              <div class="icon-wrap">
                <img v-if="option.value === 'NOTION'" src="@/assets/notion-icon.png" alt="Notion" class="workspace-image" />
                <img v-else-if="option.value === 'SLACK'" src="@/assets/slack-icon.png" alt="Slack" class="workspace-image" />
                <span v-else-if="option.value === 'NONE'" class="workspace-emoji">❌</span>
              </div>
              <span class="label">{{ option.label }}</span>
              <i v-if="editSelectedWorkspaces.includes(option.value)" class="pi pi-check checkmark"></i>
            </div>
          </div>
          
          <!-- 수정 모드 동적 워크스페이스 설정 입력 필드 -->
          <div v-if="editSelectedWorkspaces.includes('NOTION')" class="workspace-config">
            <label class="config-label">Notion 설정</label>
            <input 
              type="text" 
              v-model="editWorkspaceConfigs.NOTION.token" 
              placeholder="Notion Token" 
              class="config-input"
            />
            <input 
              type="text" 
              v-model="editWorkspaceConfigs.NOTION.businessTripDatabaseId" 
              placeholder="출장 Database ID" 
              class="config-input"
            />
            <input 
              type="text" 
              v-model="editWorkspaceConfigs.NOTION.receiptDatabaseId" 
              placeholder="영수증 Database ID" 
              class="config-input"
            />
          </div>
          
          <div v-if="editSelectedWorkspaces.includes('SLACK')" class="workspace-config">
            <label class="config-label">Slack 설정</label>
            <input 
              type="password" 
              v-model="editWorkspaceConfigs.SLACK.token" 
              placeholder="Slack API Token" 
              class="config-input"
            />
            <input 
              type="text" 
              v-model="editWorkspaceConfigs.SLACK.channelId" 
              placeholder="Slack Channel ID" 
              class="config-input"
            />
          </div>
        </div>
        <BaseMessage v-if="editMessage" :type="editMessageType" size="small">{{ editMessage }}</BaseMessage>
        <div class="form-actions">
          <BaseButton variant="cancel" @click="closeEditCompanyModal">닫기</BaseButton>
          <BaseButton variant="confirm" @click="handleUpdateCompany">저장</BaseButton>
        </div>
        <div class="danger-zone">
          <button class="danger-delete-btn" @click="confirmDeleteCompany">회사 삭제</button>
        </div>
      </div>
    </div>

    <!-- Invitation Code Generation Modal -->
    <div v-if="showInvitationModal" class="modal-overlay" @click.self="closeInvitationModal">
      <div class="modal-content">
        <h2>초대 코드 발송</h2>
        <p>팀원들에게 회사 초대 코드를 이메일로 발송합니다.</p>
        
        <div class="email-input-section">
          <label class="invitation-label">초대할 팀원의 이메일 주소</label>
          <input
            v-model="invitationEmail"
            type="email"
            class="company-name-input"
            placeholder="example@company.com"
            @keyup.enter="handleSendInvitationCode"
          />
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
          <BaseButton variant="confirm" @click="handleSendInvitationCode" :loading="isSendingInvitation">초대 코드 발송</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/api.js';
import BaseButton from '../common/BaseButton.vue';
import BaseMessage from '../common/BaseMessage.vue';
import { pushMessage } from '@/utils/notify.js';

export default {
  name: 'CompanyMenu',
  components: {
    BaseButton,
    BaseMessage
  },
  props: {
    // 외부에서 모달을 제어할 수 있도록 props 추가
    externalShowCreateModal: {
      type: Boolean,
      default: false
    },
    externalShowJoinModal: {
      type: Boolean,
      default: false
    },
    // 회사 없는 화면에서 사용할 때는 메뉴를 숨김
    hideMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMenu: false,
      showCreateCompanyModal: false,
      showJoinCompanyModal: false,
      showInvitationModal: false,
  showEditCompanyModal: false,
  companyName: '',
  selectedWorkspaces: [],
      isDropdownOpen: false,
      invitationCode: '',
      invitationEmail: '',
      isSendingInvitation: false,
      hideMenuTimeout: null,
  userCompany: null, // { name, workspaces: [] }
      creationMessage: '',
      creationMessageType: '',
      joinMessage: '',
      joinMessageType: '',
      invitationMessage: '',
      invitationMessageType: '',
  editCompanyName: '',
  editSelectedWorkspaces: [],
  editWorkspaceConfigs: {
    NOTION: { token: '', businessTripDatabaseId: '', receiptDatabaseId: '' },
    SLACK: { token: '', channelId: '' }
  },
  editMessage: '',
  editMessageType: '',
      workspaceOptions: [
        { value: 'NOTION', label: 'Notion' },
        { value: 'SLACK', label: 'Slack' },
        { value: 'NONE', label: '없음' }
      ],
      workspaceConfigs: {
        NOTION: { token: '', businessTripDatabaseId: '', receiptDatabaseId: '' },
        SLACK: { token: '', channelId: '' }
      }
    };
  },
  watch: {
    // 외부에서 전달받은 모달 상태를 감시
    externalShowCreateModal(newVal) {
      if (newVal) {
        this.openCreateCompanyModal();
      }
    },
    externalShowJoinModal(newVal) {
      if (newVal) {
        this.openJoinCompanyModal();
      }
    }
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
  this.selectedWorkspaces = [];
      this.isDropdownOpen = false;
    },
    closeCreateCompanyModal() {
      this.showCreateCompanyModal = false;
      this.companyName = '';
  this.selectedWorkspaces = [];
      this.isDropdownOpen = false;
      this.creationMessage = '';
      this.creationMessageType = '';
      this.workspaceConfigs = {
        NOTION: { token: '', businessTripDatabaseId: '', receiptDatabaseId: '' },
        SLACK: { token: '', channelId: '' }
      };
      // 외부 컴포넌트에 모달 닫힘을 알림
      this.$emit('modal-closed', 'create');
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
      // 외부 컴포넌트에 모달 닫힘을 알림
      this.$emit('modal-closed', 'join');
    },
    openInvitationModal() {
      this.showMenu = false;
      this.showInvitationModal = true;
      this.invitationEmail = '';
      this.invitationMessage = '';
      this.invitationMessageType = '';
      this.isSendingInvitation = false;
    },
    closeInvitationModal() {
      this.showInvitationModal = false;
      this.invitationEmail = '';
      this.invitationMessage = '';
      this.invitationMessageType = '';
      this.isSendingInvitation = false;
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
          this.$emit('company-updated', companyName);
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
      if (!this.selectedWorkspaces.length) {
        this.creationMessage = '최소 한 개의 워크스페이스를 선택해주세요.';
        this.creationMessageType = 'error';
        return;
      }
      
      // 워크스페이스별 필수 정보 검증
      for (const ws of this.selectedWorkspaces) {
        if (ws === 'NOTION') {
          if (!this.workspaceConfigs.NOTION.token.trim()) {
            this.creationMessage = 'Notion API Token을 입력해주세요.';
            this.creationMessageType = 'error';
            return;
          }
          if (!this.workspaceConfigs.NOTION.businessTripDatabaseId.trim()) {
            this.creationMessage = 'Notion 출장 Database ID를 입력해주세요.';
            this.creationMessageType = 'error';
            return;
          }
          if (!this.workspaceConfigs.NOTION.receiptDatabaseId.trim()) {
            this.creationMessage = 'Notion 영수증 Database ID를 입력해주세요.';
            this.creationMessageType = 'error';
            return;
          }
        }
        if (ws === 'SLACK') {
          if (!this.workspaceConfigs.SLACK.token.trim()) {
            this.creationMessage = 'Slack API Token을 입력해주세요.';
            this.creationMessageType = 'error';
            return;
          }
          if (!this.workspaceConfigs.SLACK.channelId.trim()) {
            this.creationMessage = 'Slack Channel ID를 입력해주세요.';
            this.creationMessageType = 'error';
            return;
          }
        }
      }
      
      try {
        const payload = {
          name: this.companyName,
          workspaces: this.selectedWorkspaces,
          workspaceConfigs: this.workspaceConfigs
        };
        console.log('Company creation payload:', payload);
        const response = await apiService.company.create(payload);
        console.log('Company creation response:', response);
        if (response.status === 201) {
          await this.fetchUserCompany();
          this.$emit('company-updated', this.companyName);
          const createdName = this.companyName; // close 전에 참조
          this.closeCreateCompanyModal();
          pushMessage({ type: 'success', text: `'${createdName}' 회사가 생성되었습니다.` });
        }
      } catch (error) {
        console.error('Failed to create company:', error);
        this.creationMessage = '회사 생성에 실패했습니다.';
        this.creationMessageType = 'error';
      }
    },
    async handleSendInvitationCode() {
      if (!this.invitationEmail.trim()) {
        this.invitationMessage = '이메일 주소를 입력해주세요.';
        this.invitationMessageType = 'error';
        return;
      }

      this.invitationMessage = '';
      this.isSendingInvitation = true;

      try {
        const response = await apiService.company.sendInvitationCode({
          email: this.invitationEmail.trim()
        });

        console.log('Invitation send response:', response);

        if (response.status === 201 || response.status === 200) {
          const sentEmail = this.invitationEmail.trim(); // close 전에 참조
          this.closeInvitationModal();
          pushMessage({ type: 'success', text: `'${sentEmail}'으로 초대 코드가 발송되었습니다.` });
        }
      } catch (error) {
        console.error('Failed to send invitation code:', error);
        this.invitationMessage = '초대 코드 발송에 실패했습니다. 다시 시도해주세요.';
        this.invitationMessageType = 'error';
      } finally {
        this.isSendingInvitation = false;
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleWorkspace(value) {
      const idx = this.selectedWorkspaces.indexOf(value);
      if (idx === -1) this.selectedWorkspaces.push(value); else this.selectedWorkspaces.splice(idx, 1);
    },
    removeWorkspace(value) {
      this.selectedWorkspaces = this.selectedWorkspaces.filter(v => v !== value);
    },
    openEditCompanyModal() {
      if (!this.userCompany) return;
      this.showMenu = false;
      this.showEditCompanyModal = true;
      this.editCompanyName = this.userCompany.name;
      this.editSelectedWorkspaces = [...(this.userCompany.workspaces || [])];
      this.editWorkspaceConfigs = {
        NOTION: { token: '', businessTripDatabaseId: '', receiptDatabaseId: '' },
        SLACK: { token: '', channelId: '' }
      };
      this.editMessage = '';
      this.editMessageType = '';
    },
    closeEditCompanyModal() {
      this.showEditCompanyModal = false;
      this.editCompanyName = '';
      this.editSelectedWorkspaces = [];
      this.editWorkspaceConfigs = {
        NOTION: { token: '', businessTripDatabaseId: '', receiptDatabaseId: '' },
        SLACK: { token: '', channelId: '' }
      };
      this.editMessage = '';
      this.editMessageType = '';
    },
    async handleUpdateCompany() {
      this.editMessage = '';
      if (!this.editCompanyName.trim()) {
        this.editMessage = '회사 이름을 입력해주세요.';
        this.editMessageType = 'error';
        return;
      }
      
      // 워크스페이스별 필수 정보 검증
      for (const ws of this.editSelectedWorkspaces) {
        if (ws === 'NOTION') {
          if (!this.editWorkspaceConfigs.NOTION.token.trim()) {
            this.editMessage = 'Notion Token을 입력해주세요.';
            this.editMessageType = 'error';
            return;
          }
          if (!this.editWorkspaceConfigs.NOTION.businessTripDatabaseId.trim()) {
            this.editMessage = '출장 Database ID를 입력해주세요.';
            this.editMessageType = 'error';
            return;
          }
          if (!this.editWorkspaceConfigs.NOTION.receiptDatabaseId.trim()) {
            this.editMessage = '영수증 Database ID를 입력해주세요.';
            this.editMessageType = 'error';
            return;
          }
        }
        if (ws === 'SLACK') {
          if (!this.editWorkspaceConfigs.SLACK.token.trim()) {
            this.editMessage = 'Slack API Token을 입력해주세요.';
            this.editMessageType = 'error';
            return;
          }
          if (!this.editWorkspaceConfigs.SLACK.channelId.trim()) {
            this.editMessage = 'Slack Channel ID를 입력해주세요.';
            this.editMessageType = 'error';
            return;
          }
        }
      }
      
      try {
        const response = await apiService.company.update({
          name: this.editCompanyName.trim(),
          workspaces: this.editSelectedWorkspaces,
          workspaceConfigs: this.editWorkspaceConfigs
        });
        if (response.status === 200) {
          this.editMessage = '회사 정보가 수정되었습니다.';
          this.editMessageType = 'success';
          await this.fetchUserCompany();
          setTimeout(() => this.closeEditCompanyModal(), 1200);
        }
      } catch (e) {
        console.error('Failed to update company', e);
        this.editMessage = '회사 수정에 실패했습니다.';
        this.editMessageType = 'error';
      }
    },
    async confirmDeleteCompany() {
      try {
        const { showConfirm } = await import('@/utils/dialog.js');
        const confirmed = await showConfirm({
          title: '회사 삭제',
          message: '회사를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
          confirmText: '삭제',
          cancelText: '취소',
          confirmVariant: 'danger',
          iconType: 'danger'
        });
        if (!confirmed) return;
        const res = await apiService.company.delete();
        if (res.status === 204 || res.status === 200) {
          this.userCompany = null;
          this.closeEditCompanyModal();
          this.showMenu = false;
          pushMessage({ type: 'success', text: '회사가 삭제되었습니다.' });
        }
      } catch (e) {
        console.error('Delete company failed', e);
        if (this.editMessage !== undefined) {
          this.editMessage = '회사 삭제 실패.';
          this.editMessageType = 'error';
        }
      }
    },
    getWorkspaceDisplayName(workspace) {
      switch (workspace) {
        case 'NOTION': return 'Notion';
        case 'SLACK': return 'Slack';
        case 'NONE': return '없음';
        default: return '';
      }
    },
    async fetchUserCompany() {
      try {
        const response = await apiService.company.getList();
        const data = response.data;
        
        if (data && typeof data === 'object' && data.name) {
          this.userCompany = {
            name: data.name,
            workspaces: Array.isArray(data.workspaces) ? data.workspaces : []
          };
        } else {
          this.userCompany = null;
        }
      } catch (error) {
        console.error('Failed to fetch user company:', error);
        this.userCompany = null;
      }
    },
    workspaceShort(ws) {
      switch (ws) {
        case 'NOTION': return 'N';
        case 'SLACK': return 'S';
        case 'NONE': return 'X';
        default: return '•';
      }
    },
    toggleEditWorkspace(value) {
      const idx = this.editSelectedWorkspaces.indexOf(value);
      if (idx === -1) this.editSelectedWorkspaces.push(value); else this.editSelectedWorkspaces.splice(idx, 1);
    }
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

.company-info.rich {
  padding: 8px 8px 4px;
}

.company-header-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #fff;
  font-size: 14px;
}

.company-header-icon { font-size: 16px; color: var(--color-primary, #9f7aea); }
.company-name-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.workspace-chip-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.workspace-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.08);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #e0e0e0;
  line-height: 1;
  border: 1px solid rgba(255,255,255,0.15);
}
.workspace-chip.small { padding: 4px 10px; font-size: 12px; }
.chip-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--color-primary, #7e5bef);
  color: #fff;
  text-transform: uppercase;
}
.chip-badge[data-type='SLACK'] { background:#611f69; }
.chip-badge[data-type='NOTION'] { background:#2f3437; }
.chip-badge[data-type='NONE'] { background:#555; }

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

.menu-item.danger { color: #ff6b6b; }
.menu-item.danger:hover { background:#402626; color:#ff8585; }

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

.workspace-multi-select { text-align:left; margin-bottom:16px; }
.workspace-options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(140px,1fr));
  gap: 8px;
}
.workspace-option {
  position: relative;
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px 12px;
  background: var(--color-bg-primary);
  border:1px solid var(--color-border-secondary);
  border-radius:8px;
  cursor:pointer;
  font-size:13px;
  transition:.15s;
}
.workspace-option.selected {
  border-color: var(--color-primary);
  box-shadow:0 0 0 3px var(--color-primary-light);
}
.workspace-option:hover { border-color: var(--color-border-hover); }
.workspace-option .checkmark { margin-left:auto; color: var(--color-primary); font-size:14px; }
.icon-wrap { width:22px; height:22px; display:flex; align-items:center; justify-content:center; }
.selected-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
.remove-chip { background:none; border:none; color:#bbb; margin-left:6px; cursor:pointer; font-size:12px; }
.remove-chip:hover { color:#fff; }

.danger-zone { margin-top:24px; padding-top:12px; border-top:1px solid var(--color-border-secondary); text-align:right; }
.danger-delete-btn { background:#ff4d4f; border:none; color:#fff; padding:10px 16px; border-radius:8px; cursor:pointer; font-size:13px; }
.danger-delete-btn:hover { background:#ff686a; }

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

/* 워크스페이스 설정 입력 필드 스타일 */
.workspace-config {
  margin-top: 12px;
  padding: 12px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-secondary);
  border-radius: 8px;
}

.config-label {
  display: block;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
}

.config-input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border-secondary);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  box-sizing: border-box;
}

.config-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
  outline: none;
}
</style>
