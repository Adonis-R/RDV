import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  function handleEspacePro() {
    if (!isLoggedIn) {
      navigate('/auth', {
        state: { notice: 'Vous devez être connecté avant de créer un compte entreprise.' },
      });
      return;
    }
    navigate('/create-company');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  }

  return (
    <header className="header">
      <div className="header-logo">
        <a href="/"><img src={logo} alt="Logo RDV" /></a>
      </div>
      <nav className="header-nav">
        <button className="btn btn-pro" onClick={handleEspacePro}>Espace pro</button>
        {isLoggedIn ? (
          <button className="btn btn-account" onClick={handleLogout}>Se déconnecter</button>
        ) : (
          <a href="/auth"><button className="btn btn-connexion">Connexion</button></a>
        )}
      </nav>
    </header>
  );
}

export default Header;
