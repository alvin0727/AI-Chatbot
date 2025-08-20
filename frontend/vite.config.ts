import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 3001,
    allowedHosts: [  
      'localhost',
      '127.0.0.1', 
      'fechatbot.alvinboys.id'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 3001,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'fechatbot.alvinboys.id',
    ]
  }
})