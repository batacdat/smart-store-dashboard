import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Thêm dòng này
import { Toaster } from 'react-hot-toast' // Thêm dòng này
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async'
import { CartProvider } from './contexts/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
      <HelmetProvider> {/* Bọc App lại */}
        <CartProvider> {/* Thêm ở đây */}
          <App />
        </CartProvider>
    </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)