const express = require("express");
const {
  answerRagQuestion,
  answerQuestion,
  askAgentQuestion
} = require("../controllers/ragController");

const router = express.Router();

router.post("/rag", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await askAgentQuestion(question);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "RAG failed" });
  }
});

module.exports = router;