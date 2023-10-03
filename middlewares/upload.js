const multer = require("multer");
const path = require("path");

const tmpDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
    destination: tmpDir,
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: multerConfig
})

module.exports = upload;