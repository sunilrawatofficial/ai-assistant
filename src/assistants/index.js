const portfolioAssistant = require("./portfolioAssistant");
const weatherAssistant = require("./weatherAssistant");

const assistants = {
   portfolio: portfolioAssistant,
   weather: weatherAssistant,

};

module.exports = { assistants };
