// middlewares/auth.js
import jwt from "jsonwebtoken";

/**
 * Vérifie le JWT présent dans Authorization: Bearer <token>
 * Attache { id, role } à req.user
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token invalide" });
  }
}

/** Autorise si le rôle du user ∈ roles */
export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès interdit" });
    }
    next();
  };
}
