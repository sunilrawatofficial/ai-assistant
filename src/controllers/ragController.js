const { retrieveContext } = require("../services/retrievalService");
const { generateAnswer } = require("../services/llmService");

async function answerRagQuestion(question) {
  const { context, found } = await retrieveContext(question);
  if (!found) {
    return { answer: "I can only answer questions related to Sunil Rawat's profile, skills, experience, and projects.", context: "" };
  }

  const answer = await generateAnswer({ question, context });
  return { answer };
}

async function answerQuestion(question) {
  const answer = await generateAnswer({ question, context: "" });
  return { answer };
}

module.exports = { answerRagQuestion, answerQuestion };
