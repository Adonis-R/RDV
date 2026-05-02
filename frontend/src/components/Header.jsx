import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  // Vérifie si un token existe en localStorage pour savoir si l'utilisateur est connecté
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  // Lit l'utilisateur depuis localStorage pour savoir s'il a une entreprise
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }

  // Redirige selon l'état : non connecté → /auth, entreprise existante → /dashboard, sinon → /create-company
  function handleEspacePro() {
    if (!isLoggedIn) {
      navigate('/auth', {
        state: { notice: 'Vous devez être connecté avant de créer un compte entreprise.' },
      });
      return;
    }
    const user = getUser();
    if (user.companyId) {
      navigate('/dashboard');
      return;
    }
    navigate('/create-company');
  }

  // Redirige vers le dashboard correspondant : pro si entreprise, client sinon
  function handleMonCompte() {
    const user = getUser();
    if (user.companyId) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard-client');
    }
  }

  return (
    <header className="header">
      {/* ── Logo cliquable qui ramène à l'accueil ── */}
      <div className="header-logo">
        <a href="/"><img src={logo} alt="Logo RDV" /></a>
      </div>

      <nav className="header-nav">
        {/* Bouton Espace pro : protégé par handleEspacePro */}
        <button className="btn btn-pro" onClick={handleEspacePro}>Espace pro</button>

        {/* Affiche "Mon compte" si connecté (vers le bon dashboard), sinon "Connexion" */}
        {isLoggedIn ? (
          <button className="btn btn-account" onClick={handleMonCompte}>Mon compte</button>
        ) : (
          <a href="/auth"><button className="btn btn-connexion">Connexion</button></a>
        )}
      </nav>
    </header>
  );
}

export default Header;
