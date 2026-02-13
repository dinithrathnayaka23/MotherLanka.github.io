const { getDb } = require("./db");
const { fetch: undiciFetch } = require("undici");

const fetchFn = global.fetch || undiciFetch;

const EMBEDDING_MODEL =
  process.env.HF_EMBEDDING_MODEL || "sentence-transformers/all-MiniLM-L6-v2";
const CHAT_MODEL =
  process.env.HF_CHAT_MODEL || "mistralai/Mistral-7B-Instruct-v0.3";
const EMBEDDINGS_DISABLED = process.env.HF_EMBEDDINGS_DISABLED === "true";
const CHAT_COMPLETIONS_URL =
  "https://router.huggingface.co/v1/chat/completions";

const cosineSimilarity = (a, b) => {
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    aNorm += a[i] * a[i];
    bNorm += b[i] * b[i];
  }
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm) || 1);
};

const hfRequest = async (url, body) => {
  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY not configured");
  }

  const res = await fetchFn(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      "[HF] Request failed",
      res.status,
      res.statusText,
      url,
      errorText
    );
    throw new Error(`Hugging Face error: ${errorText}`);
  }

  return res.json();
};

const hfModelRequest = async (model, body) =>
  hfRequest(`https://router.huggingface.co/hf-inference/models/${model}`, body);

const hfChatRequest = async (body) => {
  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY not configured");
  }

  const res = await fetchFn(CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(
      "[HF] Chat request failed",
      res.status,
      res.statusText,
      CHAT_COMPLETIONS_URL,
      errorText
    );
    throw new Error(`Hugging Face error: ${errorText}`);
  }

  return res.json();
};

const averageVectors = (vectors) => {
  if (!vectors.length) return [];
  const dim = vectors[0].length || 0;
  if (!dim) return [];
  const sum = new Array(dim).fill(0);
  for (const vec of vectors) {
    for (let i = 0; i < dim; i += 1) {
      sum[i] += vec[i];
    }
  }
  return sum.map((v) => v / vectors.length);
};

const buildEmbedding = async (input) => {
  if (EMBEDDINGS_DISABLED) {
    return [];
  }

  try {
    const response = await hfModelRequest(EMBEDDING_MODEL, {
      inputs: input,
      options: { wait_for_model: true },
    });

    if (Array.isArray(response)) {
      if (Array.isArray(response[0])) {
        if (Array.isArray(response[0][0])) {
          return averageVectors(response[0]);
        }
        return response;
      }
    }
    return [];
  } catch (err) {
    return [];
  }
};

const buildResponse = async (prompt) => {
  const response = await hfChatRequest({
    model: CHAT_MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 220,
    temperature: 0.3,
  });

  const message = response?.choices?.[0]?.message?.content;
  return typeof message === "string" ? message.trim() : "";
};

// Backwards compatible call shape for chat remains above.
// --- old usage removed below ---

/*
const buildEmbedding = async (input) => {
  const response = await hfRequest(EMBEDDING_MODEL, {
    inputs: input,
    options: { wait_for_model: true },
  });

  if (Array.isArray(response)) {
    if (Array.isArray(response[0])) {
      if (Array.isArray(response[0][0])) {
        return averageVectors(response[0]);
      }
      return response;
    }
  }
  return [];
};
*/

const buildRagItems = (data) => {
  const items = [];

  for (const d of data.destinations) {
    items.push({
      type: "destination",
      refId: d.id,
      title: d.name,
      content: [
        `Destination: ${d.name}`,
        `Category: ${d.category}`,
        `Region: ${d.region || "N/A"}`,
        `Weather: ${d.weather || "N/A"}`,
        `Duration: ${d.duration || "N/A"}`,
        `Best time: ${d.best_time || "N/A"}`,
        d.description || "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  for (const s of data.stays) {
    items.push({
      type: "stay",
      refId: s.id,
      title: s.name,
      content: [
        `Stay: ${s.name}`,
        `Location: ${s.location}`,
        `Type: ${s.type}`,
        `Price: Rs.${s.price}/night`,
        `Rating: ${s.rating}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  for (const e of data.experiences) {
    items.push({
      type: "experience",
      refId: e.id,
      title: e.title,
      content: [
        `Experience: ${e.title}`,
        `Category: ${e.category}`,
        `Duration: ${e.duration || "N/A"}`,
        `Rating: ${e.rating}`,
        e.short || "",
        e.description || "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  for (const ev of data.events) {
    items.push({
      type: "event",
      refId: ev.id,
      title: ev.title,
      content: [
        `Event: ${ev.title}`,
        `Category: ${ev.category}`,
        `Location: ${ev.location}`,
        `Dates: ${ev.start_date}${ev.end_date ? ` to ${ev.end_date}` : ""}`,
        ev.description || "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  return items;
};

const fetchAllContent = async (db) => {
  const destinations = await db.all("SELECT * FROM destinations");
  const stays = await db.all("SELECT * FROM stays");
  const experiences = await db.all("SELECT * FROM experiences");
  const events = await db.all("SELECT * FROM events");
  return { destinations, stays, experiences, events };
};

const rebuildRagIndex = async () => {
  const db = await getDb();
  const data = await fetchAllContent(db);
  const items = buildRagItems(data);

  await db.run("DELETE FROM rag_chunks");

  for (const item of items) {
    const embedding = await buildEmbedding(item.content);
    await db.run(
      "INSERT INTO rag_chunks (type, ref_id, title, content, embedding_json, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
      [
        item.type,
        item.refId,
        item.title,
        item.content,
        JSON.stringify(embedding),
      ]
    );
  }
  return items.length;
};

const ensureRagIndex = async () => {
  const db = await getDb();
  const row = await db.get("SELECT COUNT(*) as count FROM rag_chunks");
  if (row.count === 0) {
    await rebuildRagIndex();
  }
};

const keywordScore = (query, text) => {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length > 2);
  if (!tokens.length) return 0;
  const hay = text.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (hay.includes(token)) score += 1;
  }
  return score / tokens.length;
};

const getTopMatches = async (query, limit = 5) => {
  const db = await getDb();
  const rows = await db.all("SELECT * FROM rag_chunks");
  if (!rows.length) return [];

  const queryEmbedding = await buildEmbedding(query);
  if (queryEmbedding.length) {
    const scored = rows.map((row) => {
      const embedding = JSON.parse(row.embedding_json || "[]");
      return {
        ...row,
        score: cosineSimilarity(queryEmbedding, embedding),
      };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  const keywordScores = rows.map((row) => ({
    ...row,
    score: keywordScore(query, row.content),
  }));
  return keywordScores.sort((a, b) => b.score - a.score).slice(0, limit);
};

const buildRagPrompt = (question, contexts) => {
  const contextText = contexts
    .map((c, idx) => `Source ${idx + 1} (${c.type} - ${c.title}):\n${c.content}`)
    .join("\n\n");

  return [
    "You are MotherLanka Assistant, a helpful Sri Lanka travel guide.",
    "Answer using ONLY the context below. If the answer is not contained in the context, say you don't know and suggest contacting the team.",
    "",
    "Context:",
    contextText,
    "",
    `Question: ${question}`,
  ].join("\n");
};

module.exports = {
  rebuildRagIndex,
  ensureRagIndex,
  getTopMatches,
  buildRagPrompt,
  buildResponse,
};
