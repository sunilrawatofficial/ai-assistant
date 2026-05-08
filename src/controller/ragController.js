const openai = require("../config/openai");
const { documents } = require("../data/documents");
const { cosineSimilarity } = require("../utils/similarity");
const { createEmbeddings, getEmbeddings } = require("../services/embeddingService");
const { pineconeIndex } = require("../config/pinecone");
const { generateAnswer } = require("../services/llmService.js");


/**
 * RAG Handler
 */
async function handleRAGPinecone(question) {
  // 1. Embed + query
  const qEmbedding = (await createEmbeddings([question]))[0].embedding;

  const matches = (await pineconeIndex.query({
    vector: qEmbedding,
    topK: 2,
    includeMetadata: true,
    namespace: "portfolio"   // 🔥 THIS IS THE KEY
  })).matches || [];

  // 2. Pick best match
  const strongMatches = matches.find(m => m.score >= 0.6);

  if (!strongMatches) {
    return { answer: "Not in context", context: "" };
  }

  const context = strongMatches.metadata.text;

  // 3. Generate answer
  const answer = await generateAnswer({ question, context });

  return { answer };
}


async function handleRAG(question) {
  // 1. Embed question
  const qEmbedding = (await createEmbeddings([question]))[0].embedding;
  const docEmbeddings = await getEmbeddings();
  // 2. Similarity search
  const scores = documents.map((doc, i) => {
    if (!docEmbeddings[i]) {
      return { text: doc, score: 0 };
    }

    return {
      text: doc,
      score: cosineSimilarity(qEmbedding, docEmbeddings[i])
    };
  });

  scores.sort((a, b) => b.score - a.score);

  console.log("Top matches:", scores.slice(0, 3));

  // 3. Threshold check (important)
  if (scores[0].score < 0.6) {
    return "Not in context";
  }
  // 4. Use ONLY best match (avoid noise)
  const topDoc = scores[0].text;

  // 5. LLM call
  const answer = await generateAnswer({ question, context: topDoc });
  return { answer };
}

/**
 * Structured Output Handler
 */
async function handleAsk(question) {
  const answer = await generateAnswer({ question });
  return { answer };
}

module.exports = { handleRAG, handleAsk, handleRAGPinecone };