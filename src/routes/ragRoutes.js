const express = require("express");
const {
  answerRagQuestion,
  answerQuestion,
  askAgentQuestion
} = require("../controllers/ragController");

const router = express.Router();

router.post("/rag", async (req, res) => {
  try {
    const { assistantType, question } = req.body;

    if (!question || !assistantType) {
      return res.status(400).json({ error: "Question and assistantType are required" });
    }

    const result = await askAgentQuestion(assistantType, question);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "RAG failed" });
  }
});

module.exports = router;