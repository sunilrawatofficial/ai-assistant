const { generateChatCompletion } = require("./llmService");
const { assistants } = require("../../assistants");
const { getPortfolioInfo } = require("../../tools/portfolioTool");
const { getWeatherInfo } = require("../../tools/weatherTool");

const toolDefinitions = [
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
   }
];

const toolFunctionsRegistry = { getPortfolioInfo, getWeatherInfo };

async function processAgentQuery({ assistantType, question }) {
   console.log("[assistantType received]", assistantType);
   // STEP 1
   const assistant = assistants[assistantType];
   console.log("[assistant found tools]", assistant.tools);

   if (!assistant) {
      throw new Error("Invalid assistant type");
   }

   // STEP 2
   const allowedTools = toolDefinitions.filter((tool) =>
      assistant.tools.includes(tool.function.name),
   );

   // STEP 3
   const message = await generateChatCompletion({
      messages: [
         {
            role: "system",
            content: assistant.prompt,
         },

         {
            role: "user",
            content: question,
         },
      ],

      tools: allowedTools,
   });

   // STEP 4
   if (!message.tool_calls?.length) {
      return message.content;
   }

   const toolCall = message.tool_calls[0];
   const toolName = toolCall.function.name;
   const args = JSON.parse(toolCall.function.arguments);

   // STEP 5
   const toolFunction = toolFunctionsRegistry[toolName];

   const toolResult = await toolFunction(Object.values(args)[0]);

   // STEP 6
   const finalMessage = await generateChatCompletion({
      messages: [
         {
            role: "system",
            content: assistant.prompt,
         },

         {
            role: "user",
            content: `Question:
             ${question}

             Tool Result:
             ${JSON.stringify(toolResult)}`,
         },
      ],
   });

   return finalMessage.content;
}

module.exports = {
   processAgentQuery,
};
