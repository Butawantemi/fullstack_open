import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import { Container } from '@mui/material'

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <Container maxWidth='lg'>
      <App />
    </Container>
  </BrowserRouter>,
)
