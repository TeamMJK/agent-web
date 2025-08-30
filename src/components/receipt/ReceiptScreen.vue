<template>
  <div class="receipt-container">
    <!-- 로딩 중 화면 -->
    <div v-if="isLoadingCompany" class="loading-screen">
      <div class="loading-content">
        <i class="pi pi-spin pi-spinner loading-spinner"></i>
        <h2 class="loading-title">회사 정보를 확인하는 중...</h2>
        <p class="loading-description">잠시만 기다려주세요</p>
      </div>
    </div>

    <!-- 회사가 없는 경우 표시할 화면 -->
    <div v-else-if="!hasCompany" class="no-company-screen">
      <div class="no-company-content">
        <i class="pi pi-building no-company-icon"></i>
        <h2 class="no-company-title">회사 정보가 필요합니다</h2>
        <p class="no-company-description">
          영수증 관리 기능을 사용하기 위해서는 먼저 회사를 생성하거나 기존 회사에 참여해야 합니다.
        </p>
        <div class="no-company-actions">
          <BaseButton variant="primary" @click="openCreateCompanyModal" class="company-action-btn">
            <i class="pi pi-plus"></i>
            회사 생성하기
          </BaseButton>
          <BaseButton variant="secondary" @click="openJoinCompanyModal" class="company-action-btn">
            <i class="pi pi-users"></i>
            회사 참여하기
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- CompanyMenu 컴포넌트 재사용 (메뉴는 숨기고 모달만 사용) -->
    <CompanyMenu 
      :hide-menu="true"
      :external-show-create-modal="showCreateCompanyModal"
      :external-show-join-modal="showJoinCompanyModal"
      @company-updated="handleCompanyUpdated"
      @modal-closed="handleModalClosed"
    />

    <!-- 회사가 있는 경우 기존 화면 -->
    <div v-if="hasCompany">
      <!-- 헤더 영역 -->
      <div class="receipt-header">
        <div class="header-content">
          <h1 class="receipt-title">영수증 관리</h1>
          <p class="receipt-subtitle">출장 영수증을 업로드하고 관리하세요</p>
        </div>
        <div class="header-actions">
          <CompanyMenu @company-updated="checkUserCompany" />
        </div>
      </div>

      <div class="receipt-content">
      <!-- 상단 섹션 (수동 입력 + 이미지 업로드) -->
      <div class="input-sections">
        <!-- 왼쪽: 수동 입력 섹션 -->
        <div class="manual-input-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="pi pi-plus"></i>
              영수증 수동 입력
            </h2>
            <p class="section-description">영수증 정보를 직접 입력하여 등록하세요</p>
          </div>

          <!-- 영수증 정보 입력 폼 -->
          <div class="receipt-form">
            <FormGroup label="결제 날짜" :required="true" :error-message="errors.paymentDate">
              <ModernDatePicker
                v-model="receiptForm.paymentDate"
                placeholder="결제 날짜를 선택하세요"
                :max-date="new Date()"
              />
            </FormGroup>

            <FormGroup label="승인 번호" :required="true" :error-message="errors.approvalNumber">
              <input 
                v-model="receiptForm.approvalNumber" 
                type="text" 
                placeholder="승인 번호를 입력하세요"
                class="form-input"
              />
            </FormGroup>

            <FormGroup label="매장 주소" :required="true" :error-message="errors.storeAddress">
              <input 
                v-model="receiptForm.storeAddress" 
                type="text" 
                placeholder="매장 주소를 입력하세요"
                class="form-input"
              />
            </FormGroup>

            <FormGroup label="총 금액" :required="true" :error-message="errors.totalAmount">
              <input 
                v-model="receiptForm.totalAmount" 
                type="number" 
                placeholder="총 금액을 입력하세요"
                class="form-input"
                min="0"
                step="100"
              />
            </FormGroup>

            <div class="form-actions">
              <BaseButton variant="cancel" @click="resetForm">
                초기화
              </BaseButton>
              <BaseButton variant="confirm" :loading="isUploading" @click="handleSaveReceipt">
                영수증 저장
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 이미지 업로드 섹션 -->
        <div class="upload-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="pi pi-cloud-upload"></i>
              영수증 이미지 업로드
            </h2>
            <p class="section-description">영수증 이미지를 업로드하여 등록하세요</p>
          </div>

          <!-- 파일 업로드 영역 -->
          <div 
            class="file-upload-area"
            :class="{ 'drag-over': isDragOver, 'has-file': selectedFile }"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="triggerFileInput"
          >
            <input 
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onFileSelect"
            />

            <div v-if="!selectedFile" class="upload-placeholder">
              <i class="pi pi-cloud-upload upload-icon"></i>
              <h3 class="upload-text">영수증 이미지를 업로드하세요</h3>
              <p class="upload-hint">클릭하거나 파일을 드래그해주세요</p>
              <p class="upload-hint">JPG, PNG, PDF 파일 지원</p>
            </div>

            <div v-else class="file-preview">
              <div class="preview-image-container">
                <img 
                  v-if="previewUrl && isImageFile" 
                  :src="previewUrl" 
                  alt="영수증 미리보기" 
                  class="preview-image"
                />
                <div v-else class="preview-placeholder">
                  <i class="pi pi-file"></i>
                  <p>{{ selectedFile.name }}</p>
                </div>
              </div>

              <div class="file-info">
                <h4 class="file-name">{{ selectedFile.name }}</h4>
                <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                <button 
                  type="button" 
                  @click.stop="removeFile" 
                  class="remove-file-btn"
                >
                  <i class="pi pi-times"></i>
                  파일 제거
                </button>
              </div>
            </div>
          </div>

          <!-- 이미지 업로드 버튼 -->
          <div class="upload-actions" v-if="selectedFile">
            <BaseButton variant="cancel" @click="removeFile">
              <i class="pi pi-times"></i>
              취소
            </BaseButton>
            <BaseButton variant="confirm" :loading="isUploading" @click="handleImageUpload">
              <i class="pi pi-cloud-upload"></i>
              이미지 업로드
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- 조회 섹션 -->
      <div class="list-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="pi pi-list"></i>
            영수증 목록
          </h2>
          <div class="list-controls">
            <BaseButton variant="secondary" size="small" @click="refreshList">
              <i class="pi pi-refresh"></i>
              새로고침
            </BaseButton>
          </div>
        </div>

        <!-- 영수증 리스트 -->
        <div class="receipt-list">
          <div v-if="isLoading" class="loading-state">
            <i class="pi pi-spin pi-spinner loading-icon"></i>
            <p>영수증 목록을 불러오는 중...</p>
          </div>

          <div v-else-if="!receipts || receipts.length === 0" class="empty-state">
            <i class="pi pi-inbox empty-icon"></i>
            <h3>등록된 영수증이 없습니다</h3>
            <p>첫 번째 영수증을 업로드해보세요</p>
          </div>

          <div v-else class="receipt-cards">
            <div 
              v-for="receipt in (receipts || [])" 
              :key="receipt.receiptId"
              class="receipt-card"
              @click="viewReceipt(receipt)"
            >
              <div class="card-content">
                <div class="card-header">
                  <h4 class="card-title">영수증 #{{ receipt.receiptId || receipt.id }}</h4>
                  <span class="card-amount">{{ formatCurrency(receipt.totalAmount) }}</span>
                </div>
                <div class="card-details">
                  <p class="card-date">
                    <i class="pi pi-calendar"></i>
                    {{ formatDate(receipt.paymentDate) }}
                  </p>
                  <p class="card-store">
                    <i class="pi pi-map-marker"></i>
                    {{ receipt.storeAddress }}
                  </p>
                  <p class="card-approval">
                    <i class="pi pi-check-circle"></i>
                    승인번호: {{ receipt.approvalNumber }}
                  </p>
                </div>
              </div>
              
              <div class="card-actions">
                <button class="action-btn delete" @click.stop="deleteReceipt(receipt)" title="삭제">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- v-else div 닫기 -->
    </div>

    <!-- 영수증 상세 모달 -->
    <BaseModal 
      :show="showDetailModal" 
      title="영수증 상세 정보"
      @close="showDetailModal = false"
    >
      <div v-if="selectedReceipt" class="receipt-detail">
        <div class="detail-row">
          <label>영수증 번호</label>
          <span>{{ selectedReceipt.receiptId }}</span>
        </div>
        <div class="detail-row">
          <label>결제 날짜</label>
          <span>{{ formatDate(selectedReceipt.paymentDate) }}</span>
        </div>
        <div class="detail-row">
          <label>승인 번호</label>
          <span>{{ selectedReceipt.approvalNumber }}</span>
        </div>
        <div class="detail-row">
          <label>매장 주소</label>
          <span>{{ selectedReceipt.storeAddress }}</span>
        </div>
        <div class="detail-row">
          <label>총 금액</label>
          <span class="amount-text">{{ formatCurrency(selectedReceipt.totalAmount) }}</span>
        </div>
      </div>
      
      <template #actions>
        <BaseButton variant="cancel" @click="showDetailModal = false">
          닫기
        </BaseButton>
      </template>
    </BaseModal>

    <!-- 성공/에러 메시지 -->
    <BaseMessage v-if="message.show" :type="message.type" @close="message.show = false">
      {{ message.text }}
    </BaseMessage>
  </div>
