const { retrieveContext } = require("../../services/ai/retrievalService");

async function getPortfolioInfo(query) {
  console.log("ℹ️ [getPortfolioInfo] called with query:", query);
  const { context, found } = await retrieveContext(query);

  if (!found) return "No relevant information found.";

  return context;
}

module.exports = { getPortfolioInfo };
