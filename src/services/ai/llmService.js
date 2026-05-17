const openai = require("../../config/openai");

const { CHAT_MODEL, EMBEDDING_MODEL } = require("../../config/constants");
let docEmbeddings = [];

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
   const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      tools,
      temperature: 0
   });
   return response.choices[0].message;
}

module.exports = {
   generateChatCompletion,
   createEmbeddings,
   getEmbeddings,
};
