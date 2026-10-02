import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

function showFatalError(message: string) {
  document.body.innerHTML = `
    <div style="
      background:#050914;
      color:white;
      min-height:100vh;
      padding:30px;
      font-family:Arial,sans-serif;
      box-sizing:border-box;
    ">
      <h2 style="color:#ef4444">Errore avvio FLÖDE</h2>
      <pre style="
        white-space:pre-wrap;
        word-break:break-word;
        font-size:14px;
      ">${message}</pre>
    </div>
  `
}

window.addEventListener('error', (event) => {
  showFatalError(
    `${event.message}\n\n${event.error?.stack || ''}`
  )
})

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason

  showFatalError(
    `Unhandled Promise Rejection:\n\n${
      reason?.stack || reason?.message || String(reason)
    }`
  )
})

try {
  const root = document.getElementById('root')

  if (!root) {
    throw new Error('Elemento #root non trovato')
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  const message =
    error instanceof Error
      ? `${error.message}\n\n${error.stack || ''}`
      : String(error)

  showFatalError(message)
}