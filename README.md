# Wealth Manager Dashboard

Vue 3 + Vite dashboard that visualizes the ledger and uses **WebSockets (STOMP)** to receive instant updates when an SMS (or email) is parsed, so the UI stays live without polling.

## Setup

```bash
cd wealth-dashboard
npm install
```

## Run (dev)

Start the backend first (port 8080), then:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server proxies `/api` and `/ws` to the backend, so no env vars are needed for local development.

## Build

```bash
npm run build
```

Output is in `dist/`. Serve it with any static host. For a different backend, set:

- `VITE_API_BASE` – e.g. `http://localhost:8080`
- `VITE_WS_BASE` – e.g. `http://localhost:8080` (same origin as API for SockJS)

## Features

- **Summary cards**: total transactions, total credit, total debit, net amount
- **Ledger table**: date, type (CREDIT/DEBIT), merchant, amount, description
- **Live indicator**: shows WebSocket connection status and last event (new message / new transaction)
- **Real-time updates**: when the backend parses a new SMS/email and saves a transaction, the dashboard updates immediately via STOMP (`/topic/ingestion`, `/topic/transactions`)

## Stack

- Vue 3 (Composition API, `<script setup>`)
- Vite 6
- @stomp/stompjs + sockjs-client for STOMP over SockJS to backend `/ws`
