import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './styles.css'
import { LanguageProvider } from './language'
import { productName } from './product'
import { router } from './routes'

document.title = productName

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
)
