import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SUPPORTED_LANGUAGES, translations } from "../i18n/translations";

const STORAGE_KEY = "motherlanka_language";
const DEFAULT_LANGUAGE = "en";
const MT_STORAGE_PREFIX = "motherlanka_mt_";
const DOM_MT_STORAGE_PREFIX = "motherlanka_dom_mt_";
const TRANSLATABLE_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"];

const LanguageContext = createContext(null);

const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

const interpolate = (template, values = {}) =>
  template.replace(/\{(\w+)\}/g, (_, token) => String(values[token] ?? ""));

const flattenStrings = (obj, prefix = "", out = {}) => {
  Object.entries(obj || {}).forEach(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      out[path] = value;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenStrings(value, path, out);
    }
  });
  return out;
};

const translateText = async (text, lang) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
    lang
  )}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) return text;
  const data = await res.json();
  if (!Array.isArray(data?.[0])) return text;
  return data[0].map((chunk) => chunk?.[0] || "").join("") || text;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const exists = SUPPORTED_LANGUAGES.some((lang) => lang.code === saved);
    return exists ? saved : DEFAULT_LANGUAGE;
  });
  const [autoMap, setAutoMap] = useState({});
  const textOriginalsRef = useRef(new WeakMap());
  const attrOriginalsRef = useRef(new WeakMap());
  const domObserverRef = useRef(null);

  useEffect(() => {
    if (language === DEFAULT_LANGUAGE) {
      setAutoMap({});
      return;
    }

    let active = true;
    const run = async () => {
      const storageKey = `${MT_STORAGE_PREFIX}${language}`;
      const cached = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const current = translations[language] || {};
      const baseStrings = flattenStrings(translations[DEFAULT_LANGUAGE]);

      const missing = Object.entries(baseStrings).filter(
        ([path]) => getByPath(current, path) === undefined && !cached[path]
      );

      const generated = { ...cached };
      for (const [path, text] of missing) {
        try {
          generated[path] = await translateText(text, language);
        } catch {
          generated[path] = text;
        }
      }

      if (active) {
        setAutoMap(generated);
        localStorage.setItem(storageKey, JSON.stringify(generated));
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const textOriginals = textOriginalsRef.current;
    const attrOriginals = attrOriginalsRef.current;
    let active = true;
    let cacheDirty = false;

    const disconnectObserver = () => {
      if (domObserverRef.current) {
        domObserverRef.current.disconnect();
        domObserverRef.current = null;
      }
    };

    const restoreOriginalContent = () => {
      document.querySelectorAll("*").forEach((element) => {
        element.childNodes.forEach((node) => {
          if (node.nodeType !== Node.TEXT_NODE) return;
          const original = textOriginals.get(node);
          if (typeof original === "string") {
            node.textContent = original;
          }
        });

        const attrMap = attrOriginals.get(element);
        if (!attrMap) return;
        Object.entries(attrMap).forEach(([name, value]) => {
          element.setAttribute(name, value);
        });
      });
    };

    if (language === DEFAULT_LANGUAGE) {
      disconnectObserver();
      restoreOriginalContent();
      return () => {};
    }

    const storageKey = `${DOM_MT_STORAGE_PREFIX}${language}`;
    const cache = JSON.parse(localStorage.getItem(storageKey) || "{}");

    const getTranslated = async (source) => {
      if (cache[source]) return cache[source];
      try {
        cache[source] = await translateText(source, language);
      } catch {
        cache[source] = source;
      }
      cacheDirty = true;
      return cache[source];
    };

    const collectEntries = (root) => {
      const entries = [];
      const elements = [];

      if (root?.nodeType === Node.ELEMENT_NODE) {
        elements.push(root);
      }
      if (root?.querySelectorAll) {
        elements.push(...root.querySelectorAll("*"));
      }

      elements.forEach((element) => {
        const tag = element.tagName?.toLowerCase();
        if (["script", "style", "noscript", "code"].includes(tag)) return;

        element.childNodes.forEach((node) => {
          if (node.nodeType !== Node.TEXT_NODE) return;
          const current = node.textContent || "";
          const trimmed = current.trim();
          if (!trimmed) return;
          if (!textOriginals.has(node)) {
            textOriginals.set(node, current);
          }
          const source = (textOriginals.get(node) || "").trim();
          if (!source) return;
          entries.push({ type: "text", node, source });
        });

        let originalAttrs = attrOriginals.get(element);
        if (!originalAttrs) {
          originalAttrs = {};
          attrOriginals.set(element, originalAttrs);
        }

        TRANSLATABLE_ATTRIBUTES.forEach((attr) => {
          if (!element.hasAttribute(attr)) return;
          if (!(attr in originalAttrs)) {
            originalAttrs[attr] = element.getAttribute(attr) || "";
          }
          const source = (originalAttrs[attr] || "").trim();
          if (!source) return;
          entries.push({ type: "attr", element, attr, source });
        });
      });

      return entries;
    };

    const translateRoot = async (root) => {
      const entries = collectEntries(root);
      const uniqueSources = Array.from(new Set(entries.map((entry) => entry.source)));

      for (const source of uniqueSources) {
        if (!active) return;
        // eslint-disable-next-line no-await-in-loop
        await getTranslated(source);
      }

      if (!active) return;
      entries.forEach((entry) => {
        const translated = cache[entry.source] || entry.source;
        if (entry.type === "text") {
          entry.node.textContent = translated;
        } else {
          entry.element.setAttribute(entry.attr, translated);
        }
      });
    };

    translateRoot(document.body);

    const observer = new MutationObserver((mutations) => {
      if (!active) return;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            translateRoot(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
            translateRoot(node.parentElement);
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    domObserverRef.current = observer;

    return () => {
      active = false;
      disconnectObserver();
      if (cacheDirty) {
        localStorage.setItem(storageKey, JSON.stringify(cache));
      }
    };
  }, [language]);

  const value = useMemo(() => {
    const t = (key, values) => {
      const fromCurrent = getByPath(translations[language], key);
      const fromDefault = getByPath(translations[DEFAULT_LANGUAGE], key);
      const fromAuto = autoMap[key];
      const selected = fromCurrent ?? fromAuto ?? fromDefault ?? key;
      return typeof selected === "string"
        ? interpolate(selected, values)
        : String(selected);
    };

    return {
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t,
    };
  }, [language, autoMap]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
};