</template>

<script>
import BaseButton from '../common/BaseButton.vue';
import BaseModal from '../common/BaseModal.vue';
import BaseMessage from '../common/BaseMessage.vue';
import FormGroup from '../common/FormGroup.vue';
import ModernDatePicker from '../common/ModernDatePicker.vue';
import CompanyMenu from '../workspace/CompanyMenu.vue';
import { showConfirm } from '../../utils/dialog.js';
import apiService from '../../services/api.js';
import { pushMessage } from '@/utils/notify.js';

export default {
  name: 'ReceiptScreen',
  components: {
    BaseButton,
    BaseModal,
    BaseMessage,
    FormGroup,
    ModernDatePicker,
    CompanyMenu
  },
  data() {
    return {
      // 회사 관련
      userCompany: null,
      isLoadingCompany: true,
      
      // 모달 제어용 (CompanyMenu와 연동)
      showCreateCompanyModal: false,
      showJoinCompanyModal: false,
      
      // 업로드 상태
      isUploading: false,
      
      // 폼 데이터 (API 명세서에 맞게 수정)
      receiptForm: {
        paymentDate: '',
        approvalNumber: '',
        storeAddress: '',
        totalAmount: 0
      },
      
      // 유효성 검사 에러
      errors: {},
      
      // 리스트 관련
      receipts: [],
      isLoading: false,
      
      // 모달 관련
      showDetailModal: false,
      selectedReceipt: null,
      
      // 메시지
      message: {
        show: false,
        type: 'success',
        text: ''
      },
      
      // 파일 업로드 관련
      selectedFile: null,
      previewUrl: '',
      isDragOver: false,
      isImageFile: false
    }
  },
  computed: {
    hasCompany() {
      return !!this.userCompany;
    }
  },
  mounted() {
    this.checkUserCompany();
    this.setTodayDate();
  },
  methods: {
    // 회사 관련 메서드
    async checkUserCompany() {
      this.isLoadingCompany = true;
      try {
        const response = await apiService.company.getList();
        this.userCompany = response.data;
        
        // 회사가 있으면 영수증 목록 로드
        if (this.userCompany) {
          this.loadReceipts();
        }
      } catch (error) {
        console.error('회사 정보 조회 실패:', error);
        this.userCompany = null;
      } finally {
        this.isLoadingCompany = false;
      }
    },

    // 회사 관련 메서드 (CompanyMenu 재사용)
    openCreateCompanyModal() {
      this.showCreateCompanyModal = true;
    },

    openJoinCompanyModal() {
      this.showJoinCompanyModal = true;
    },

    handleCompanyUpdated(companyName) {
      // CompanyMenu에서 회사가 업데이트되었을 때 호출
      this.checkUserCompany();
      this.showMessage('success', `${companyName ? '회사 작업이' : '회사 정보가'} 완료되었습니다. 이제 영수증 관리를 시작할 수 있습니다!`);
    },

    handleModalClosed(modalType) {
      // CompanyMenu에서 모달이 닫혔을 때 호출
      if (modalType === 'create') {
        this.showCreateCompanyModal = false;
      } else if (modalType === 'join') {
        this.showJoinCompanyModal = false;
      }
    },

    // 폼 관련 메서드
    validateForm() {
      this.errors = {};
      
      if (!this.receiptForm.paymentDate) {
        this.errors.paymentDate = '결제 날짜를 선택해주세요.';
      }
      
      if (!this.receiptForm.approvalNumber.trim()) {
        this.errors.approvalNumber = '승인 번호를 입력해주세요.';
      }
      
      if (!this.receiptForm.storeAddress.trim()) {
        this.errors.storeAddress = '매장 주소를 입력해주세요.';
      }
      
      if (!this.receiptForm.totalAmount || this.receiptForm.totalAmount <= 0) {
        this.errors.totalAmount = '올바른 금액을 입력해주세요.';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    
    async handleSaveReceipt() {
      if (!this.validateForm()) {
        this.showMessage('error', '필수 항목을 모두 입력해주세요.');
        return;
      }
      
      this.isUploading = true;
      
      try {
        await apiService.receipt.create({
          paymentDate: this.receiptForm.paymentDate,
          approvalNumber: this.receiptForm.approvalNumber,
          storeAddress: this.receiptForm.storeAddress,
          totalAmount: Number(this.receiptForm.totalAmount)
        });
        
  pushMessage({ type: 'success', text: '영수증이 저장되었습니다.' });
        this.resetForm();
        this.loadReceipts(); // 목록 새로고침
        
      } catch (error) {
        console.error('영수증 저장 실패:', error);
        this.showMessage('error', '영수증 저장 중 오류가 발생했습니다.');
      } finally {
        this.isUploading = false;
      }
    },
    
    resetForm() {
      this.receiptForm = {
        paymentDate: '',
        approvalNumber: '',
        storeAddress: '',
        totalAmount: 0
      };
      this.errors = {};
      this.setTodayDate();
    },
    
    setTodayDate() {
      const today = new Date();
      this.receiptForm.paymentDate = today.toISOString().split('T')[0];
    },
    
    // 리스트 관련 메서드
    async loadReceipts() {
      this.isLoading = true;
      
      try {
        const { data } = await apiService.receipt.getList();
        console.log('영수증 목록 API 응답 데이터:', data);
        this.receipts = data || [];
        
      } catch (error) {
        console.error('영수증 목록 로딩 실패:', error);
        this.showMessage('error', '영수증 목록을 불러오는데 실패했습니다.');
        this.receipts = []; // 빈 배열로 초기화
      } finally {
        this.isLoading = false;
      }
    },
    
    refreshList() {
      this.loadReceipts();
    },
    
    async viewReceipt(receipt) {
      try {
        const { data } = await apiService.receipt.getList();
        // 전체 목록에서 해당 영수증 찾기
        const foundReceipt = data.find(r => r.receiptId === receipt.receiptId);
        if (foundReceipt) {
          this.selectedReceipt = foundReceipt;
          this.showDetailModal = true;
        } else {
          this.showMessage('error', '해당 영수증을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('영수증 조회 실패:', error);
        this.showMessage('error', '영수증 정보를 불러오는데 실패했습니다.');
      }
    },
    
    downloadReceipt(receipt) {
      // TODO: 실제 다운로드 구현
      console.log('다운로드:', receipt);
      this.showMessage('info', '다운로드 기능은 준비 중입니다.');
    },
    
    async deleteReceipt(receipt) {
      const confirmed = await showConfirm({
        title: '영수증 삭제',
        message: `영수증 #${receipt.receiptId || receipt.id}을(를) 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`,
        confirmText: '삭제',
        cancelText: '취소',
        confirmVariant: 'danger',
        iconType: 'warning'
      });

      if (confirmed) {
        try {
          // 실제 삭제 API 연동 (DELETE /receipts/{receipt-id})
          const receiptId = receipt.receiptId || receipt.id;
          console.log('삭제할 영수증 ID:', receiptId, '전체 데이터:', receipt);
          
          if (!receiptId) {
            this.showMessage('error', '영수증 ID를 찾을 수 없습니다.');
            return;
          }
          
          await apiService.receipt.delete(receiptId);
          
          // 성공 시 로컬에서 제거하고 메시지 표시
          this.receipts = this.receipts.filter(r => (r.receiptId || r.id) !== receiptId);
          pushMessage({ type: 'success', text: '영수증이 삭제되었습니다.' });
          
        } catch (error) {
          console.error('영수증 삭제 실패:', error);
          
          // 404 에러 처리
          if (error.response?.status === 404) {
            this.showMessage('error', '영수증 또는 회원을 찾을 수 없습니다.');
          } else {
            this.showMessage('error', '영수증 삭제 중 오류가 발생했습니다.');
          }
        }
      }
    },
    
    // 파일 업로드 관련 메서드
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    onFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.handleFileSelection(file);
      }
    },
    
    onDragOver() {
      this.isDragOver = true;
    },
    
    onDragLeave() {
      this.isDragOver = false;
    },
    
    onDrop(event) {
      this.isDragOver = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.handleFileSelection(files[0]);
      }
    },
    
    handleFileSelection(file) {
      // 파일 타입 검증
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        this.showMessage('error', '지원하지 않는 파일 형식입니다. JPG, PNG, GIF, PDF 파일만 업로드 가능합니다.');
        return;
      }
      
      // 파일 크기 검증 (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.showMessage('error', '파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.');
        return;
      }
      
      this.selectedFile = file;
      this.isImageFile = file.type.startsWith('image/');
      
      // 이미지 미리보기 생성
      if (this.isImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.previewUrl = '';
      }
    },
    
    removeFile() {
      this.selectedFile = null;
      this.previewUrl = '';
      this.isImageFile = false;
      this.isDragOver = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    async handleImageUpload() {
      if (!this.selectedFile) {
        this.showMessage('error', '업로드할 파일을 선택해주세요.');
        return;
      }
      
      this.isUploading = true;
      
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        
        await apiService.receipt.uploadImage(formData);
        
  pushMessage({ type: 'success', text: '이미지가 업로드되었습니다.' });
        this.removeFile();
        this.loadReceipts(); // 목록 새로고침
        
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        this.showMessage('error', '이미지 업로드 중 오류가 발생했습니다.');
      } finally {
        this.isUploading = false;
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // 유틸리티 메서드
    formatCurrency(amount) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      }).format(amount);
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    showMessage(type, text) {
      this.message = { show: true, type, text };
      setTimeout(() => {
        this.message.show = false;
      }, 5000);
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.receipt-container {
  font-family: var(--font-family-primary);
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
  box-sizing: border-box;
}

.receipt-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-secondary);
  padding: var(--spacing-4xl) var(--spacing-2xl) var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-2xl);
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
  min-width: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.receipt-title {
  font-size: 2.5rem;
  font-weight: var(--font-weight-semibold);
  background: var(--gradient-text);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.receipt-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin: 0;
  font-weight: var(--font-weight-normal);
}

