const { RESUME_PROMPT } = require("../prompts/resumePrompt");

module.exports = {
   prompt: RESUME_PROMPT,
   tools: ["searchResume"],
};
