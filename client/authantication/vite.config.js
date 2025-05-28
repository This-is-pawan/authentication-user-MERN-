import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
plugins: [react()],
  server: {
    proxy: {
      // This means: requests starting with /api will be forwarded to localhost:4000
      '/api': {
        // target: 'https://authbackend-acbf.onrender.com', // your backend URL
        target: 'https://authfrontend-d99r.onrender.com', // your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
