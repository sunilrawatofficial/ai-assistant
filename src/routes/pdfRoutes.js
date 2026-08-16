const express = require("express");
const uploadMiddleware = require("../middleware/multer");
const { uploadPdf } = require("../controllers/pdfController");

const router = express.Router();

router.get("/check-direct", (req, res) =>{
  return res.redirect(301, "https://www.linkedin.com/in/sunil-rawat-0059861ab/");
});

router.post("/upload", uploadMiddleware.single("file"), uploadPdf);

module.exports = router;