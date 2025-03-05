const ReseñaService = require("../services/reseñasService");

exports.agregarReseña = async (req, res) => {
  try {
    const { id_usuario, id_producto, comentario, puntuacion } = req.body;

    if (!id_usuario || !id_producto || puntuacion === undefined) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const response = await ReseñaService.agregarReseña(id_usuario, id_producto, comentario, puntuacion);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la reseña", error: error.message });
  }
};

exports.obtenerReseñasPorProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const reseñas = await ReseñaService.obtenerReseñasPorProducto(id_producto);

    if (!reseñas.length) {
      return res.status(404).json({ message: "No hay reseñas para este producto" });
    }

    res.status(200).json({ message: "Reseñas obtenidas", data: reseñas });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reseñas", error: error.message });
  }
};
