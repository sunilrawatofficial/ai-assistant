const openai = require("../config/openai");
const { CHAT_MODEL } = require("../config/constants");
const { tools } = require("../services/toolDefinitions");
const { searchResume } = require("../tools/active/resumeTool");
const { getWeatherInfo } = require("../tools/active/weatherTool");
const { generateChatCompletion } = require("./llmService");

const { ASSISTANT_PROMPT } = require("../prompts/assistantPrompt");
const { RESUME_PROMPT } = require("../prompts/resumePrompt");
const { WEATHER_PROMPT } = require("../prompts/weatherPrompt");

async function processAgentQuery(userQuery) {
   // STEP 1: Ask OpenAI if tool is needed
   const message = await generateChatCompletion({
      messages: [
         {
            role: "system",
            content: ASSISTANT_PROMPT,
         },
         {
            role: "user",
            content: userQuery,
         },
      ],
      tools,
   });

   // STEP 2: Detect tool calls
   if (message.tool_calls?.length) {
      const toolCall = message.tool_calls[0];
      const toolName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      console.log("[tool name] =>", toolName);
      console.log("[tool args] =>", args);
      let toolResult = "";
      let finalPrompt;
      // STEP 3: Execute tool
      switch (toolName) {
         case "searchResume":
            toolResult = await searchResume(args.query);
            finalPrompt = RESUME_PROMPT;
            break;

         case "getWeatherInfo":
            toolResult = await getWeatherInfo(args.city);
            finalPrompt = WEATHER_PROMPT;
            break;

         default:
            toolResult = "Unknown tool";
      }

      // STEP 4: Send tool result back to LLM
      const finalResponse = await generateChatCompletion({
         messages: [{
               role: "system",
               content: finalPrompt,
            },{
               role: "user",
               content: userQuery,
            },
            message,
            {
               role: "tool",
               tool_call_id: toolCall.id,
               content: JSON.stringify(toolResult),
            },
         ],
      });

      return finalResponse.content;
   }

   // STEP 5: If no tool needed
   return message.content;
}

module.exports = { processAgentQuery };
