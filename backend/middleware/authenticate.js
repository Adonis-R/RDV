import jwt from "jsonwebtoken";

// Middleware de protection des routes : vérifie que l'utilisateur est bien connecté
// S'utilise en ajoutant "authenticate" entre l'URL et la fonction de la route dans server.js
export default function authenticate(req, res, next) {
  const header = req.headers.authorization;

  // Le token doit être envoyé dans le header sous la forme : "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    // Vérifie la signature du token avec la clé secrète et extrait les données
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);

    // Ajoute les infos de l'utilisateur à la requête pour que la route puisse les utiliser
    req.user = { id: payload.id, companyId: payload.companyId ?? null };

    return next(); // Token valide → continue vers la route
  } catch {
    // Token expiré, falsifié ou invalide
    return res.status(401).json({ message: "Token invalide." });
  }
}
