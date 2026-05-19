const { upsertPDFToPinecone } = require("../services/integrations/pineconeIngestionService");

async function uploadPdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF allowed" });
    }

    const filePath = req.file.path;
    const result = await upsertPDFToPinecone(filePath);

    return res.json({
      message: "PDF uploaded & processed successfully",
      result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { uploadPdf };
