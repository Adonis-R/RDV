import { useState } from 'react';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const [isLoggedIn] = useState(false);

  return (
    <header className="header">
      <div className="header-logo">
        <a href="/"><img src={logo} alt="Logo RDV" /></a>
      </div>
      <nav className="header-nav">
        <button className="btn btn-pro">Espace pro</button>
        {isLoggedIn ? (
          <button className="btn btn-account">Mon compte</button>
        ) : (
          <a href="/login"><button className="btn btn-connexion">Connexion</button></a>
        )}
      </nav>
    </header>
  );
}

export default Header;