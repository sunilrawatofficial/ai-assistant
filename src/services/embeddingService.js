const openai = require("../config/openai");
const { EMBEDDING_MODEL } = require("../config/constants");
let docEmbeddings = [];

async function createEmbeddings(customDocuments) {
  try {
    const res = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: customDocuments,
    });

    docEmbeddings = res.data.map(d => d.embedding);
    return res.data

  } catch (err) {
    console.error("❌ Embedding error:", err.message);
    throw err;
  }
}

function getEmbeddings() {
  return docEmbeddings;
}

module.exports = {
  createEmbeddings,
  getEmbeddings
};