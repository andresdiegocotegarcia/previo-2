const jwt = require("jsonwebtoken");
const { error } = require("../utils/responses");

const JWT_SECRET = "clave_secreta_parcial";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return error(res, 401, "NO_TOKEN", "Token de autenticación requerido");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return error(res, 401, "INVALID_TOKEN", "Formato de token inválido");
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.activo) {
      return error(res, 403, "USER_INACTIVE", "Usuario inactivo, acceso denegado");
    }

    req.user = decoded;

    next();
  } catch (err) {
    return error(res, 401, "TOKEN_INVALID", "Token inválido o expirado");
  }
};

module.exports = authMiddleware;
