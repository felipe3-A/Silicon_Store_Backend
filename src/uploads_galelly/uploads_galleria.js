const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storageGallery = multer.diskStorage({
  destination: path.join(__dirname, '../images_gallery'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const uploadGalleria = multer({
  storage: storageGallery,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  },
}).array("url_imagenes",5);

module.exports = uploadGalleria;
