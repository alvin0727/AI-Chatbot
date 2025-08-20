import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { Toaster } from 'react-hot-toast'
import Footer from './pages/Footer.tsx'

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto Slab, serif',
    allVariants: { color: "white" },
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Toaster position="top-right" />
          <App />
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

