import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Dashboard.css";

function DashboardClient() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [user, setUser] = useState(null);   // Infos utilisateur lues depuis localStorage

  // Au chargement : vérifie la présence des infos user (le token est dans un cookie httpOnly)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/auth", {
        state: { notice: "Vous devez être connecté pour accéder à votre espace." },
      });
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      // Si l'utilisateur a une entreprise, on le redirige vers le dashboard pro
      if (parsed.companyId) {
        navigate("/dashboard");
        return;
      }
      setUser(parsed);
    } catch {
      navigate("/auth");
    }
  }, [navigate]);

  // Déconnecte l'utilisateur : le backend efface le cookie, on nettoie le local
  async function handleLogout() {
    await fetch(`${apiBaseUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  }

  if (!user) {
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
              <h1 className="dashboard-title">{user.firstName} {user.lastName}</h1>
              <span className="dashboard-badge">Compte client</span>
            </div>
            <button className="dashboard-logout-btn" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>

          {/* ── Grille de cartes ── */}
          <div className="dashboard-grid">

            {/* Informations personnelles */}
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

            {/* Mes rendez-vous (à venir) */}
            <div className="dashboard-card dashboard-card-coming">
              <h2 className="dashboard-card-title">Mes rendez-vous</h2>
              <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
            </div>

            {/* Historique (à venir) */}
            <div className="dashboard-card dashboard-card-coming">
              <h2 className="dashboard-card-title">Historique</h2>
              <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
            </div>

            {/* Favoris (à venir) */}
            <div className="dashboard-card dashboard-card-coming">
              <h2 className="dashboard-card-title">Favoris</h2>
              <p className="dashboard-coming-text">Fonctionnalité bientôt disponible</p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default DashboardClient;
