const { WEATHER_PROMPT } = require("../prompts/weatherPrompt");

module.exports = {
   prompt: WEATHER_PROMPT,
   tools: ["getWeatherInfo"],
};
