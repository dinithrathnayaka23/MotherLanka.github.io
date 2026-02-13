const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { rebuildRagIndex } = require("../rag");

const router = express.Router();

router.post("/rebuild", requireAuth, requireAdmin, async (req, res) => {
  try {
    const count = await rebuildRagIndex();
    return res.json({ ok: true, chunks: count });
  } catch (err) {
    return res.status(500).json({ message: "RAG rebuild failed" });
  }
});

module.exports = router;
