<template>
  <div class="test-script-screen">
    <!-- 독립적인 사이드바 -->
    <div class="test-sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <button 
          class="sidebar-toggle" 
          @click="toggleSidebar"
          :class="{ 'is-open': sidebarOpen }"
        >
          <i class="pi pi-bars"></i>
        </button>
        <span v-if="sidebarOpen" class="sidebar-title">카테고리</span>
      </div>
      
      <div class="sidebar-content" v-if="sidebarOpen">
        <div class="category-sections">
          <!-- 항공 섹션 -->
          <div class="category-section">
            <div 
              class="section-header"
              :class="{ active: activeSection === 'flight' }"
              @click="toggleSection('flight')"
            >
              <i class="pi pi-send"></i>
              <span>항공</span>
              <i class="pi pi-chevron-down section-arrow" :class="{ expanded: activeSection === 'flight' }"></i>
            </div>
            <div v-if="activeSection === 'flight'" class="section-items">
              <div 
                v-for="item in flightItems" 
                :key="item.id"
                class="section-item"
                :class="{ active: selectedItem === item.id }"
                @click="selectItem(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>

          <!-- 숙박 섹션 -->
          <div class="category-section">
            <div 
              class="section-header"
              :class="{ active: activeSection === 'hotel' }"
              @click="toggleSection('hotel')"
            >
              <i class="pi pi-home"></i>
              <span>숙박</span>
              <i class="pi pi-chevron-down section-arrow" :class="{ expanded: activeSection === 'hotel' }"></i>
            </div>
            <div v-if="activeSection === 'hotel'" class="section-items">
              <div 
                v-for="item in hotelItems" 
                :key="item.id"
                class="section-item"
                :class="{ active: selectedItem === item.id }"
                @click="selectItem(item.id)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="main-content" :class="{ 'sidebar-expanded': sidebarOpen }">
      <!-- 이미지 리스트 (왼쪽 1/4) -->
      <div class="image-list-container">
        <div class="image-list">
          <div 
            v-for="(image, index) in images" 
            :key="index"
            class="image-item"
            :class="{ active: selectedImageIndex === index }"
            @click="selectImage(index)"
          >
            <img :src="image.src" :alt="image.alt" />
            <div class="image-overlay">
              <span class="image-title">{{ image.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- VNC 뷰어 (오른쪽 3/4) -->
      <div class="vnc-viewer">
        <div class="viewer-container">
          <iframe 
            src="http://1.228.118.45:6081/vnc.html?autoconnect=true&resize=scale"
            class="vnc-iframe"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestPromptScreen',
  data() {
    return {
      sidebarOpen: false,
      activeSection: 'flight',
      selectedItem: 'tokyo',
      selectedImageIndex: 0,
      flightItems: [
        { id: 'tokyo', name: 'Tokyo' },
        { id: 'sydney', name: 'Sydney' },
        { id: 'paris', name: 'Paris' },
        { id: 'london', name: 'London' }
      ],
      hotelItems: [
        { id: 'hilton', name: 'Hilton Hotel' },
        { id: 'marriott', name: 'Marriott' },
        { id: 'hyatt', name: 'Hyatt' },
        { id: 'sheraton', name: 'Sheraton' }
      ],
      images: [
        {
          src: require('@/assets/screenshot-dummy/screenshot-1.png'),
          alt: 'Screenshot 1',
          title: 'Step 1',
          description: '테스트용 이미지 1입니다.'
        },
        {
          src: require('@/assets/screenshot-dummy/screenshot-2.png'),
          alt: 'Screenshot 2',
          title: 'Step 2',
          description: '테스트용 이미지 2입니다.'
        },
        {
          src: require('@/assets/screenshot-dummy/screenshot-3.png'),
          alt: 'Screenshot 3',
          title: 'Step 3',
          description: '테스트용 이미지 3입니다.'
        },
        {
          src: require('@/assets/screenshot-dummy/screenshot-4.png'),
          alt: 'Screenshot 4',
          title: 'Step 4',
          description: '테스트용 이미지 4입니다.'
        },
        {
          src: require('@/assets/screenshot-dummy/screenshot-5.png'),
          alt: 'Screenshot 5',
          title: 'Step 5',
          description: '테스트용 이미지 5입니다.'
        }
      ]
    }
  },
  computed: {
    selectedImage() {
      return this.images[this.selectedImageIndex] || null;
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    toggleSection(section) {
      this.activeSection = this.activeSection === section ? null : section;
    },
    selectItem(itemId) {
      this.selectedItem = itemId;
    },
    selectImage(index) {
      this.selectedImageIndex = index;
    }
  }
}
</script>

<style scoped lang="scss">
.test-script-screen {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-primary);
  font-family: var(--font-family-primary);
}

/* 독립적인 사이드바 */
.test-sidebar {
  width: 60px;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border-secondary);
  transition: width 0.3s ease;
  flex-shrink: 0;
  
  &.sidebar-open {
    width: 240px;
  }
}

