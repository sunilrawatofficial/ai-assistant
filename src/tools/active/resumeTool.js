const { retrieveContext } = require("../../services/retrievalService");

async function searchResume(query) {
  const { context, found } = await retrieveContext(query);

  if (!found) return "No relevant information found.";

  return context;
}

module.exports = { searchResume };