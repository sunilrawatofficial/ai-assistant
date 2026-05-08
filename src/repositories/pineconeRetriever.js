const { pineconeIndex } = require("../config/pinecone");
const { createEmbeddings } = require("../services/embeddingService");
const {
  PINECONE_NAMESPACE,
  SIMILARITY_THRESHOLD,
} = require("../config/constants");

async function retrieveFromPinecone(question) {
  const questionEmbedding = (await createEmbeddings([question]))[0]?.embedding;
  if (!questionEmbedding) {
    throw new Error("Failed to generate embedding for question");
  }

  const queryResult = await pineconeIndex.query({
    vector: questionEmbedding,
    topK: 2,
    includeMetadata: true,
    namespace: PINECONE_NAMESPACE,
  });

  const bestMatch = queryResult?.matches?.find(
    (match) => match.score >= SIMILARITY_THRESHOLD
  );

  if (!bestMatch) {
    return { context: "", found: false };
  }

  return { context: bestMatch?.metadata?.text || "", found: true };
}

module.exports = { retrieveFromPinecone };
