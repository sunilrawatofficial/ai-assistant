const { pineconeIndex } = require("../config/pinecone");
const { createEmbeddings } = require("./embeddingService");
const { extractTextFromPDF, chunkText } = require("../utils/pdf");
const { PINECONE_NAMESPACE } = require("../config/constants");


async function upsertDocumentsToPinecone(documents) {
  if (!Array.isArray(documents) || documents.length === 0) {
    console.warn("⚠️ No documents found. Skipping Pinecone upsert.");
    return;
  }

  const embeddings = await createEmbeddings(documents);
  if (!Array.isArray(embeddings) || embeddings.length === 0) {
    throw new Error("No embeddings generated for documents");
  }

  const vectors = embeddings.map((embedding, i) => ({
    id: `doc-${i}`,
    values: embedding.embedding,
    metadata: {
      text: documents[i]
    }
  }));

  console.log("🔄 Creating embeddings + upserting default documents to Pinecone with vector length:", vectors.length);

  await pineconeIndex
    .namespace(PINECONE_NAMESPACE)
    .upsert({ records: vectors });

  console.log("✅ successfully upserted:", vectors.length);
}

async function upsertPDFToPinecone(filePath) {
  console.log("📄 Processing PDF...");

  const text = await extractTextFromPDF(filePath);
  const chunks = chunkText(text);
  console.log("Chunks created:", chunks.length);

  const embeddings = await createEmbeddings(chunks);
  if (!Array.isArray(embeddings) || embeddings.length === 0) {
    throw new Error("No embeddings generated for PDF chunks");
  }
  console.log("Embeddings created:", embeddings.length);

  // 4. Prepare vectors
  const vectors = embeddings.map((embedding, i) => ({
    id: `pdf-${i}`,
    values: embedding.embedding,
    metadata: {
      text: chunks[i]
    }
  }));

  console.log("Vectors created:", vectors.length);

  // 5. Store in Pinecone
  await pineconeIndex
    .namespace(PINECONE_NAMESPACE)
    .upsert({ records: vectors });
  console.log("✅ successfully upserted:", vectors.length);

  return { chunks: chunks.length, upserted: vectors.length };
}

module.exports = { upsertDocumentsToPinecone, upsertPDFToPinecone };
