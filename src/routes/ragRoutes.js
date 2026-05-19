const express = require("express");
const {
  askAgentQuestion,
  createAgentEventStream,
} = require("../controllers/ragController");

const router = express.Router();

function writeSse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

router.post("/rag", async (req, res) => {
  try {
    const { assistantType, question, stream } = req.body;

    if (!question || !assistantType) {
      return res.status(400).json({ error: "Question and assistantType are required" });
    }

    if (!stream) {
      const result = await askAgentQuestion(assistantType, question);
      return res.json(result);
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    for await (const event of createAgentEventStream(assistantType, question)) {
      writeSse(res, event);
    }

    writeSse(res, { done: true });
    res.end();
  } catch (err) {
    console.error(err);
    if (res.headersSent) {
      writeSse(res, { error: "RAG failed" });
      return res.end();
    }
    res.status(500).json({ error: "RAG failed" });
  }
});

module.exports = router;
