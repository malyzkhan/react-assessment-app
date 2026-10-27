
export default function adminAuth(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  const providedKey = req.get("x-admin-api-key");

  if (!adminKey) {
    return res.status(500).json({
      success: false,
      message: "Admin authentication is not configured",
    });
  }

  if (!providedKey || providedKey !== adminKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid admin API key",
    });
  }

  next();
}
