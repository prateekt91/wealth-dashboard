const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function fetchTransactions(params = {}) {
  const { page = 0, size = 20 } = params
  const q = new URLSearchParams({ page, size })
  const res = await fetch(`${API_BASE}/api/v1/transactions?${q}`)
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export async function fetchTransactionSummary() {
  const res = await fetch(`${API_BASE}/api/v1/transactions/summary`)
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}
