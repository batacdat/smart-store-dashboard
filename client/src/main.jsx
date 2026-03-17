import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Thêm dòng này
import { Toaster } from 'react-hot-toast' // Thêm dòng này
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
      <App />
    </BrowserRouter>
  </StrictMode>,
)