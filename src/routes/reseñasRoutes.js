const express = require("express");
const router = express.Router();
const ReseñaController = require("../controller/reseñasController");

router.post("/agregar", ReseñaController.agregarReseña);
router.get("/producto/:id_producto", ReseñaController.obtenerReseñasPorProducto);

module.exports = router;
