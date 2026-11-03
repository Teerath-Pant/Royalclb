import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')

  if (!env.PORT) {
    throw new Error('Missing required environment variable: PORT')
  }
  if (!env.API_URL) {
    throw new Error('Missing required environment variable: API_URL')
  }

  return {
    plugins: [react()],
    server: {
      port: Number(env.PORT),
      strictPort: true,
      proxy: {
        '/api': {
          target: env.API_URL,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})