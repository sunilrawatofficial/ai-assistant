const express = require("express");
const { upsertPDFToPinecone } = require("../services/pineconeService");
const uploadMiddleware = require("../middleware/multer");

const router = express.Router();

router.post("/upload", uploadMiddleware.single("file"), async (req, res) => {

  try {
    // 1. Validate file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF allowed" });
    }
    
    console.log("FILE:", req.file);

    const filePath = req.file.path;
    const result = await upsertPDFToPinecone(filePath);
    res.json({
      message: "PDF uploaded & processed successfully",
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;