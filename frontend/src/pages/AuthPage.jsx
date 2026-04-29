import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import "./AuthPage.css";

function AuthPage() {
  const location = useLocation();
  const notice = location.state?.notice;
  const [isLogin, setIsLogin] = useState(true);
  const [animClass, setAnimClass] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginIsSubmitting, setLoginIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  function flip(toLogin) {
    if (animClass) return;
    setAnimClass("flip-out");
    setTimeout(() => {
      setIsLogin(toLogin);
      setError("");
      setSuccess("");
      setAnimClass("flip-in");
      setTimeout(() => setAnimClass(""), 300);
    }, 250);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoginError("");
    setLoginIsSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Connexion impossible.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginIsSubmitting(false);
    }
  }

  function handleRegisterChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Le numéro de téléphone est requis.");
      return;
    }
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de créer le compte.");
      setSuccess("Compte créé avec succès. Redirection...");
      setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
      setTimeout(() => flip(true), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className={`auth-card ${animClass}`}>
          <div className="auth-logo">
            <img src={logo} alt="MyRDV" />
          </div>

          {notice && <p className="auth-notice">{notice}</p>}

          {isLogin ? (
            <>
              <h1>Connexion</h1>
              <p className="auth-subtitle">Accédez à votre espace personnel</p>
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email">Adresse e-mail</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="login-password">Mot de passe</label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Mot de passe"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="form-forgot">
                  <Link to="#">Mot de passe oublié ?</Link>
                </div>
                {loginError && <p className="auth-error">{loginError}</p>}
                <button type="submit" className="auth-btn" disabled={loginIsSubmitting}>
                  {loginIsSubmitting ? "Connexion..." : "Se connecter"}
                </button>
              </form>
              <p className="auth-footer">
                Pas encore de compte ?{" "}
                <button className="auth-toggle-btn" onClick={() => flip(false)}>
                  Créer un compte
                </button>
              </p>
            </>
          ) : (
            <>
              <h1>Créer un compte</h1>
              <p className="auth-subtitle">Rejoignez RD'vous gratuitement</p>
              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                
                  <div className="form-group">
                    <label htmlFor="firstName">Prénom</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Prénom"
                      value={form.firstName}
                      onChange={handleRegisterChange}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Nom</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Nom"
                      value={form.lastName}
                      onChange={handleRegisterChange}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                
                <div className="form-group">
                  <label htmlFor="reg-email">Adresse e-mail</label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={form.email}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={form.phone}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="tel"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-password">Mot de passe</label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={form.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}
                <button type="submit" className="auth-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "S'inscrire"}
                </button>
              </form>
              <p className="auth-footer">
                Déjà un compte ?{" "}
                <button className="auth-toggle-btn" onClick={() => flip(true)}>
                  Se connecter
                </button>
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AuthPage;
