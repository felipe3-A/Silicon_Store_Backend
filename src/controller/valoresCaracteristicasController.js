// controllers/valoresCaracteristicaController.js
const valoresCaracteristicaService = require("../services/valoresCaracteristicas");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ImagenService = require("../services/imagenService");
const SubModel = require("../models/subCaracteristica")

// Crear carpeta si no existe
const imagePathCaracteristica = path.join(
  __dirname,
  "../../images_caracteristica"
);
if (!fs.existsSync(imagePathCaracteristica)) {
  fs.mkdirSync(imagePathCaracteristica, { recursive: true });
}

// Configuración de almacenamiento de imágenes
const storageGalleryCaracteristica = multer.diskStorage({
  destination: imagePathCaracteristica,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadGalleriaCaracteristica = multer({
  storage: storageGalleryCaracteristica,
});

const controller = {};

controller.uploadImageCaracteristica = uploadGalleriaCaracteristica.single(
  "url_imagen_caracteristica"
);

controller.getAllValoresCaracteristicas = async (req, res) => {
  try {
    const valores = await valoresCaracteristicaService.getAllValoresCaracteristicas();
    if (!valores || valores.length === 0) {
      return res.status(404).json({ message: "No se encontraron datos" });
    }
    res.status(200).json({
      message: "Datos encontrados",
      data: valores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "No se pudo listar los valores de características",
      error: error.message,
    });
  }
};


controller.getValoresByProducto = (req, res) => {
  const { id_imagen } = req.params;
  valoresCaracteristicaService.getByProducto(id_imagen, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

controller.createValorCaracteristica = async (req, res) => {
  try {
    console.log("Datos recibidos en req.body:", req.body);
    
    const { id_imagen, id_subcaracteristica, valor } = req.body;

    if (!id_imagen || !id_subcaracteristica || !valor) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    const producto = await ImagenService.listImagesById(id_imagen);
    if (!producto || producto.length === 0) {
      return res.status(404).json({ error: `El producto con ID ${id_imagen} no existe.` });
    }

    const sub =  SubModel.getById(id_subcaracteristica);
    if (!sub || sub.length === 0) {
      return res.status(404).json({ error: `La subcaracterística con ID ${id_subcaracteristica} no existe.` });
    }


    const url_imagen_caracteristica = req.file
      ? `http://localhost:3000/uploads_caracteristica/${req.file.filename}`
      : null;

    if (!req.file) {
      return res.status(400).json({ message: "La imagen es requerida." });
    }
    const nuevoValorCaracteristica = {
      id_imagen,
      id_subcaracteristica,
      valor,
      url_imagen_caracteristica
    };

    const result = await valoresCaracteristicaService.createValorCaracteristica(nuevoValorCaracteristica);
    
    res.status(201).json({
      message: "Valor de característica creado exitosamente",
      data: { id: result.insertId, ...nuevoValorCaracteristica },
    });

  } catch (error) {
    console.error("Error al crear el valor de característica:", error);
    res.status(500).json({
      message: "Error al crear el valor de característica",
      error: error.message,
    });
  }
};


module.exports =  controller