.sidebar-header {
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-secondary);
}

.sidebar-toggle {
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  
  &:hover {
    background: var(--color-bg-card-hover);
  }
}

.sidebar-title {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  font-size: 1.1rem;
}

.sidebar-content {
  padding: var(--spacing-lg);
}

.category-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.category-section {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-secondary);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  font-weight: var(--font-weight-medium);
  background: var(--color-bg-tertiary);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-bg-card-hover);
    color: var(--color-text-primary);
  }
  
  &.active {
    background: var(--color-primary);
    color: var(--color-text-primary);
  }
  
  i {
    font-size: 1.1rem;
  }
}

.section-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
  
  &.expanded {
    transform: rotate(180deg);
  }
}

.section-items {
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border-secondary);
}

.section-item {
  padding: var(--spacing-sm) var(--spacing-xl);
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid transparent;
  
  &:hover {
    background: var(--color-bg-card-hover);
    color: var(--color-text-primary);
  }
  
  &.active {
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }
  
  &:last-child {
    border-bottom: none;
  }
}

/* 메인 컨텐츠 */
.main-content {
  flex: 1;
  display: flex;
  transition: margin-left 0.3s ease;
}

/* 이미지 리스트 (왼쪽 1/4) */
.image-list-container {
  width: 25%;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border-secondary);
  overflow-y: auto;
  max-height: 100vh;
}

.image-list {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.image-item {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &.active {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-xl);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: var(--spacing-lg) var(--spacing-md) var(--spacing-md);
  color: white;
}

.image-title {
  font-size: 0.9rem;
  font-weight: var(--font-weight-medium);
}

/* VNC 뷰어 (오른쪽 3/4) */
.vnc-viewer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
}

.viewer-container {
  width: 100%;
  height: 100%;
  max-width: 1800px;
  max-height: 95vh;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.vnc-iframe {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
  border-radius: var(--radius-xl);
}

/* Fade 애니메이션 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .test-script-screen {
    flex-direction: column;
  }
  
  .test-sidebar {
    width: 100%;
    height: auto;
    
    &.sidebar-open {
      width: 100%;
    }
  }
  
  .sidebar-header {
    justify-content: space-between;
  }
  
  .category-sections {
    flex-direction: row;
    gap: var(--spacing-md);
    overflow-x: auto;
  }
  
  .category-section {
    min-width: 160px;
    flex-shrink: 0;
  }
  
  .section-items {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 10;
  }
  
  .main-content {
    flex-direction: column;
    height: calc(100vh - 80px);
  }
  
  .image-list-container {
    width: 100%;
    height: 40%;
    max-height: none;
  }
  
  .image-list {
    flex-direction: row;
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
  }
  
  .image-item {
    min-width: 120px;
    width: 120px;
  }
  
  .image-viewer {
    height: 60%;
    padding: var(--spacing-lg);
  }
  
  .vnc-iframe {
    min-height: 400px;
  }
}

@media (max-width: 480px) {
  .image-list {
    padding: var(--spacing-sm);
  }
  
  .image-item {
    min-width: 100px;
    width: 100px;
  }
  
  .image-viewer {
    padding: var(--spacing-md);
  }
}
</style>
