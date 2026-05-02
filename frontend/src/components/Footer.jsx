import logo from '../assets/logo.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* ── Bloc identité (logo + nom + tagline) ── */}
        <div className="footer-identity-wrap">
          <img src={logo} alt="RDV" className="footer-logo" />
          <div className="footer-identity">
            <span className="footer-brand">RDV</span>
            <span className="footer-tagline">Votre temps, notre priorité</span>
          </div>
        </div>

        {/* ── Liens ── */}
        <nav className="footer-nav" aria-label="Liens du pied de page">
          <a href="#">À propos</a>
          <a href="#">Contact</a>
          <a href="#">Mentions légales</a>
          <a href="#">Confidentialité</a>
        </nav>
      </div>

      {/* ── Bande basse ── */}
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} RDV — Tous droits réservés</span>
      </div>
    </footer>
  );
}

export default Footer;
