import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ecogreencab': {
        target: 'https://affecting-tingling-duke.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
