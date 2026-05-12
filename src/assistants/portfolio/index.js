const { PORTFOLIO_PROMPT } = require("./prompt");

module.exports = {
   prompt: PORTFOLIO_PROMPT,
   tools: ["getPortfolioInfo"],
};
