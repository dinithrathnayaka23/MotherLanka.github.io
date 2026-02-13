import { useState } from "react";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";
import { apiPost } from "../../utils/api";
import { useLanguage } from "../../context/LanguageContext";

const HomeNewsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      await apiPost("/api/newsletter", { email });
      setStatus({ state: "success", message: t("home.newsletter.success") });
      setEmail("");
    } catch (err) {
      setStatus({
        state: "error",
        message: t("home.newsletter.error"),
      });
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <SectionTitle
          eyebrow={t("home.newsletter.eyebrow")}
          title={t("home.newsletter.title")}
          subtitle={t("home.newsletter.subtitle")}
          align="center"
        />
        <form
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder={t("home.newsletter.placeholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full sm:w-80 rounded-full border border-gray-200 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
          <Button size="md" disabled={status.state === "loading"}>
            {status.state === "loading"
              ? t("home.newsletter.sending")
              : t("home.newsletter.subscribe")}
          </Button>
        </form>
        {status.message && (
          <p
            className={`mt-4 text-sm ${
              status.state === "error" ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {status.message}
          </p>
        )}
        <p className="mt-4 text-xs text-gray-500">
          {t("home.newsletter.disclaimer")}
        </p>
      </div>
    </section>
  );
};

export default HomeNewsletter;
