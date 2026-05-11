const { retrieveFromLocal } = require("../../repositories/localContextRepository");
const { retrieveFromPinecone } = require("../../repositories/pineconeContextRepository");

async function retrieveContext(question) {
  if (process.env.USE_PINECONE === "true") {
    return retrieveFromPinecone(question);
  }

  return retrieveFromLocal(question);
}

module.exports = { retrieveContext };
