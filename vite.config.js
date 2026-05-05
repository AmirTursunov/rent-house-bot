import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mini-app-pink-six.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
