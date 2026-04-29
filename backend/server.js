import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./lib/prisma.js";

const COMPANY_TYPES = [
  "AUTO_ENTREPRENEUR",
  "ARTISAN",
  "COMMERCANT",
  "PROFESSION_LIBERALE",
  "SOCIETE",
  "ASSOCIATION",
];
import authenticate from "./middleware/authenticate.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment.");
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { phone: normalizedPhone }] },
    });

    if (existingUser) {
      const conflict = existingUser.email === normalizedEmail ? "e-mail" : "numéro de téléphone";
      return res.status(409).json({ message: `Un compte existe deja avec cet ${conflict}.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
      },
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

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ message: "Identifiants ou mot de passe incorrects." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants ou mot de passe incorrects." });
    }

    const token = jwt.sign(
      { id: user.id, companyId: user.companyId ?? null },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
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

app.get("/api/company/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { company: true },
    });
    return res.status(200).json(user?.company ?? null);
  } catch (error) {
    console.error("GET /api/company/me error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

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

    const name = (companyName || "").trim();
    const normalizedSiret = (siret || "").replace(/\s+/g, "");
    const normalizedPhone = (phone || "").trim();
    const normalizedStreet = (street || "").trim();
    const normalizedPostalCode = (postalCode || "").trim();
    const normalizedCity = (city || "").trim();
    const normalizedActivity = (activityName || "").trim();

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

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
    if (user.companyId) {
      return res.status(409).json({ message: "Vous avez déjà une entreprise." });
    }

    const conflict = await prisma.company.findFirst({
      where: { OR: [{ siret: normalizedSiret }, { phone: normalizedPhone }] },
    });
    if (conflict) {
      const field = conflict.siret === normalizedSiret ? "SIRET" : "numéro de téléphone";
      return res.status(409).json({ message: `Ce ${field} est déjà utilisé.` });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        companyRole: "OWNER",
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

    const token = jwt.sign(
      { id: updatedUser.id, companyId: updatedUser.companyId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

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
      token,
    });
  } catch (error) {
    console.error("POST /api/company error:", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
