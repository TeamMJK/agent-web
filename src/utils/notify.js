import { reactive } from 'vue';

export const notifyState = reactive({
    queue: [] // { id, type, text, timeout }
});

export function pushMessage({ type = 'success', text = '', timeout = 3000 } = {}) {
    if (!text) return;
    const id = Date.now() + Math.random();
    notifyState.queue.push({ id, type, text });
    if (timeout > 0) {
        setTimeout(() => removeMessage(id), timeout);
    }
}

export function removeMessage(id) {
    const idx = notifyState.queue.findIndex(m => m.id === id);
    if (idx !== -1) notifyState.queue.splice(idx, 1);
}
