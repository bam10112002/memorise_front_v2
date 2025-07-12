import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { LoginProvider } from '@/services/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginProvider>
      <App />  
    </LoginProvider>
  </StrictMode>,
)
