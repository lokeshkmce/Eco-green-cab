import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { MarketplaceProvider } from './context/MarketplaceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarketplaceProvider>
      <App />
    </MarketplaceProvider>
  </StrictMode>,
)
