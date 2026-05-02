import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'

// Point d'entrée de l'application : monte React dans la div #root du index.html
createRoot(document.getElementById('root')).render(
  // StrictMode affiche des avertissements supplémentaires en développement (sans effet en production)
  <StrictMode>
    <App />
  </StrictMode>,
)
