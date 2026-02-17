<script setup>
defineProps({
  connected: { type: Boolean, default: false },
  lastEvent: { type: Object, default: null },
})
</script>

<template>
  <div class="live" :class="{ connected }">
    <span class="dot" />
    <span class="label">{{ connected ? 'Live' : 'Reconnecting…' }}</span>
    <span v-if="lastEvent" class="hint">
      {{ lastEvent.type === 'transaction' ? 'New transaction' : 'New message' }}
      {{ lastEvent.at ? new Date(lastEvent.at).toLocaleTimeString() : '' }}
    </span>
  </div>
</template>

<style scoped>
.live {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--muted);
}

.live.connected {
  color: var(--live);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--muted);
}

.connected .dot {
  background: var(--live);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.hint {
  margin-left: 0.5rem;
  color: var(--muted);
  font-size: 0.75rem;
}
</style>
