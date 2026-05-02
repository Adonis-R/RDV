import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [company, setCompany] = useState(null);   // Données de l'entreprise chargées depuis l'API
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement : vérifie la connexion et récupère les infos de l'entreprise
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth", {
        state: { notice: "Vous devez être connecté pour accéder au tableau de bord." },
      });
      return;
    }
    fetch(`${apiBaseUrl}/api/company/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          // Pas d'entreprise → redirige vers la création
          navigate("/create-company");
        } else {
          setCompany(data);
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, [apiBaseUrl, navigate]);

  // Déconnecte l'utilisateur : supprime le token et recharge la page
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  }

  // Libellé lisible pour le type d'entreprise
  const COMPANY_TYPE_LABELS = {
    AUTO_ENTREPRENEUR: "Auto-entrepreneur",
    ARTISAN: "Artisan",
    COMMERCANT: "Commerçant",
    PROFESSION_LIBERALE: "Profession libérale",
    SOCIETE: "Société",
    ASSOCIATION: "Association",
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="dashboard-main">
          <p className="dashboard-loading">Chargement...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* ── En-tête du tableau de bord ── */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">{company.name}</h1>
              <span className="dashboard-badge">{COMPANY_TYPE_LABELS[company.companyType] ?? company.companyType}</span>
            </div>
            <button className="dashboard-logout-btn" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>

          {/* ── Grille d'informations de l'entreprise ── */}
          <div className="dashboard-grid">

            {/* Informations légales */}
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Informations légales</h2>
              <ul className="dashboard-info-list">
                <li>
                  <span className="info-label">SIRET</span>
                  <span className="info-value">{company.siret}</span>
                </li>
                <li>
                  <span className="info-label">Type</span>
                  <span className="info-value">{COMPANY_TYPE_LABELS[company.companyType] ?? company.companyType}</span>
                </li>
                <li>
                  <span className="info-label">Activité</span>
                  <span className="info-value">{company.activityName}</span>
                </li>
              </ul>
            </div>

            {/* Coordonnées */}
            <div className="dashboard-card">
              <h2 className="dashboard-card-title">Coordonnées</h2>
              <ul className="dashboard-info-list">
                <li>
                  <span className="info-label">Téléphone</span>
                  <span className="info-value">{company.phone}</span>
                </li>
                <li>
                  <span className="info-label">Adresse</span>
                  <span className="info-value">{company.street}</span>
                </li>
                <li>
                  <span className="info-label">Ville</span>
                  <span className="info-value">{company.postalCode} {company.city}</span>
                </li>
              </ul>
            </div>

            {/* Section rendez-vous (à venir) */}
            <div className="dashboard-card dashboard-card-coming">
              <h2 className="dashboard-card-title">Rendez-vous</h2>
              <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
            </div>

            {/* Section créneaux (à venir) */}
            <div className="dashboard-card dashboard-card-coming">
              <h2 className="dashboard-card-title">Créneaux horaires</h2>
              <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
