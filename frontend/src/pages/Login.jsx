import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: implémenter la logique d'authentification
    console.log("Connexion avec :", email);
  }

  return (
    <>
      <Header />
      <main className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img src={logo} alt="MyRDV" />
          </div>
          <h1>Connexion</h1>
          <p className="subtitle">Accédez à votre espace personnel</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-forgot">
              <Link to="#">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" className="btn-login">
              Se connecter
            </button>
          </form>

          <p className="login-footer">
            Pas encore de compte ?{" "}
            <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
