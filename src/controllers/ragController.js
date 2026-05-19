const { processAgentQuery, streamAgentEvents } = require("../services/ai/agentService");

async function askAgentQuestion(assistantType, question) {
  const answer = await processAgentQuery({ assistantType, question });
  return { answer };
}

function createAgentEventStream(assistantType, question) {
  return streamAgentEvents({ assistantType, question });
}

module.exports = { askAgentQuestion, createAgentEventStream };
