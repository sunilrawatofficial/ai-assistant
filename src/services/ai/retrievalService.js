const { retrieveFromLocal } = require("../../repositories/localContextRepository");
const { retrieveFromPinecone } = require("../../repositories/pineconeContextRepository");
const { createEmbeddings, getEmbeddings } = require("./llmService");

async function retrieveContext(question) {
  const questionEmbedding = (await createEmbeddings([question]))[0]?.embedding;

  if (process.env.USE_PINECONE === "true") {
    return retrieveFromPinecone(questionEmbedding);
  }

  const documentEmbeddings = getEmbeddings();
  return retrieveFromLocal(questionEmbedding, documentEmbeddings);
}

module.exports = { retrieveContext };