.receipt-content {
  flex: 1;
  padding: var(--spacing-2xl);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4xl);
}

// 상단 입력 섹션들
.input-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-4xl);
}

.manual-input-section,
.upload-section {
  background: var(--color-bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-3xl);
  border: 1px solid var(--color-border-secondary);
}

// 섹션 공통 스타일
.upload-section,
.list-section {
  background: var(--color-bg-card);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-3xl);
  border: 1px solid var(--color-border-secondary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.section-title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  i {
    color: var(--color-primary);
  }
}

.section-description {
  color: var(--color-text-muted);
  margin: var(--spacing-sm) 0 0 0;
  font-size: 0.9rem;
}

// 파일 업로드 영역
.file-upload-area {
  border: 2px dashed var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4xl);
  text-align: center;
  cursor: pointer;
  transition: var(--transition-normal);
  background: var(--color-bg-secondary);
  margin-bottom: var(--spacing-2xl);
  
  &.drag-over {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }
  
  &.has-file {
    border-style: solid;
    border-color: var(--color-primary);
    cursor: default;
  }
  
  &:hover:not(.has-file) {
    border-color: var(--color-primary);
    background: var(--color-bg-tertiary);
  }
}

.upload-placeholder {
  padding: var(--spacing-4xl);

  .upload-icon {
    font-size: 3rem;
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-lg);
  }
  
  .upload-text {
    font-size: 1.2rem;
    color: var(--color-text-primary);
    margin: 0 0 var(--spacing-sm) 0;
    font-weight: var(--font-weight-medium);
  }
  
  .upload-hint {
    color: var(--color-text-muted);
    margin: 0;
    font-size: 0.9rem;
  }
}

