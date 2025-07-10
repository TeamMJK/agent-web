<template>
  <div class="company-menu-container" @mouseenter="showMenu = true" @mouseleave="hideMenuWithDelay">
    <button class="icon-btn company-icon">
      <i class="pi pi-building"></i>
    </button>
    <div v-if="showMenu" class="company-menu-modal" @mouseenter="cancelHideMenu" @mouseleave="hideMenuWithDelay">
      <div v-if="userCompanies && userCompanies.length > 0" class="company-list">
        <div v-for="company in userCompanies" :key="company.id" class="company-item">
          {{ company.name }}
        </div>
      </div>
      <div v-else class="no-company-info">
        회사 정보 없음
      </div>
      <div class="menu-divider"></div>
      <button class="menu-item" @click="openCreateCompanyModal">회사 생성</button>
      <button class="menu-item">회사 초대 코드 생성</button>
    </div>

    <!-- Company Creation Modal -->
    <div v-if="showCreateCompanyModal" class="modal-overlay" @click.self="closeCreateCompanyModal">
      <div class="modal-content">
        <h2>회사 생성</h2>
        <p>새로운 회사를 생성하여 팀원들과 출장 계획을 함께 관리하세요.</p>
        <input type="text" v-model="companyName" placeholder="회사 이름을 입력하세요" class="company-name-input"/>
        <div v-if="creationMessage" :class="['creation-message', `message-${creationMessageType}`]">
          {{ creationMessage }}
        </div>
        <div class="modal-actions">
          <button @click="closeCreateCompanyModal" class="btn-cancel">취소</button>
          <button @click="handleCreateCompany" class="btn-confirm">생성</button>
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
      companyName: '',
      hideMenuTimeout: null,
      userCompanies: [],
      creationMessage: '',
      creationMessageType: '', // 'success' or 'error'
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
    },
    closeCreateCompanyModal() {
      this.showCreateCompanyModal = false;
      this.companyName = '';
      this.creationMessage = '';
      this.creationMessageType = '';
    },
    async handleCreateCompany() {
      this.creationMessage = '';
      if (!this.companyName.trim()) {
        this.creationMessage = '회사 이름을 입력해주세요.';
        this.creationMessageType = 'error';
        return;
      }
      try {
        const response = await apiService.company.create({ name: this.companyName });
        if (response.status === 201) {
            this.creationMessage = '회사가 성공적으로 생성되었습니다.';
            this.creationMessageType = 'success';
            await this.fetchUserCompanies();
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
    async fetchUserCompanies() {
      try {
        // NOTE: 실제 API 서비스에 맞게 수정이 필요할 수 있습니다.
        // 현재는 getList와 같은 메소드가 있다고 가정합니다.
        const response = await apiService.company.getList();
        this.userCompanies = response.data;
      } catch (error) {
        console.error('Failed to fetch user companies:', error);
        this.userCompanies = [];
      }
    },
  },
  mounted() {
    this.fetchUserCompanies();
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
</style>
