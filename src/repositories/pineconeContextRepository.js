const { pineconeIndex } = require("../config/pinecone");
const { PINECONE_NAMESPACE, SIMILARITY_THRESHOLD } = require("../config/constants");

async function retrieveFromPinecone(questionEmbedding) {

  if (!questionEmbedding) {
    throw new Error("Failed to generate embedding for question");
  }
  
  const queryResult = await pineconeIndex.query({
    vector: questionEmbedding,
    topK: 5,
    includeMetadata: true,
    namespace: PINECONE_NAMESPACE,
  });

  // Get all relevant matches instead of only first match
  const relevantMatches = queryResult?.matches?.filter(
    (match) =>
      match.score >= SIMILARITY_THRESHOLD &&
      match?.metadata?.text
  );

  if (!relevantMatches?.length) {
    return { context: "", found: false };
  }

  // Combine multiple contexts
  const context = relevantMatches
    .slice(0, 3)
    .map((match) => match.metadata.text)
    .join("\n\n");

  return { context, found: true };
}

module.exports = { retrieveFromPinecone };
