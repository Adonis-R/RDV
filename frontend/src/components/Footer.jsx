import logo from '../assets/logo_text.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      {/* ── Partie haute : logo + colonnes de liens ── */}
      <div className="footer-top">

        {/* Marque avec slogan */}
        <div className="footer-brand">
          <img src={logo} alt="MyRDV" className="footer-logo" />
          <p className="footer-slogan">Votre temps, notre priorité</p>
        </div>

        {/* ── Colonnes de liens de navigation ── */}
        <div className="footer-links">

          {/* Liens pour les patients (fonctionnalités à venir) */}
          <div className="footer-col">
            <h4>Pour les patients</h4>
            <ul>
              <li><a href="#">Rechercher un praticien</a></li>
              <li><a href="#">Mes rendez-vous</a></li>
              <li><a href="#">Créer un compte</a></li>
            </ul>
          </div>

          {/* Liens pour les professionnels (fonctionnalités à venir) */}
          <div className="footer-col">
            <h4>Pour les professionnels</h4>
            <ul>
              <li><a href="#">Espace pro</a></li>
              <li><a href="#">Gérer mon agenda</a></li>
              <li><a href="#">Tarifs</a></li>
            </ul>
          </div>

          {/* Liens institutionnels */}
          <div className="footer-col">
            <h4>À propos</h4>
            <ul>
              <li><a href="#">Qui sommes-nous</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Mentions légales</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bande du bas : copyright avec année dynamique ── */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MyRDV. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
