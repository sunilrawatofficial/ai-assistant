const express = require("express");
const uploadMiddleware = require("../middleware/multer");
const { uploadPdf } = require("../controllers/pdfController");

const router = express.Router();

router.post("/upload", uploadMiddleware.single("file"), uploadPdf);

module.exports = router;