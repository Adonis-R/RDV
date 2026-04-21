<<<<<<< HEAD
function Header() {
  return (
    <header className="header">
      <h1>HEADER</h1>
=======
import { useState } from 'react';
import logo from '../assets/logo_align.png';
import './Header.css';

function Header() {
  const [isLoggedIn] = useState(false);

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo RDV" />
      </div>
      <nav className="header-nav">
        <button className="btn btn-pro">Espace pro</button>
        {isLoggedIn ? (
          <button className="btn btn-account">Mon compte</button>
        ) : (
          <button className="btn btn-connexion">Connexion</button>
        )}
      </nav>
>>>>>>> e6e703c1a2d3cdeb12fa1cb90422c2ff2b1057f2
    </header>
  );
}

export default Header;