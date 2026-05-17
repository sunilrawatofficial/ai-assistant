const openai = require("../../config/openai");

const { CHAT_MODEL, EMBEDDING_MODEL } = require("../../config/constants");
let docEmbeddings = [];

function buildChatRequest({ messages, tools, stream = false }) {
   return {
     model: CHAT_MODEL,
     messages,
     tools,
     temperature: 0,
     stream,
   };
}

async function createEmbeddings(customDocuments) {
  try {
    const res = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: customDocuments,
    });

    docEmbeddings = res.data.map((d) => d.embedding);
    return res.data;
  } catch (err) {
    console.error("❌ Embedding error:", err.message);
    throw err;
  }
}

function getEmbeddings() {
  return docEmbeddings;
}

async function generateChatCompletion({ messages, tools }) {
  const response = await openai.chat.completions.create(
   buildChatRequest({ messages, tools })
  );
  return response.choices[0].message;
} 

async function* streamChatCompletion({ messages, tools }) {
  const streamResponse = await openai.chat.completions.create(
   buildChatRequest({ messages, tools, stream: true })
  );

  for await (const chunk of streamResponse) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) {
      yield text;
    }
  }
}

module.exports = {
  generateChatCompletion,
  createEmbeddings,
  getEmbeddings,
  streamChatCompletion,
};
