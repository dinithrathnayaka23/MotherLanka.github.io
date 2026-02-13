const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
const LANG_STORAGE_KEY = "motherlanka_language";

const currentLang = () => localStorage.getItem(LANG_STORAGE_KEY) || "en";

const handleResponse = async (res) => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json();
};

export const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "x-lang": currentLang() },
  });
  return handleResponse(res);
};

export const apiPost = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lang": currentLang(),
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
};
