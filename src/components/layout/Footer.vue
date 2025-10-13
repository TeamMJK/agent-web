<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <router-link to="/privacy-policy" class="footer-link">개인정보처리방침</router-link>
        <span class="footer-divider">|</span>
        <router-link to="/terms-of-service" class="footer-link">이용약관</router-link>
      </div>
      
      <div class="footer-company-info">
        <p class="company-name">엠제이케이 | 대표 최명재 | 사업자등록번호 : 491-05-03571</p>
        <p class="company-address">소재지 : 충청남도 천안시 서북구 성환읍 성환1로 167, 2층 202-S16호</p>
        <div class="company-contact">
          <span>TEL: 010-9964-7303</span>
          <span class="contact-divider">|</span>
          <a href="mailto:mjkagent@gmail.com" class="footer-email">mjkagent@gmail.com</a>
        </div>
      </div>
      
      <div class="footer-copyright">
        <p>Copyright © MJK. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style scoped>
.footer {
  width: 100%;
  max-width: 100vw;
  background: var(--bg-primary, #0a0a0a);
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  padding: 32px 24px 24px;
  margin-top: auto;
  box-sizing: border-box;
  overflow-x: hidden;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-link {
  color: var(--text-primary, #ffffff);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--accent-blue, #4dabf7);
}

.footer-divider {
  color: var(--text-secondary, #888888);
  font-size: 0.9rem;
}

.footer-company-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  color: var(--text-secondary, #888888);
  font-size: 0.8rem;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: keep-all;
}

.footer-company-info p {
  margin: 0;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.company-name {
  font-weight: 500;
}

.company-address {
  color: var(--text-secondary, #666666);
}

.company-contact {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-divider {
  color: var(--text-secondary, #666666);
}

.footer-email {
  color: var(--accent-blue, #4dabf7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-email:hover {
  color: var(--accent-blue-hover, #339af0);
  text-decoration: underline;
}

.footer-copyright {
  text-align: center;
  color: var(--text-secondary, #666666);
  font-size: 0.75rem;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.05));
}

.footer-copyright p {
  margin: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .footer {
    padding: 24px 12px 20px;
  }
  
  .footer-content {
    gap: 16px;
    padding: 0 4px;
  }
  
  .footer-links {
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .footer-link {
    font-size: 0.85rem;
  }
  
  .footer-company-info {
    font-size: 0.7rem;
    padding: 0 8px;
  }
  
  .company-name {
    font-size: 0.7rem;
    line-height: 1.6;
  }
  
  .company-address {
    font-size: 0.65rem;
    line-height: 1.6;
  }
  
  .company-contact {
    flex-direction: column;
    gap: 4px;
    font-size: 0.7rem;
  }
  
  .contact-divider {
    display: none;
  }
  
  .footer-copyright {
    font-size: 0.65rem;
    padding-top: 12px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 20px 8px 16px;
  }
  
  .footer-company-info {
    font-size: 0.65rem;
  }
  
  .company-name {
    font-size: 0.65rem;
  }
  
  .company-address {
    font-size: 0.6rem;
  }
  
  .company-contact {
    font-size: 0.65rem;
  }
}
</style>
