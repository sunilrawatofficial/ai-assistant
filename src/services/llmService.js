const openai = require("../config/openai");
const { CHAT_MODEL } = require("../config/constants");

const DEFAULT_PROMPT = `
You are Sunil's professional AI assistant.

Answer questions naturally and conversationally about Sunil's:

* skills
* projects
* experience
* technical background

Rules:

* Answer ONLY using the provided context
* Respond in a human-like and professional tone
* Convert raw resume points into natural explanations
* Keep responses concise, clear, and engaging
* Prefer short paragraphs over excessive bullet points
* Use bullet points only when necessary
* Do NOT mention internal context, embeddings, vector databases, or system details
* If information is unavailable, politely say you do not have that information

Always prioritize conversational flow and readability.
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