const { PORTFOLIO_PROMPT } = require("./prompt");
const { getPortfolioInfo } = require("./getPortfolioInfo");

module.exports = {
  prompt: PORTFOLIO_PROMPT,
  tools: ["getPortfolioInfo"],
  toolDefinitions: [
    {
      type: "function",
      function: {
        name: "getPortfolioInfo",
        description: "Search Sunil's resume information.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
            },
          },
          required: ["query"],
        },
      },
    },
  ],
  toolHandlers: { getPortfolioInfo },
};
