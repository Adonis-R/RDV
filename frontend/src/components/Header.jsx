import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  // Le token est dans un cookie httpOnly (invisible au JS). On se base sur la présence des infos user.
  const isLoggedIn = Boolean(localStorage.getItem('user'));

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

  // Toujours vers le dashboard unifié — la bascule perso/pro se fait via les onglets
  function handleMonCompte() {
    navigate('/dashboard');
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
