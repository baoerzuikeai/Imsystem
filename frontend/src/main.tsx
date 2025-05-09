import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter
import { ApiProvider } from './contexts/api-context.tsx' // Import ApiProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* Wrap App with BrowserRouter */}
    <ApiProvider> 
      <App />
    </ApiProvider>
    </BrowserRouter>
  </StrictMode>,
)
