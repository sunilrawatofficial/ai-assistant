const { processAgentQuery, streamAgentEvents } = require("../services/ai/agentService");

async function askAgentQuestion(assistantType, question) {

  console.log(`\n[askAgentQuestion()] called with [assistantType]: ${assistantType}, [question]: ${question}`);
  const answer = await processAgentQuery({ assistantType, question });
  return { answer };
}

function createAgentEventStream(assistantType, question) {
  console.log(`\n[createAgentEventStream()] called with [assistantType]: ${assistantType}, [question]: ${question}`);
  return streamAgentEvents({ assistantType, question });
}

module.exports = { askAgentQuestion, createAgentEventStream };
