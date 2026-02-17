<script setup>
defineProps({
  transactions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatAmount(amount, currency = 'INR') {
  if (amount == null) return '—'
  const n = Number(amount)
  if (Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 2,
  }).format(n)
}

function isCredit(type) {
  return String(type).toUpperCase() === 'CREDIT'
}
</script>

<template>
  <section class="ledger">
    <h2>Ledger</h2>
    <div v-if="loading" class="loading">Loading…</div>
    <div v-else-if="!transactions.length" class="empty">No transactions yet. Ingest SMS or email to see entries here.</div>
    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tx in transactions"
            :key="tx.id"
            class="row"
            :class="{ credit: isCredit(tx.transactionType), debit: !isCredit(tx.transactionType) }"
          >
            <td>{{ formatDate(tx.transactionDate) }}</td>
            <td>
              <span class="badge" :class="isCredit(tx.transactionType) ? 'credit' : 'debit'">
                {{ tx.transactionType || '—' }}
              </span>
            </td>
            <td>{{ tx.merchantName || '—' }}</td>
            <td class="amount" :class="isCredit(tx.transactionType) ? 'credit' : 'debit'">
              {{ formatAmount(tx.amount, tx.currency) }}
            </td>
            <td class="desc">{{ (tx.description || '—').slice(0, 60) }}{{ (tx.description || '').length > 60 ? '…' : '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.ledger h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.loading,
.empty {
  color: var(--muted);
  padding: 2rem;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.table th {
  text-align: left;
  padding: 0.75rem 1rem;
  color: var(--muted);
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
}

.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.credit {
  background: rgba(34, 197, 94, 0.15);
  color: var(--credit);
}

.badge.debit {
  background: rgba(239, 68, 68, 0.15);
  color: var(--debit);
}

.amount.credit { color: var(--credit); }
.amount.debit { color: var(--debit); }

.desc {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--muted);
}
</style>
