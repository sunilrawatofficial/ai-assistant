const portfolioAssistant = require("./portfolio");
const weatherAssistant = require("./weather");

const assistants = {
   portfolio: portfolioAssistant,
   weather: weatherAssistant,
};

module.exports = { assistants };
