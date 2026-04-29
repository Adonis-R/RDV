import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import CreateCompany from './pages/CreateCompany'
import './css/App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create-company" element={<CreateCompany />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
