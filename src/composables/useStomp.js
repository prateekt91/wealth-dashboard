import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_BASE = import.meta.env.VITE_WS_BASE || ''

/**
 * STOMP over SockJS to backend /ws.
 * Subscribes to /topic/ingestion and /topic/transactions for live updates.
 */
export function useStomp(options = {}) {
  const { onIngestion, onTransaction, onConnect, onDisconnect } = options

  let client = null
  let ingestionSub = null
  let transactionSub = null

  function connect() {
    const base = WS_BASE || ''
    const url = base ? `${base}/ws` : '/ws'
    client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        ingestionSub = client.subscribe('/topic/ingestion', (msg) => {
          try {
            const body = JSON.parse(msg.body)
            onIngestion?.(body)
          } catch (_) {}
        })
        transactionSub = client.subscribe('/topic/transactions', (msg) => {
          try {
            const body = JSON.parse(msg.body)
            onTransaction?.(body)
          } catch (_) {}
        })
        onConnect?.()
      },
      onDisconnect: () => {
        onDisconnect?.()
      },
    })
    client.activate()
  }

  function disconnect() {
    if (ingestionSub) ingestionSub.unsubscribe()
    if (transactionSub) transactionSub.unsubscribe()
    if (client) client.deactivate()
    client = null
  }

  return { connect, disconnect }
}
