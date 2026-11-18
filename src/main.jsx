import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './css/tokens.css'
import './css/components.css'
import './css/tailwind.css' // last, so utilities override component defaults
import App from './App.jsx'
import { queries } from './api/hooks.js'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

// Start downloading the shared content (header, footer, banners, categories) and the home page code right away,
// in parallel, instead of waiting for the page to mount first.
queryClient.prefetchQuery(queries.site)
if (location.pathname === '/') {
  queryClient.prefetchQuery(queries.categories)
  queryClient.prefetchQuery(queries.testimonials)
  import('./pages/HomePage.jsx')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
