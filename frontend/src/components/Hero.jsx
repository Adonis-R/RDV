import { useState, useRef, useEffect } from 'react';
import './Hero.css';

// Liste des suggestions affichées dans le dropdown
const suggestions = [
  'Médecin généraliste',
  'Dentiste',
  'Kinésithérapeute',
  'Ophtalmologue',
  'Dermatologue',
  'Gynécologue',
  'Pédiatre',
  'Ostéopathe',
  'Psychologue',
  'ORL',
];

function Hero() {
  const [what, setWhat] = useState('');      // Valeur du champ "Que cherchez-vous ?"
  const [where, setWhere] = useState('');    // Valeur du champ "Où"
  const [showDrawer, setShowDrawer] = useState(false); // Contrôle l'ouverture du dropdown
  const drawerRef = useRef(null);            // Référence au conteneur du dropdown (pour détecter le clic extérieur)

  // Filtre les suggestions en fonction de ce que l'utilisateur tape
  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(what.toLowerCase())
  );

  // Ferme le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setShowDrawer(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    // Nettoyage : retire l'écouteur quand le composant est démonté
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Prenez rendez-vous en ligne,{' '}
          <span className="hero-highlight">simplement.</span>
        </h1>
        <p className="hero-subtitle">
          Trouvez un professionnel près de chez vous et réservez en quelques clics.
        </p>

        {/* ── Barre de recherche ── */}
        <div className="search-bar">

          {/* Champ 1 : Que cherchez-vous ? */}
          <div className="search-field search-what" ref={drawerRef}>
            <label className="search-label">
              <span className="search-label-text">Que cherchez-vous ?</span>
              <input
                type="text"
                className="search-input"
                placeholder="Nom du praticien, spécialité..."
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                onFocus={() => setShowDrawer(true)}  // Ouvre le dropdown au focus
                autoComplete="off"
              />
            </label>

            {/* Dropdown : s'affiche seulement si showDrawer est true ET qu'il y a des résultats */}
            {showDrawer && filtered.length > 0 && (
              <div className="search-drawer">
                <ul className="search-drawer-list">
                  {filtered.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="search-drawer-item"
                        onClick={() => {
                          setWhat(item);           // Remplit l'input avec la suggestion choisie
                          setShowDrawer(false);    // Ferme le dropdown
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Séparateur vertical entre les deux champs */}
          <div className="search-separator" />

          {/* Champ 2 : Où */}
          <div className="search-field search-where">
            <label className="search-label">
              <span className="search-label-text">Où</span>
              <input
                type="text"
                className="search-input"
                placeholder="Adresse, ville..."
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                autoComplete="off"
              />
            </label>
          </div>

          {/* Bouton Rechercher avec icône loupe SVG */}
          <button className="search-btn" aria-label="Rechercher">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 18L14.8966 14.8966M6 11.1724C6 8.31577 8.31577 6 11.1724 6C14.0291 6 16.3448 8.31577 16.3448 11.1724C16.3448 14.0291 14.0291 16.3448 11.1724 16.3448C8.31577 16.3448 6 14.0291 6 11.1724Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="search-btn-text">Rechercher</span>
          </button>
        </div>

        <div className="hero-tags">
          <span className="hero-tag">Médecin généraliste</span>
          <span className="hero-tag">Dentiste</span>
          <span className="hero-tag">Kiné</span>
          <span className="hero-tag">Ophtalmologue</span>
          <span className="hero-tag">Dermatologue</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;