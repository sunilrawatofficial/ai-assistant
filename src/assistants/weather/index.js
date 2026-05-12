const { WEATHER_PROMPT } = require("./prompt");

module.exports = {
   prompt: WEATHER_PROMPT,
   tools: ["getWeatherInfo"],
};
