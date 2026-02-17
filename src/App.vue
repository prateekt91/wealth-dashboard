<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useStomp } from './composables/useStomp'
import { fetchTransactions, fetchTransactionSummary } from './api/client'
import SummaryCards from './components/SummaryCards.vue'
import LedgerTable from './components/LedgerTable.vue'
import LiveIndicator from './components/LiveIndicator.vue'

const summary = ref(null)
const transactions = ref({ content: [], totalElements: 0 })
const loading = ref(true)
const error = ref(null)
const connected = ref(false)
const lastEvent = ref(null)
const wsError = ref(null)

function loadSummary() {
  fetchTransactionSummary()
    .then((data) => { summary.value = data })
    .catch((e) => { error.value = e.message })
}

function loadTransactions() {
  fetchTransactions({ page: 0, size: 50 })
    .then((data) => {
      transactions.value = data && typeof data === 'object' ? data : { content: [], totalElements: 0 }
    })
    .catch((e) => { error.value = e.message })
}

function onNewIngestion(ingestion) {
  lastEvent.value = { type: 'ingestion', at: new Date(), payload: ingestion }
  loadTransactions()
  loadSummary()
}

function onNewTransaction(txn) {
  lastEvent.value = { type: 'transaction', at: new Date(), payload: txn }
  const content = transactions.value.content || []
  transactions.value = {
    ...transactions.value,
    content: [txn, ...content],
    totalElements: (transactions.value.totalElements || 0) + 1,
  }
  loadSummary()
}

let disconnect = () => {}

onMounted(() => {
  loadSummary()
  loadTransactions().finally(() => { loading.value = false })

  nextTick(() => {
    try {
      const stomp = useStomp({
        onIngestion: onNewIngestion,
        onTransaction: onNewTransaction,
        onConnect: () => { connected.value = true; wsError.value = null },
        onDisconnect: () => { connected.value = false },
      })
      disconnect = stomp.disconnect
      stomp.connect()
    } catch (e) {
      wsError.value = e?.message || 'WebSocket setup failed'
      console.error('STOMP connect error:', e)
    }
  })
})

onUnmounted(() => {
  if (typeof disconnect === 'function') disconnect()
})
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <h1>Wealth Manager</h1>
      <p class="tagline">Ledger dashboard</p>
      <LiveIndicator :connected="connected" :last-event="lastEvent" />
      <p v-if="wsError" class="ws-error">Live updates: {{ wsError }}</p>
    </header>

    <main class="main">
      <SummaryCards v-if="summary" :summary="summary" />
      <p v-if="error" class="error">API: {{ error }}</p>
      <LedgerTable
        :transactions="Array.isArray(transactions.content) ? transactions.content : []"
        :loading="loading"
      />
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.tagline {
  color: var(--muted);
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error,
.ws-error {
  color: var(--debit);
  font-size: 0.9rem;
}

.ws-error {
  margin-top: 0.5rem;
  color: var(--muted);
}
</style>
