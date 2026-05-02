import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import CreateCompany from './pages/CreateCompany'
import Dashboard from './pages/Dashboard'
import DashboardClient from './pages/DashboardClient'
import './css/App.css'

// Composant racine : définit toutes les pages et leurs URLs
function App() {
  return (
    // BrowserRouter active la navigation sans rechargement de page (SPA)
    <BrowserRouter>
      <Routes>
        {/* ── Pages de l'application ── */}
        <Route path="/"               element={<Home />} />          {/* Page d'accueil */}
        <Route path="/auth"           element={<AuthPage />} />       {/* Connexion / Inscription */}
        <Route path="/create-company" element={<CreateCompany />} />  {/* Création d'entreprise */}
        <Route path="/dashboard"        element={<Dashboard />} />        {/* Tableau de bord pro */}
        <Route path="/dashboard-client" element={<DashboardClient />} />  {/* Tableau de bord client */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
