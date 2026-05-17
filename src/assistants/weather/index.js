const { WEATHER_PROMPT } = require("./prompt");
const { getWeatherInfo } = require("./getWeatherInfo");

module.exports = {
  prompt: WEATHER_PROMPT,
  tools: ["getWeatherInfo"],
  toolDefinitions: [
    {
      type: "function",
      function: {
        name: "getWeatherInfo",
        description: "Get current weather information.",
        parameters: {
          type: "object",
          properties: {
            city: {
              type: "string",
            },
          },
          required: ["city"],
        },
      },
    },
  ],
  toolHandlers: { getWeatherInfo },
};
