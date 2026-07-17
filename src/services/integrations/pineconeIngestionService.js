const { pineconeIndex } = require("../../config/pinecone");
const { createEmbeddings } = require("../ai/llmService");
const { extractTextFromPDF, chunkText } = require("../../utils/pdf");
const { PINECONE_NAMESPACE } = require("../../config/constants");


async function upsertDocumentsToPinecone(documents) {
  if (!Array.isArray(documents) || documents.length === 0) {
    console.warn("⚠️ [pineconeIngestionService.upsertDocumentsToPinecone] no documents found, skipping upsert");
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

  console.log("ℹ️ [pineconeIngestionService.upsertDocumentsToPinecone] upserting default documents to Pinecone, vector count:", vectors.length);

  await pineconeIndex
    .namespace(PINECONE_NAMESPACE)
    .upsert({ records: vectors });

  console.log("✅ [pineconeIngestionService.upsertDocumentsToPinecone] successfully upserted:", vectors.length);
}

async function upsertPDFToPinecone(filePath) {
  console.log("ℹ️ [pineconeIngestionService.upsertPDFToPinecone] processing PDF");

  const text = await extractTextFromPDF(filePath);
  console.log("ℹ️ [pineconeIngestionService.upsertPDFToPinecone] extracted text length:", text.length);
  const chunks = chunkText(text);
  console.log("ℹ️ [pineconeIngestionService.upsertPDFToPinecone] chunks created:", chunks.length);

  const embeddings = await createEmbeddings(chunks);
  if (!Array.isArray(embeddings) || embeddings.length === 0) {
    throw new Error("No embeddings generated for PDF chunks");
  }

  // 4. Prepare vectors
  const vectors = embeddings.map((embedding, i) => ({
    id: `pdf-${i}`,
    values: embedding.embedding,
    metadata: {
      text: chunks[i]
    }
  }));

  console.log("ℹ️ [pineconeIngestionService.upsertPDFToPinecone] vectors created:", vectors.length);

  // 5. Store in Pinecone
  await pineconeIndex
    .namespace(PINECONE_NAMESPACE)
    .upsert({ records: vectors });
  console.log("✅ [pineconeIngestionService.upsertPDFToPinecone] successfully upserted:", vectors.length);

  return { chunks: chunks.length, upserted: vectors.length };
}

module.exports = { upsertDocumentsToPinecone, upsertPDFToPinecone };
