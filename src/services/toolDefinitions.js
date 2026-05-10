const tools = [
   {
      type: "function",
      function: {
         name: "searchResume",
         description:
            "Search information about Sunil's skills, projects, experience, education and technical background.",
         parameters: {
            type: "object",
            properties: {
               query: {
                  type: "string",
                  description: "Search query related to resume information",
               },
            },
            required: ["query"],
         },
      },
   },
   {
      type: "function",
      function: {
         name: "getWeatherInfo",
         description:
            "Get current weather information for cities including temperature, humidity, wind and conditions.",
         parameters: {
            type: "object",
            properties: {
               city: {
                  type: "string",
                  description: "City name for weather lookup",
               },
            },
            required: ["city"],
         },
      },
   },
];

module.exports = { tools };
