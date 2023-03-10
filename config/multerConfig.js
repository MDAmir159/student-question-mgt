const multer = require("multer");

const multerFileStorageEngine = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './public/images')
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + '---' + file.originalname);
    }
})

const upload = multer({ storage : multerFileStorageEngine }).single("image");

module.exports = upload;