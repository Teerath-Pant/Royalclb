import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import 'notyf/notyf.min.css'
import './legacy/bootstrap.min.css'
import './legacy/typography.css'
import './legacy/style.css'
import './legacy/responsive.css'
import './legacy/dataTables.bootstrap4.min.css'
import './legacy/bootstrap-datepicker.min.css'
import './legacy/admin.css'
import App from './App'
import { queryClient } from './lib/query-client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
