const pool = require("../config/database");

const Reseña = {
  agregarReseña: function (id_usuario, id_producto, comentario, puntuacion) {
    const sql = `INSERT INTO reseñas (id_usuario, id_producto, comentario, puntuacion) 
                 VALUES (?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE comentario = VALUES(comentario), puntuacion = VALUES(puntuacion)`;
    return pool.execute(sql, [id_usuario, id_producto, comentario, puntuacion]);
  },

  obtenerReseñasPorProducto: function (id_producto) {
    return pool.execute(
      `SELECT r.*, u.nombre FROM reseñas r 
       JOIN usuarios u ON r.id_usuario = u.id 
       WHERE r.id_producto = ? ORDER BY r.fecha DESC`,
      [id_producto]
    );
  },

  calcularPromedioPuntuacion: function (id_producto) {
    return pool.execute(
      `SELECT COALESCE(AVG(puntuacion), 0) AS promedio FROM reseñas WHERE id_producto = ?`,
      [id_producto]
    );
  },

  actualizarPromedioPuntuacion: async function (id_producto) {
    const [[{ promedio }]] = await this.calcularPromedioPuntuacion(id_producto);
    return pool.execute(
      `UPDATE imagenes SET promedio_puntuacion = ? WHERE id_imagen = ?`,
      [promedio, id_producto]
    );
  },
};

module.exports = Reseña;
