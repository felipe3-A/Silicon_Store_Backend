const db = require("../config/database");

const Caracteristica = {
  getAll: function () {
    return db.execute("SELECT * FROM caracteristica");
  },
  getById: (id) => {
    db.query("SELECT * FROM caracteristica WHERE id_caracteristica = ?", [id]);
  },
  create: (nombre) => {
    db.query("INSERT INTO caracteristica (nombre_caracteristica) VALUES (?)", 
    [nombre]);
  },
    // Nueva función para obtener características por categoría
    getByCategoria: (id_categoria, callback) => {
      db.query("SELECT * FROM caracteristica WHERE id_categoria = ?", [id_categoria], callback);
    },

     // Nueva función para obtener características por categoría
  getByCategoria: (id_categoria, callback) => {
    db.query("SELECT * FROM caracteristica WHERE id_categoria = ?", [id_categoria], callback);
  },
};

module.exports = Caracteristica;
