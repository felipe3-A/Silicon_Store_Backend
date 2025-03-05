const db = require("../config/database");

const Subcaracteristica = {
  getAll: function () {
    return db.execute("SELECT * FROM subcaracteristica");
  },

  getById: async function (id) {
    try {
      const [result] = await db.execute("SELECT * FROM subcaracteristica WHERE id_subcaracteristica = ?", [id]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  create: function(subCaracteristicaData){
    const sql = "INSERT INTO subcaracteristica(nombre_subcaracteristica, id_caracteristica) VALUES (?,?)";
    return db.execute(sql, [
      subCaracteristicaData.nombre_subcaracteristica,
      subCaracteristicaData.id_caracteristica
    ]);
  }
};

module.exports = Subcaracteristica;
