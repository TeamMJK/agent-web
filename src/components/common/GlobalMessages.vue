<template>
  <div class="global-messages" v-if="notifyState.queue.length">
    <transition-group name="fade-slide" tag="div" class="message-stack">
      <BaseMessage
        v-for="m in notifyState.queue"
        :key="m.id"
        :type="m.type"
        size="small"
        class="stack-item"
      >
        {{ m.text }}
      </BaseMessage>
    </transition-group>
  </div>
</template>

<script>
import { notifyState, removeMessage } from '@/utils/notify.js';
import BaseMessage from './BaseMessage.vue';

export default {
  name: 'GlobalMessages',
  components: { BaseMessage },
  setup() {
    return { notifyState, removeMessage };
  }
};
</script>

<style scoped>
.global-messages {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: min(560px, calc(100% - 32px));
  z-index: 4000;
  pointer-events: none; /* 메시지 뒤 UI 클릭 가능 */
}

.message-stack { display: flex; flex-direction: column; align-items: stretch; }
.stack-item { pointer-events: auto; }

/* 애니메이션 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all .28s ease; }
.fade-slide-enter-from { opacity:0; transform: translate(-50%, -8px); }
.fade-slide-leave-to { opacity:0; transform: translate(-50%, -6px); }
</style>
