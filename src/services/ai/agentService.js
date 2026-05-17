const { generateChatCompletion } = require("./llmService");
const { assistants } = require("../../assistants");

async function processAgentQuery({ assistantType, question }) {
  console.log("[assistantType received]", assistantType);
  const assistant = assistants[assistantType];
  console.log("[assistant found tools]", assistant?.tools);

  if (!assistant) {
    throw new Error("Invalid assistant type");
  }

  const allowedTools = assistant.toolDefinitions || [];

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

  console.log("[message]", message);
  if (!message.tool_calls?.length) {
    return message.content;
  }

  const toolCall = message.tool_calls[0];
  const toolName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);

  const toolFunction = assistant.toolHandlers?.[toolName];
  if (!toolFunction) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  console.log("[tool args]", args);
  const toolResult = await toolFunction(Object.values(args)[0]);

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
