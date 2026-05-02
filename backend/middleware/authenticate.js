import jwt from "jsonwebtoken";

// Middleware de protection des routes : vérifie que l'utilisateur est bien connecté
// Lit le token depuis le cookie "token" (httpOnly)
export default function authenticate(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, companyId: payload.companyId ?? null };
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalide." });
  }
}
