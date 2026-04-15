const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const products = require("../data/products");
const { success, error } = require("../utils/responses");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  return success(res, 200, products);
});

router.post("/", authMiddleware, (req, res) => {
  const {
    nombre,
    descripcion,
    subcategoria,
    precio,
    precioxcantidad,
    estado
  } = req.body;

  if (
    !nombre ||
    !descripcion ||
    !subcategoria ||
    precio == null ||
    precioxcantidad == null ||
    !estado
  ) {
    return error(res, 400, "BAD_REQUEST", "Todos los campos son obligatorios");
  }

  if (precio <= 0 || precioxcantidad <= 0) {
    return error(res, 400, "BAD_REQUEST", "Los precios deben ser mayores a 0");
  }

  if (estado !== "activo" && estado !== "inactivo") {
    return error(res, 400, "BAD_REQUEST", "Estado inválido");
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    nombre,
    descripcion,
    subcategoria,
    precio,
    precioxcantidad,
    estado
  };

  products.push(newProduct);

  return success(res, 201, newProduct);
});

router.delete("/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return error(res, 404, "NOT_FOUND", "Producto no encontrado");
  }

  const deletedProduct = products.splice(index, 1);

  return success(res, 200, {
    message: "Producto eliminado exitosamente",
    producto: deletedProduct[0]
  });
});

router.put("/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);

  const {
    nombre,
    descripcion,
    subcategoria,
    precio,
    precioxcantidad,
    estado
  } = req.body;

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return error(res, 404, "NOT_FOUND", "Producto no encontrado");
  }

  if (
    !nombre ||
    !descripcion ||
    !subcategoria ||
    precio == null ||
    precioxcantidad == null ||
    !estado
  ) {
    return error(res, 400, "BAD_REQUEST", "Todos los campos son obligatorios");
  }

  if (precio <= 0 || precioxcantidad <= 0) {
    return error(res, 400, "BAD_REQUEST", "Los precios deben ser mayores a 0");
  }

  if (estado !== "activo" && estado !== "inactivo") {
    return error(res, 400, "BAD_REQUEST", "Estado inválido");
  }

  products[index] = {
    id,
    nombre,
    descripcion,
    subcategoria,
    precio,
    precioxcantidad,
    estado
  };

  return success(res, 200, products[index]);
});

module.exports = router;
