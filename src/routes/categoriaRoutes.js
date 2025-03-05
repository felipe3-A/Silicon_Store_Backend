const express = require("express");
const router = express.Router();
const CategoriaController = require("../controller/categoriaController");

router.post("/categoria_upload",CategoriaController.uploadImage, CategoriaController.crearCategoria);
router.get("/categoria_upload", CategoriaController.listarCategorias);
router.put("/categoria_upload/:id_categoria", CategoriaController.editarCategoria);
router.delete("/categoria_upload/:id", CategoriaController.eliminarCategoria);
//LISTAR CATEGORIAS Y PRODUCTOS
router.get("/productos_por_categoria/:id_categoria", CategoriaController.listarProductosPorCategoria);
module.exports = router;
