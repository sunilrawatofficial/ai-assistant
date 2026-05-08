const { documents } = require("../data/documents");
const { cosineSimilarity } = require("../utils/similarity");
const { createEmbeddings, getEmbeddings } = require("../services/embeddingService");
const { SIMILARITY_THRESHOLD } = require("../config/constants");

async function retrieveFromLocal(question) {
  const questionEmbedding = (await createEmbeddings([question]))[0]?.embedding;
  const documentEmbeddings = getEmbeddings();

  if (!questionEmbedding || !documentEmbeddings.length) {
    throw new Error("Embeddings not initialized");
  }

  const rankedDocuments = documents
    .map((text, index) => ({
      text,
      score: documentEmbeddings[index]
        ? cosineSimilarity(questionEmbedding, documentEmbeddings[index])
        : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const bestMatch = rankedDocuments[0];
  if (!bestMatch || bestMatch.score < SIMILARITY_THRESHOLD) {
    return { context: "", found: false };
  }

  return { context: bestMatch.text, found: true };
}

module.exports = { retrieveFromLocal };
