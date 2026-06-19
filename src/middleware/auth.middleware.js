import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication token missing. You must log in before creating or modifying posts.",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default authenticate;
