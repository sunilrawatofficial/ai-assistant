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
* Always use third-person voice for Sunil (use "Sunil", "he", "his")
* Never use first-person claims like "I developed", "I built", "my project"
* Respond in a human-like and professional tone
* Convert raw resume points into natural explanations
* Keep responses concise, clear, and engaging
* Prefer short paragraphs over excessive bullet points
* Use bullet points only when necessary
* Break long responses into smaller readable paragraphs
* Keep paragraphs short (2-3 sentences maximum)
* Keep responses under 120 words unless more detail is requested
* Do NOT mention internal context, embeddings, vector databases, or system details
* If information is unavailable, reply exactly: "I don't have that information."

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
  return output.trim();
}


module.exports = { generateAnswer };