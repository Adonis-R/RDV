import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaPackage from "@prisma/client";

const { PrismaClient } = prismaPackage;

// Récupère l'URL de connexion à la base de données depuis les variables d'environnement
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

// Adaptateur PostgreSQL : fait le lien entre Prisma et la base de données
const adapter = new PrismaPg({ connectionString });

// Instance unique de Prisma partagée dans tout le backend (singleton)
// Evite d'ouvrir une nouvelle connexion à chaque requête
const prisma = new PrismaClient({ adapter });

export default prisma;
