import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Connect, Plugin } from 'vite'

// The marketing landing page is a prebuilt bundle in public/, shown at "/" ahead of the app's own routes.
const landingAtRoot: Connect.NextHandleFunction = (req, _res, next) => {
  if (req.url === '/' || req.url?.startsWith('/?')) {
    req.url = '/landing.html'
  }
  next()
}

const landing = (): Plugin => ({
  name: 'landing-at-root',
  configureServer: (server) => void server.middlewares.use(landingAtRoot),
  configurePreviewServer: (server) => void server.middlewares.use(landingAtRoot),
})

export default defineConfig({
  plugins: [landing(), react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  server: {
    port: 5173,
    strictPort: true,
    // The API has no /api prefix of its own; production needs the same rewrite in the reverse proxy.
    proxy: {
      // Admin-uploaded banners live on the PHP site; production serves them from the same domain.
      '/assets/SupportFile': { target: 'https://royalclub.world', changeOrigin: true },
      '/api': {
        target: 'http://localhost:3000',
        ws: true, // the games use Socket.IO at /api/socket.io
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
