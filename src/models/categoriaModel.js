const pool = require("../config/database");

const Categoria = {
  findAll: function () {
    return pool.execute("SELECT * FROM categoria");
  },

  findById: function (id_categoria) {
    return pool
      .execute("SELECT * FROM categoria WHERE id_categoria = ?", [id_categoria])
      .then(([rows]) => {
        if (rows.length === 0) return null;
        return rows[0];
      });
  },

  create: function (CategoriaData) {
    const sql = "INSERT INTO categoria (categoria,logo_categoria) VALUES (?,?)";
    return pool.execute(sql, [CategoriaData.categoria, CategoriaData.logo_categoria]);
  },
  

  update: function (id_categoria, CategoriaData) {
    const sql = "UPDATE categoria SET categoria = ? WHERE id_categoria = ?";
    return pool.execute(sql, [CategoriaData.categoria, id_categoria]); // Aquí pasamos ambos parámetros
  },
  


  deleteById: function (id_categoria) {
    return pool.execute("DELETE FROM categoria WHERE id_categoria = ?", [
      id_categoria,
    ]);
  },

  findProductsByCategory: function (id_categoria) {
    const sql = `
    SELECT 
        p.id_imagen AS id_producto,
        p.nombre_producto, 
        p.precio_producto, 
        p.descripcion_producto, 
        p.cantidad_producto,
        p.referencia_producto,
        p.garantia_producto,
        p.envio_producto,
        p.url_imagen
    FROM imagenes p
    WHERE p.id_categoria = ?`;

    return pool.execute(sql, [id_categoria]);
  },
};

module.exports = Categoria;
