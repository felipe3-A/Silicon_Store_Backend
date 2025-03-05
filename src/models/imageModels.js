const pool = require("../config/database");

const Imagen = {
  async findById(id_galeria) {
    const sql = `SELECT * FROM galeria WHERE id_galeria = ?`;
    const [rows] = await pool.execute(sql, [id_galeria]);
    return rows; // Esto debe ser un arreglo
  },

  async findByIdImage(id_imagen) {
    const sql = `
        SELECT 
            i.*, 
            c.id_caracteristica,
            c.nombre_caracteristica, 
            s.id_subcaracteristica,
            s.nombre_subcaracteristica,
            s.imagen_subcaracteristica,
            v.valor, 
            v.url_imagen_caracteristica, -- Asegurar que esta columna se incluya
            cat.categoria AS nombre_categoria, 
            cat.logo_categoria, 
            m.marca AS nombre_marca, 
            m.logo_marca,
            gs.url_imagenes_solicitud,
            gs.titulo_galeria,
            g.nombre_grupo,
            g.icono_grupo
        FROM imagenes AS i
        LEFT JOIN valores_caracteristicas AS v ON i.id_imagen = v.id_imagen
        LEFT JOIN subcaracteristica AS s ON v.id_subcaracteristica = s.id_subcaracteristica
        LEFT JOIN caracteristica AS c ON s.id_caracteristica = c.id_caracteristica
        LEFT JOIN categoria AS cat ON i.id_categoria = cat.id_categoria
        LEFT JOIN marca AS m ON i.id_marca = m.id_marca
        LEFT JOIN galeria_solicitud AS gs ON i.id_galeria = gs.id_galeria_solicitud
        LEFT JOIN grupos AS g ON i.id_grupo = g.id_grupo
        WHERE i.id_imagen = ?;
    `;

    const [rows] = await pool.execute(sql, [id_imagen]);

    if (rows.length === 0) {
        return null; // Si no hay resultados, devuelve null
    }

    const imagen = {
        id_imagen: rows[0].id_imagen,
        url_imagen: rows[0].url_imagen,
        nombre_producto: rows[0].nombre_producto,
        precio_producto: rows[0].precio_producto,
        descripcion_producto: rows[0].descripcion_producto,
        cantidad_producto: rows[0].cantidad_producto,
        referencia_producto: rows[0].referencia_producto,
        garantia_producto: rows[0].garantia_producto,
        envio_producto: rows[0].envio_producto,
        estado_producto: rows[0].estado_producto,
        id_categoria: rows[0].id_categoria,
        id_marca: rows[0].id_marca,
        id_galeria: rows[0].id_galeria,
        id_grupo: rows[0].id_grupo,
        nombre_categoria: rows[0].nombre_categoria,
        logo_categoria: rows[0].logo_categoria,
        nombre_marca: rows[0].nombre_marca,
        logo_marca: rows[0].logo_marca,
        titulo_galeria: rows[0].titulo_galeria,
        imagenes_galeria: [...new Set(rows.map(row => row.url_imagenes_solicitud).filter(Boolean))],
        caracteristicas: [],
        nombre_grupo: rows[0].nombre_grupo,
        icono_grupo: rows[0].icono_grupo,
    };

    // Mapeo para agrupar características y subcaracterísticas con sus imágenes
    const caracteristicaMap = new Map();

    rows.forEach(row => {
        if (row.id_caracteristica && row.nombre_caracteristica) {
            if (!caracteristicaMap.has(row.id_caracteristica)) {
                caracteristicaMap.set(row.id_caracteristica, {
                    nombre_caracteristica: row.nombre_caracteristica,
                    subcaracteristicas: [],
                });
            }

            if (row.id_subcaracteristica && row.nombre_subcaracteristica) {
                caracteristicaMap.get(row.id_caracteristica).subcaracteristicas.push({
                    nombre_subcaracteristica: row.nombre_subcaracteristica,
                    valor: row.valor,
                    imagen_subcaracteristica: row.imagen_subcaracteristica,
                    url_imagen_caracteristica: row.url_imagen_caracteristica, // Se agrega esta línea
                });
            }
        }
    });

    // Convertir el Map en un array
    imagen.caracteristicas = Array.from(caracteristicaMap.values());

    return imagen;
},


  getByCategoria: (id_categoria) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM caracteristica WHERE id_categoria = ?",
        [id_categoria],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  },

  AllGallery: function () {
    return pool.execute("SELECT * FROM galeria");
  },

  findAllWithGallery: function () {
    const query = `
          SELECT i.*, g.url_imagenes AS galeria
          FROM imagenes AS i
          LEFT JOIN galeria AS g ON i.id_galeria = g.id_galeria
        `;

    return pool.execute(query);
  },

  findAll: function () {
    return pool.execute("SELECT * FROM imagenes");
  },

  findAllGallery: function () {
    return pool.execute("SELECT * FROM galeria");
  },
  update: async function (id_imagen, ImagenData) {
    // Validar que id_imagen no sea nulo
    if (!id_imagen) {
      throw new Error("ID de imagen es requerido.");
    }

    // Inicializar la consulta SQL y los valores
    let sql = "UPDATE imagenes SET ";
    const values = [];

    // Agregar campos a la consulta solo si están presentes en ImagenData
    if (ImagenData.url_imagen !== undefined) {
      sql += "url_imagen = ?, ";
      values.push(ImagenData.url_imagen);
    }
    if (ImagenData.nombre_producto !== undefined) {
      sql += "nombre_producto = ?, ";
      values.push(ImagenData.nombre_producto);
    }
    if (ImagenData.precio_producto !== undefined) {
      sql += "precio_producto = ?, ";
      values.push(ImagenData.precio_producto);
    }
    if (ImagenData.descripcion_producto !== undefined) {
      sql += "descripcion_producto = ?, ";
      values.push(ImagenData.descripcion_producto);
    }
    if (ImagenData.cantidad_producto !== undefined) {
      sql += "cantidad_producto = ?, ";
      values.push(ImagenData.cantidad_producto);
    }
    if (ImagenData.referencia_producto !== undefined) {
      sql += "referencia_producto = ?, ";
      values.push(ImagenData.referencia_producto);
    }
    if (ImagenData.garantia_producto !== undefined) {
      sql += "garantia_producto = ?, ";
      values.push(ImagenData.garantia_producto);
    }
    if (ImagenData.envio_producto !== undefined) {
      sql += "envio_producto = ?, ";
      values.push(ImagenData.envio_producto);
    }
    if (ImagenData.id_categoria !== undefined) {
      sql += "id_categoria = ?, ";
      values.push(ImagenData.id_categoria);
    }
    if (ImagenData.id_marca !== undefined) {
      sql += "id_marca = ?, ";
      values.push(ImagenData.id_marca);
    }
    if (ImagenData.id_galeria !== undefined) {
      sql += "id_galeria = ?, ";
      values.push(ImagenData.id_galeria);
    }
    if (ImagenData.id_grupo !== undefined) {
      sql += "id_grupo = ?, ";
      values.push(ImagenData.id_grupo);
    }
    if (ImagenData.estado_producto !== undefined) {
      sql += "estado_producto = ?, ";
      values.push(ImagenData.estado_producto);
    }

    // Eliminar la última coma y espacio
    sql = sql.slice(0, -2); // Eliminar la última coma y espacio
    sql += " WHERE id_imagen = ?"; // Agregar la cláusula WHERE
    values.push(id_imagen); // Agregar el id_imagen al final de los valores

    try {
      const [result] = await pool.execute(sql, values);
      return result; // Devuelve el resultado de la operación
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
      throw new Error("No se pudo actualizar la imagen."); // Lanza un error si algo falla
    }
  },

  createWithGallery: function (imagenData) {
    const query = `
          INSERT INTO imagenes (
            nombre_producto,
            precio_producto,
            descripcion_producto,
            cantidad_producto,
            referencia_producto,
            garantia_producto,
            envio_producto,
            id_categoria,
            id_marca,
            url_imagen,
            id_galeria,
            id_grupo
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
        `;
    const values = [
      imagenData.nombre_producto || null,
      imagenData.precio_producto || null,
      imagenData.descripcion_producto || null,
      imagenData.cantidad_producto || null,
      imagenData.referencia_producto || null,
      imagenData.garantia_producto || null,
      imagenData.envio_producto || null,
      imagenData.id_categoria || null,
      imagenData.id_marca || null,
      imagenData.url_imagen || null,
      imagenData.id_galeria || null,
      imagenData.id_grupo || null,
    ];
    return pool.execute(query, values);
  },

  deleteById: function (id_imagen) {
    return pool.execute("DELETE FROM imagenes WHERE id_imagen = ?", [
      id_imagen,
    ]);
  },
};
module.exports = Imagen;
