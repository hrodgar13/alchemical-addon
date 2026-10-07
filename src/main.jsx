import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {PotionComponentProvider} from "./contexts/PotionComponentsContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <PotionComponentProvider>
          <App />
      </PotionComponentProvider>
  </StrictMode>,
)
