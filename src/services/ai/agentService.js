const {
   generateChatCompletion,
   streamChatCompletion,
} = require("./llmService");
const { assistants } = require("../../assistants");

function getAssistant(assistantType) {
   const assistant = assistants[assistantType];
   if (!assistant) {
      throw new Error("Invalid assistant type");
   }
   return assistant;
}

function buildQuestionMessages(assistant, question) {
   return [
      { role: "system", content: assistant.prompt },
      { role: "user", content: question },
   ];
}

function buildMessagesWithToolResult(assistant, question, toolResult) {
   return [
      { role: "system", content: assistant.prompt },
      {
         role: "user",
         content: `Question: ${question}

             Tool Result:
             ${JSON.stringify(toolResult)}`,
      },
   ];
}

/** First LLM call — returns whether a tool is required and optional direct reply. */
async function decideIfToolIsNeeded(assistant, question) {
   const message = await generateChatCompletion({
      messages: buildQuestionMessages(assistant, question),
      tools: assistant.toolDefinitions || [],
   });

   if (!message.tool_calls?.length) {
      return { needsTool: false, directAnswer: message.content };
   }

   return { needsTool: true, toolCall: message.tool_calls[0] };
}

/** Runs the tool handler and builds messages for the final answer. */
async function runToolAndBuildMessages(assistant, toolCall, question) {
   const toolName = toolCall.function.name;
   const args = JSON.parse(toolCall.function.arguments);
   const toolHandler = assistant.toolHandlers?.[toolName];

   if (!toolHandler) {
      throw new Error(`Unknown tool: ${toolName}`);
   }

   console.log("[tool args]", args);
   const toolResult = await toolHandler(Object.values(args)[0]);

   return buildMessagesWithToolResult(assistant, question, toolResult);
}

async function processAgentQuery({ assistantType, question }) {
   const assistant = getAssistant(assistantType);
   const decision = await decideIfToolIsNeeded(assistant, question);

   if (!decision.needsTool) {
      return decision.directAnswer ?? "";
   }

   const messagesWithToolResult = await runToolAndBuildMessages(
      assistant,
      decision.toolCall,
      question,
   );
   const finalMessage = await generateChatCompletion({
      messages: messagesWithToolResult,
   });
   return finalMessage.content;
}

/**
 * Streaming: yields SSE events for the route.
 *   { status: "thinking" | "searching" | "generating" }
 *   { token: "..." }
 */
async function* streamAgentEvents({ assistantType, question }) {
   const assistant = getAssistant(assistantType);

   yield { status: "thinking" };

   const decision = await decideIfToolIsNeeded(assistant, question);

   if (!decision.needsTool) {
      yield { status: "generating" };
      if (decision.directAnswer) {
         yield { token: decision.directAnswer };
      }
      return;
   }

   yield { status: "searching" };
   const answerMessages = await runToolAndBuildMessages(
      assistant,
      decision.toolCall,
      question,
   );

   yield { status: "generating" };

   for await (const token of streamChatCompletion({ messages: answerMessages })) {
      yield { token };
   }
}

module.exports = {
   processAgentQuery,
   streamAgentEvents,
};
