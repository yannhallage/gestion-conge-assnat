import { StrictMode } from 'react'
import { Toaster } from "sonner";
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </StrictMode>,
)
