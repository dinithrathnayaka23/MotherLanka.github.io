const express = require("express");
const { chatSchema } = require("../utils/validation");
const {
  ensureRagIndex,
  getTopMatches,
  buildRagPrompt,
  buildResponse,
} = require("../rag");

const router = express.Router();

router.post("/", async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid message" });
  }

  try {
    await ensureRagIndex();
    const matches = await getTopMatches(parsed.data.message, 5);
    const prompt = buildRagPrompt(parsed.data.message, matches);
    let reply = "";
    let chatError = null;
    try {
      reply = await buildResponse(prompt);
    } catch (err) {
      chatError = err;
      reply = "";
    }

    return res.json({
      reply:
        reply ||
        (matches.length
          ? "I’m having trouble reaching the AI service, but here are some relevant details I can share based on our data. Ask me a more specific question if you’d like."
          : "I’m having trouble reaching the AI service right now. Please try again shortly or contact our team for help."),
      sources: matches.map((m) => ({
        type: m.type,
        title: m.title,
        refId: m.ref_id,
        score: m.score,
      })),
      ...(chatError && process.env.NODE_ENV !== "production"
        ? { error: chatError.message }
        : {}),
    });
  } catch (err) {
    return res.json({
      reply:
        "I’m having trouble reaching the AI service right now. Please try again shortly or contact our team for help.",
      sources: [],
      ...(process.env.NODE_ENV !== "production"
        ? { error: err.message }
        : {}),
    });
  }
});

module.exports = router;
