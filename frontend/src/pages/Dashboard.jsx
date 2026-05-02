import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Dashboard.css";

// Libellés lisibles pour les types d'entreprise
const COMPANY_TYPE_LABELS = {
  AUTO_ENTREPRENEUR: "Auto-entrepreneur",
  ARTISAN: "Artisan",
  COMMERCANT: "Commerçant",
  PROFESSION_LIBERALE: "Profession libérale",
  SOCIETE: "Société",
  ASSOCIATION: "Association",
};

// Libellés affichés pour le rôle dans l'entreprise
const COMPANY_ROLE_LABELS = {
  OWNER: "Gérant",
  STAFF: "Staff",
};

function Dashboard() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [view, setView] = useState("personal"); // "personal" | "pro"
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement : lit l'utilisateur et, s'il a une entreprise, charge ses infos
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/auth", {
        state: { notice: "Vous devez être connecté pour accéder à votre espace." },
      });
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(stored);
    } catch {
      navigate("/auth");
      return;
    }
    setUser(parsedUser);

    // Pas d'entreprise → on ne charge que la vue "Mon compte"
    if (!parsedUser.companyId) {
      setIsLoading(false);
      return;
    }

    // L'utilisateur est pro → vue par défaut = espace pro + chargement des infos entreprise
    setView("pro");
    fetch(`${apiBaseUrl}/api/company/me`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          navigate("/auth", {
            state: { notice: "Vous devez être connecté pour accéder à votre espace." },
          });
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data === null) return; // déjà redirigé
        if (!data) {
          navigate("/create-company");
          return;
        }
        setCompany(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [apiBaseUrl, navigate]);

  // Déconnexion : le backend efface le cookie httpOnly, on nettoie le local
  async function handleLogout() {
    await fetch(`${apiBaseUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  }

  if (isLoading || !user) {
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

  const hasCompany = Boolean(user.companyId && company);

  return (
    <>
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* ── En-tête : titre dynamique + bouton déconnexion ── */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                {view === "pro" && hasCompany
                  ? company.name
                  : `${user.firstName} ${user.lastName}`}
              </h1>
              <span className="dashboard-badge">
                {view === "pro" && hasCompany
                  ? (COMPANY_ROLE_LABELS[user.companyRole] ?? user.companyRole ?? "Membre")
                  : "Mon compte"}
              </span>
            </div>
            <button className="dashboard-logout-btn" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>

          {/* ── Onglets : visibles uniquement si l'utilisateur a une entreprise ── */}
          {hasCompany && (
            <div className="dashboard-tabs">
              <button
                className={`dashboard-tab ${view === "personal" ? "active" : ""}`}
                onClick={() => setView("personal")}
              >
                Mon compte
              </button>
              <button
                className={`dashboard-tab ${view === "pro" ? "active" : ""}`}
                onClick={() => setView("pro")}
              >
                Espace pro
              </button>
            </div>
          )}

          {/* ── Vue "Mon compte" : infos personnelles ── */}
          {view === "personal" && (
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h2 className="dashboard-card-title">Mes informations</h2>
                <ul className="dashboard-info-list">
                  <li>
                    <span className="info-label">Prénom</span>
                    <span className="info-value">{user.firstName}</span>
                  </li>
                  <li>
                    <span className="info-label">Nom</span>
                    <span className="info-value">{user.lastName}</span>
                  </li>
                  <li>
                    <span className="info-label">E-mail</span>
                    <span className="info-value">{user.email}</span>
                  </li>
                </ul>
              </div>

              <div className="dashboard-card dashboard-card-coming">
                <h2 className="dashboard-card-title">Mes rendez-vous</h2>
                <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
              </div>

              <div className="dashboard-card dashboard-card-coming">
                <h2 className="dashboard-card-title">Historique</h2>
                <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
              </div>

              <div className="dashboard-card dashboard-card-coming">
                <h2 className="dashboard-card-title">Favoris</h2>
                <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
              </div>
            </div>
          )}

          {/* ── Vue "Espace pro" : infos entreprise ── */}
          {view === "pro" && hasCompany && (
            <div className="dashboard-grid">
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

              <div className="dashboard-card dashboard-card-coming">
                <h2 className="dashboard-card-title">Rendez-vous</h2>
                <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
              </div>

              <div className="dashboard-card dashboard-card-coming">
                <h2 className="dashboard-card-title">Créneaux horaires</h2>
                <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
