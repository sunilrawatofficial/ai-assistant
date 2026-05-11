const openai = require("../config/openai");

const { CHAT_MODEL } = require("../config/constants");

async function generateChatCompletion({ messages, tools }) {
   const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      tools,
   });
   return response.choices[0].message;
}

module.exports = { generateChatCompletion };
