import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import "./CreateCompany.css";

const COMPANY_TYPES = [
  { value: "AUTO_ENTREPRENEUR", label: "Auto-entrepreneur" },
  { value: "ARTISAN", label: "Artisan" },
  { value: "COMMERCANT", label: "Commerçant" },
  { value: "PROFESSION_LIBERALE", label: "Profession libérale" },
  { value: "SOCIETE", label: "Société" },
  { value: "ASSOCIATION", label: "Association" },
];

const INITIAL_FORM = {
  companyName: "",
  siret: "",
  companyType: "",
  phone: "",
  street: "",
  postalCode: "",
  city: "",
  activityName: "",
};

const DRAFT_KEY = "company-draft";

function CreateCompany() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) return { ...INITIAL_FORM, ...JSON.parse(draft) };
    } catch {}
    return INITIAL_FORM;
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth", {
        state: { notice: "Vous devez être connecté avant de créer un compte entreprise." },
      });
      return;
    }
    fetch(`${apiBaseUrl}/api/company/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          navigate("/");
        } else {
          setIsChecking(false);
        }
      })
      .catch(() => setIsChecking(false));
  }, [apiBaseUrl, navigate]);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateStep2() {
    if (!form.companyName.trim()) return "Le nom de l'entreprise est requis.";
    const cleanSiret = form.siret.replace(/\s+/g, "");
    if (!/^\d{14}$/.test(cleanSiret)) return "Le SIRET doit contenir 14 chiffres.";
    if (!form.companyType) return "Choisissez un type d'entreprise.";
    return "";
  }

  function validateStep3() {
    if (!/^\+?\d{9,15}$/.test(form.phone.trim())) return "Numéro de téléphone invalide.";
    if (!form.street.trim()) return "L'adresse est requise.";
    if (!/^\d{5}$/.test(form.postalCode.trim())) return "Le code postal doit contenir 5 chiffres.";
    if (!form.city.trim()) return "La ville est requise.";
    if (!form.activityName.trim()) return "Le nom de l'activité est requis.";
    return "";
  }

  function goNext() {
    const err = step === 2 ? validateStep2() : "";
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep(step + 1);
  }

  function goPrev() {
    setError("");
    setStep(step - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateStep3();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/api/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          siret: form.siret.replace(/\s+/g, ""),
          companyType: form.companyType,
          phone: form.phone.trim(),
          street: form.street.trim(),
          postalCode: form.postalCode.trim(),
          city: form.city.trim(),
          activityName: form.activityName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de créer l'entreprise.");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem(DRAFT_KEY);
      navigate("/");
    } catch (submitErr) {
      setError(submitErr.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isChecking) {
    return (
      <>
        <Header />
        <main className="create-company-main">
          <p className="create-company-loading">Chargement...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="create-company-main">
        <div className="create-company-card">
          <div className="create-company-logo">
            <img src={logo} alt="MyRDV" />
          </div>

          <div className="stepper">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`stepper-dot ${step === n ? "active" : ""} ${step > n ? "done" : ""}`}
              >
                {n}
              </div>
            ))}
          </div>
          <p className="stepper-label">Étape {step} sur 3</p>

          {step === 1 && (
            <div className="step-intro">
              <h1>Créer votre compte professionnel</h1>
              <p className="create-company-subtitle">
                En quelques minutes, configurez l'espace de votre entreprise.
              </p>
              <ol className="intro-list">
                <li>Informations légales — nom, SIRET, type</li>
                <li>Coordonnées et activité — téléphone, adresse, service</li>
                <li>Validation — on crée votre entreprise</li>
              </ol>
              <div className="step-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Retour à l'accueil
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(2)}
                >
                  Commencer
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form
              className="create-company-form"
              onSubmit={(e) => {
                e.preventDefault();
                goNext();
              }}
            >
              <h2>Informations légales</h2>
              <div className="form-group">
                <label htmlFor="companyName">Nom de l'entreprise</label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Ex: Boulangerie Dupont"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="siret">SIRET</label>
                <input
                  id="siret"
                  name="siret"
                  type="text"
                  placeholder="14 chiffres"
                  value={form.siret}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="companyType">Type d'entreprise</label>
                <select
                  id="companyType"
                  name="companyType"
                  value={form.companyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir un type</option>
                  {COMPANY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="create-company-error">{error}</p>}
              <div className="step-actions">
                <button type="button" className="btn-secondary" onClick={goPrev}>
                  Précédent
                </button>
                <button type="submit" className="btn-primary">
                  Suivant
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="create-company-form" onSubmit={handleSubmit}>
              <h2>Coordonnées et activité</h2>
              <div className="form-group">
                <label htmlFor="phone">Téléphone professionnel</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="street">Adresse (rue et numéro)</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  placeholder="12 rue des Lilas"
                  value={form.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Code postal</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    placeholder="75001"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Ville</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Paris"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="activityName">Nom de l'activité / service</label>
                <input
                  id="activityName"
                  name="activityName"
                  type="text"
                  placeholder="Ex: Coiffure, Plomberie, Massage"
                  value={form.activityName}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="create-company-error">{error}</p>}
              <div className="step-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={goPrev}
                  disabled={isSubmitting}
                >
                  Précédent
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Création..." : "Créer mon entreprise"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CreateCompany;
