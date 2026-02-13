const { fetch: undiciFetch } = require("undici");

const fetchFn = global.fetch || undiciFetch;
const memo = new Map();
const SUPPORTED_LANGS = new Set(["en", "es", "fr", "nl", "zh", "ja", "ko", "ru"]);

const normalizeLang = (value) => {
  if (!value) return "en";
  const primary = String(value).split(",")[0].trim().split("-")[0].toLowerCase();
  return SUPPORTED_LANGS.has(primary) ? primary : "en";
};

const resolveRequestLang = (req) =>
  normalizeLang(req.query.lang || req.headers["x-lang"] || req.headers["accept-language"]);

const translateText = async (text, lang) => {
  if (!text || typeof text !== "string") return text;
  if (lang === "en") return text;

  const key = `${lang}::${text}`;
  if (memo.has(key)) return memo.get(key);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      lang
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetchFn(url);
    if (!res.ok) return text;
    const data = await res.json();
    const translated = Array.isArray(data?.[0])
      ? data[0].map((chunk) => chunk?.[0] || "").join("")
      : text;
    memo.set(key, translated || text);
    return translated || text;
  } catch {
    return text;
  }
};

const translateArray = async (values, lang) => {
  if (!Array.isArray(values) || lang === "en") return values || [];
  return Promise.all(values.map((value) => translateText(value, lang)));
};

module.exports = {
  SUPPORTED_LANGS,
  normalizeLang,
  resolveRequestLang,
  translateText,
  translateArray,
};
