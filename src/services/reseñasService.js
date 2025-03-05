const Reseña = require("../models/reseñasModel");

const agregarReseña = async (id_usuario, id_producto, comentario, puntuacion) => {
  await Reseña.agregarReseña(id_usuario, id_producto, comentario, puntuacion);
  await Reseña.actualizarPromedioPuntuacion(id_producto);
  return { message: "Reseña agregada correctamente" };
};

const obtenerReseñasPorProducto = async (id_producto) => {
  const [reseñas] = await Reseña.obtenerReseñasPorProducto(id_producto);
  return reseñas;
};

module.exports = {
  agregarReseña,
  obtenerReseñasPorProducto,
};
