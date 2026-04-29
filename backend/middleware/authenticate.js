import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant." });
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = { id: payload.id, companyId: payload.companyId ?? null };
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalide." });
  }
}
