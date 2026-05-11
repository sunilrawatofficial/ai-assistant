const { processAgentQuery } = require("../services/agentService");


async function askAgentQuestion(assistantType, question) {
  const answer = await processAgentQuery({ assistantType, question });
  return { answer };
}
module.exports = { askAgentQuestion };