.file-preview {
  display: flex;
  gap: var(--spacing-2xl);
  align-items: center;
  text-align: left;
}

.preview-image-container {
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-muted);
  
  i {
    font-size: 2rem;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    text-align: center;
    word-break: break-all;
  }
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  word-break: break-all;
}

.file-size {
  color: var(--color-text-muted);
  margin: 0 0 var(--spacing-lg) 0;
  font-size: 0.9rem;
}

.remove-file-btn {
  background: var(--color-error);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: var(--transition-fast);
  
  &:hover {
    background: #d32f2f;
  }
}

// 업로드 액션 버튼
.upload-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
}

// 폼 스타일
.receipt-form {
  background: var(--color-bg-secondary);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-secondary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-input,
.form-select,
.form-textarea {
  @include input-base();
  width: 100%;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--color-primary);
    outline: none;
  }
  
  &::placeholder {
    color: var(--color-text-placeholder);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: flex-end;
  margin-top: var(--spacing-2xl);
}

// 리스트 컨트롤
.list-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.filter-select {
  @include input-base();
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
}

// 로딩 및 빈 상태
.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-4xl);
  color: var(--color-text-muted);
}

.loading-icon,
.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
}

// 영수증 그리드
.receipt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-2xl);
}

.receipt-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-secondary);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-normal);
  position: relative;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.receipt-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  
  &.accommodation { background: #4CAF50; color: white; }
  &.transportation { background: #2196F3; color: white; }
  &.meal { background: #FF9800; color: white; }
  &.conference { background: #9C27B0; color: white; }
  &.etc { background: #607D8B; color: white; }
}

.card-content {
  padding: var(--spacing-lg);
}

.card-title {
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-amount {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.card-date {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0 0 var(--spacing-sm) 0;
}

.card-memo {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-actions {
  position: absolute;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: var(--transition-fast);
}

.receipt-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  
  &.delete:hover {
    background: var(--color-error);
  }
}

// 모달 상세 내용
.receipt-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
}

.detail-image {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.detail-receipt-image {
  width: 100%;
  height: auto;
  display: block;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  
  label {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    font-weight: var(--font-weight-medium);
  }
  
  span {
    color: var(--color-text-primary);
    font-size: 1rem;
  }
}

.category-label {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: var(--font-weight-medium);
  
  &.accommodation { background: #4CAF50; color: white; }
  &.transportation { background: #2196F3; color: white; }
  &.meal { background: #FF9800; color: white; }
  &.conference { background: #9C27B0; color: white; }
  &.etc { background: #607D8B; color: white; }
}

.amount-text {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

// 반응형 디자인
@media (max-width: 768px) {
  .receipt-container {
    padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
  }
  
  .receipt-header {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    padding: 24px 16px 20px;
  }
  
  .receipt-title {
    font-size: 2rem;
  }
  
  .receipt-content {
    padding: var(--spacing-lg);
    gap: var(--spacing-2xl);
  }
  
  // 입력 섹션들을 세로로 배치
  .input-sections {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
  
  .manual-input-section,
  .upload-section,
  .list-section {
    padding: var(--spacing-2xl);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .file-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions,
  .upload-actions {
    flex-direction: column;
  }
  
  .receipt-grid {
    grid-template-columns: 1fr;
  }
  
  .receipt-detail {
    grid-template-columns: 1fr;
  }
  
  .list-controls {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .receipt-container {
    padding-left: calc(var(--sidebar-width) + var(--sidebar-margin) * 2);
  }
  
  .receipt-header {
    padding: 20px 12px 16px;
  }
  
  .receipt-title {
    font-size: 1.8rem;
  }
  
  .receipt-content {
    padding: var(--spacing-md);
  }
  
  .input-sections {
    gap: var(--spacing-lg);
  }
  
  .manual-input-section,
  .upload-section,
  .list-section {
    padding: var(--spacing-lg);
  }
  
  .file-upload-area {
    padding: var(--spacing-2xl);
  }
}

// API 구조에 맞는 영수증 카드 스타일
.receipt-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-2xl);
  padding: var(--spacing-lg) 0;
}

.receipt-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
}

.card-content {
  padding: var(--spacing-2xl);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-secondary);
}

.card-title {
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.card-amount {
  font-size: 1.3rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.card-date,
.card-store,
.card-approval {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: 0.9rem;

  i {
    color: var(--color-primary);
    width: 16px;
  }
}

.card-store {
  word-break: break-word;
  line-height: 1.4;
}

// 상세 모달 스타일 (API 구조에 맞게)
.receipt-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-secondary);
  
  label {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
    min-width: 100px;
  }
  
  span {
    color: var(--color-text-primary);
    font-size: 1rem;
    text-align: right;
    flex: 1;
  }
}

.amount-text {
  font-size: 1.3rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary) !important;
}

/* 회사 없을 때 보여줄 화면 스타일 */
/* 로딩 화면 */
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--spacing-4xl);
}

.loading-content {
  text-align: center;
  max-width: 400px;
}

.loading-spinner {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-2xl);
  display: block;
}

.loading-title {
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-lg) 0;
}

.loading-description {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin: 0;
}

/* 회사 없음 화면 */
.no-company-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: var(--spacing-4xl);
}

.no-company-content {
  text-align: center;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
}

.no-company-icon {
  font-size: 4rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xl);
}

.no-company-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  margin-bottom: var(--spacing-md);
}

.no-company-description {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  margin-bottom: var(--spacing-2xl);
}

.no-company-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
}

.company-action-btn {
  min-width: 160px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .no-company-content {
    padding: var(--spacing-2xl);
  }
  
  .no-company-title {
    font-size: 1.5rem;
  }
  
  .no-company-description {
    font-size: 1rem;
  }
  
  .no-company-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .company-action-btn {
    width: 100%;
    min-width: auto;
  }
}
</style>
