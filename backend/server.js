import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./lib/prisma.js";
import authenticate from "./middleware/authenticate.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";


// Valeurs autorisées pour le type d'entreprise (doit correspondre exactement au frontend)
const COMPANY_TYPES = [
  "AUTO_ENTREPRENEUR",
  "ARTISAN",
  "COMMERCANT",
  "PROFESSION_LIBERALE",
  "SOCIETE",
  "ASSOCIATION",
];

// Charge les variables d'environnement depuis le fichier .env
dotenv.config();

// Vérifie que la clé secrète JWT est bien définie, sinon le serveur refuse de démarrer
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment.");
}

const app = express();
const port = process.env.PORT || 3000;

// ── Middlewares globaux ──
// CORS : autorise les requêtes du frontend (origin défini dans .env)
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,    // autorise l'envoi de cookies cross-origin
}));
app.use(helmet());    // Sécurise les headers HTTP
app.use(cookieParser()); // Parse les cookies (pour jwt dans les cookies plutot que dans le localStorage)
app.use(express.json());   // Parse automatiquement le JSON reçu dans req.body

// ── Route de santé : vérifie que le serveur tourne ──
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// ── Route : Inscription ──
// Crée un nouveau compte utilisateur avec mot de passe chiffré
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Validation : tous les champs sont requis
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un symbole (!, @, #...).",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Vérifie qu'aucun compte n'existe déjà avec le même email ou téléphone
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { phone: normalizedPhone }] },
    });

    if (existingUser) {
      const conflict = existingUser.email === normalizedEmail ? "e-mail" : "numéro de téléphone";
      return res.status(409).json({ message: `Un compte existe deja avec cet ${conflict}.` });
    }

    // Chiffre le mot de passe avant de le sauvegarder (12 = niveau de sécurité)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crée l'utilisateur en base de données
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
      },
      // select : ne renvoie que ces champs au frontend (jamais le mot de passe)
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        companyId: true,
        companyRole: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Compte cree avec succes.",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// ── Route : Connexion ──
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
  max: 10,                   // max 10 tentatives par IP
  message: { message: "Trop de tentatives. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Vérifie les identifiants et renvoie un token JWT valable 7 jours
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Cherche l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Message volontairement vague pour ne pas indiquer si l'email existe ou non (sécurité)
    if (!user) {
      return res.status(401).json({ message: "Identifiants ou mot de passe incorrects." });
    }

    // Compare le mot de passe tapé avec le hash stocké en base
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants ou mot de passe incorrects." });
    }

    // Crée le token JWT avec l'ID utilisateur et l'ID entreprise (null si pas encore créée)
    const token = jwt.sign(
      { id: user.id, companyId: user.companyId ?? null },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.cookie("token", token, {
      httpOnly: true,                          // invisible au JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS en prod, HTTP en dev
      sameSite: "strict",                      // protection CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 jours en millisecondes
    });

    return res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyId: user.companyId ?? null,
        companyRole: user.companyRole ?? null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// ── Route : Déconnexion ──
// Efface le cookie côté navigateur
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Déconnecté." });
});

// ── Route : Récupérer l'entreprise de l'utilisateur connecté ──
// "authenticate" vérifie le token avant d'exécuter la route
app.get("/api/company/me", authenticate, async (req, res) => {
  try {
    // req.user.id est injecté par le middleware authenticate
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { company: true }, // Charge aussi les données de l'entreprise liée
    });
    return res.status(200).json(user?.company ?? null); // Renvoie null si pas d'entreprise
  } catch (error) {
    console.error("GET /api/company/me error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// ── Route : Créer une entreprise ──
// Crée l'entreprise et met à jour le rôle de l'utilisateur à OWNER
app.post("/api/company", authenticate, async (req, res) => {
  try {
    const {
      companyName,
      siret,
      companyType,
      phone,
      street,
      postalCode,
      city,
      activityName,
    } = req.body;

    // Nettoyage des données reçues
    const name = (companyName || "").trim();
    const normalizedSiret = (siret || "").replace(/\s+/g, "");
    const normalizedPhone = (phone || "").trim();
    const normalizedStreet = (street || "").trim();
    const normalizedPostalCode = (postalCode || "").trim();
    const normalizedCity = (city || "").trim();
    const normalizedActivity = (activityName || "").trim();

    // ── Validations ──
    if (
      !name ||
      !normalizedSiret ||
      !companyType ||
      !normalizedPhone ||
      !normalizedStreet ||
      !normalizedPostalCode ||
      !normalizedCity ||
      !normalizedActivity
    ) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }
    if (name.length > 150) {
      return res.status(400).json({ message: "Le nom de l'entreprise est trop long." });
    }
    if (!/^\d{14}$/.test(normalizedSiret)) {
      return res.status(400).json({ message: "Le SIRET doit contenir 14 chiffres." });
    }
    if (!COMPANY_TYPES.includes(companyType)) {
      return res.status(400).json({ message: "Type d'entreprise invalide." });
    }
    if (!/^\+?\d{9,15}$/.test(normalizedPhone)) {
      return res.status(400).json({ message: "Numéro de téléphone invalide." });
    }
    if (normalizedStreet.length > 200) {
      return res.status(400).json({ message: "Adresse trop longue." });
    }
    if (!/^\d{5}$/.test(normalizedPostalCode)) {
      return res.status(400).json({ message: "Le code postal doit contenir 5 chiffres." });
    }
    if (normalizedCity.length > 100) {
      return res.status(400).json({ message: "Nom de ville trop long." });
    }
    if (normalizedActivity.length > 150) {
      return res.status(400).json({ message: "Nom d'activité trop long." });
    }

    // Vérifie que l'utilisateur existe et n'a pas déjà une entreprise
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
    if (user.companyId) {
      return res.status(409).json({ message: "Vous avez déjà une entreprise." });
    }

    // Vérifie qu'aucune autre entreprise n'utilise déjà ce SIRET ou ce téléphone
    const conflict = await prisma.company.findFirst({
      where: { OR: [{ siret: normalizedSiret }, { phone: normalizedPhone }] },
    });
    if (conflict) {
      const field = conflict.siret === normalizedSiret ? "SIRET" : "numéro de téléphone";
      return res.status(409).json({ message: `Ce ${field} est déjà utilisé.` });
    }

    // Crée l'entreprise ET met à jour l'utilisateur en une seule opération (transaction implicite)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        companyRole: "OWNER", // L'utilisateur qui crée l'entreprise en devient automatiquement OWNER
        company: {
          create: {
            name,
            siret: normalizedSiret,
            companyType,
            phone: normalizedPhone,
            street: normalizedStreet,
            postalCode: normalizedPostalCode,
            city: normalizedCity,
            activityName: normalizedActivity,
          },
        },
      },
      include: { company: true },
    });

    // Génère un nouveau token qui inclut maintenant le companyId
    const token = jwt.sign(
      { id: updatedUser.id, companyId: updatedUser.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      company: updatedUser.company,
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        companyRole: updatedUser.companyRole,
        companyId: updatedUser.companyId,
      },
    });
  } catch (error) {
    console.error("POST /api/company error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

// Démarre le serveur et écoute les requêtes sur le port défini
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
