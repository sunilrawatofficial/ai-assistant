const openai = require("../config/openai");
const { CHAT_MODEL } = require("../config/constants");

const DEFAULT_PROMPT = `You are a helpful assistant.
  - Answer using ONLY the provided context
  - Format the answer clearly using bullet points or short sections
  - If the answer is a single value → return a clean sentence (no bullets)
  - Keep it concise and readable
  `;

async function generateAnswer({ question, context, systemPrompt }) {
  const response = await openai.responses.create({
    model: CHAT_MODEL,
    input: [
      {
        role: "system",
        content: systemPrompt || DEFAULT_PROMPT
      },
      {
        role: "user",
        content: context
          ? `Context:\n${context}\n\nQuestion: ${question}`
          : `Question: ${question}`
      }
    ]
  });

  // safer extraction
  const output = response.output?.[0]?.content?.[0]?.text || "No response generated";

  return output;
}


module.exports = { generateAnswer };