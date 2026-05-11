const { processAgentQuery } = require("../services/ai/agentService");


async function askAgentQuestion(assistantType, question) {
  const answer = await processAgentQuery({ assistantType, question });
  return { answer };
}
module.exports = { askAgentQuestion };
