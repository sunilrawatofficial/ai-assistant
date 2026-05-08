const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const ragRoutes = require("./routes/ragRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

const { createEmbeddings } = require("./services/embeddingService");
const { upsertDocumentsToPinecone } = require("./services/pineconeService");
const { documents } = require("./data/documents");
const PORT = process.env.PORT || 3001;

app.use("/open-ai", ragRoutes);
app.use("/pdf", pdfRoutes);

async function startServer() {
  try {
    if (process.env.USE_PINECONE === "true") {
      await upsertDocumentsToPinecone(documents);
    } else {
      await createEmbeddings(documents);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error("❌ Unhandled startup error:", error);
  process.exit(1);
});
