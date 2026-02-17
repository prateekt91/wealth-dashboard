<script setup>
defineProps({
  summary: {
    type: Object,
    required: true,
  },
})

function formatAmount(val) {
  if (val == null) return '0'
  const n = Number(val)
  if (Number.isNaN(n)) return '0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}
</script>

<template>
  <div class="cards">
    <div class="card">
      <span class="card-label">Transactions</span>
      <span class="card-value">{{ summary.totalCount ?? 0 }}</span>
    </div>
    <div class="card credit">
      <span class="card-label">Credit (in)</span>
      <span class="card-value">{{ formatAmount(summary.totalCredit) }}</span>
    </div>
    <div class="card debit">
      <span class="card-label">Debit (out)</span>
      <span class="card-value">{{ formatAmount(summary.totalDebit) }}</span>
    </div>
    <div class="card net">
      <span class="card-label">Net</span>
      <span class="card-value" :class="(summary.netAmount ?? 0) >= 0 ? 'positive' : 'negative'">
        {{ formatAmount(summary.netAmount) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-label {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.card.credit .card-value { color: var(--credit); }
.card.debit .card-value { color: var(--debit); }
.card.net .card-value.positive { color: var(--credit); }
.card.net .card-value.negative { color: var(--debit); }
</style>
