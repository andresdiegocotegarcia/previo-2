const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../data/users");
const { success, error } = require("../utils/responses");

const router = express.Router();

const JWT_SECRET = "clave_secreta_parcial";

router.post("/", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return error(res, 400, "BAD_REQUEST", "Usuario y contraseña son obligatorios");
  }

  const user = users.find(
    u => u.usuario === usuario && u.password === password
  );

  if (!user) {
    return error(res, 401, "INVALID_CREDENTIALS", "Usuario o contraseña incorrectos");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      usuario: user.usuario,
      activo: user.activo
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return success(res, 200, {
    access_token: token,
    token_type: "Bearer",
    expires_in: 3600
  });
});

module.exports = router;
