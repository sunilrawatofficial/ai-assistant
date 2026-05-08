const { retrieveFromLocal } = require("../repositories/localRetriever");
const { retrieveFromPinecone } = require("../repositories/pineconeRetriever");

async function retrieveContext(question) {
  if (process.env.USE_PINECONE === "true") {
    return retrieveFromPinecone(question);
  }

  return retrieveFromLocal(question);
}

module.exports = { retrieveContext };
