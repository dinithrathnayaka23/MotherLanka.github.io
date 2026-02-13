import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import EmptyState from "../components/ui/EmptyState";
import { apiGet, apiPost } from "../utils/api";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const ExperienceDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDates: "",
    guests: "",
    message: "",
  });

  const steps = [
    "Meet your local guide and get a quick briefing.",
    "Begin the experience at the best time for views and photos.",
    "Enjoy curated highlights with short breaks and local tips.",
    "Wrap up with recommendations for nearby spots.",
  ];

  const included = [
    "Local guide or host",
    "Recommended best-time schedule",
    "Photo-friendly viewpoints",
    "Safety and timing tips",
  ];

  const goodToKnow = [
    "Bring a refillable water bottle and sunscreen.",
    "Wear comfortable shoes for walking.",
    "Weather can change fast in hill-country areas.",
    "Ask about private or group options.",
  ];

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet(`/api/experiences/${id}`)
      .then((data) => {
        if (active) setExp(data);
      })
      .catch(() => {
        if (active) setError(t("details.experienceNotFound"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, t]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      await apiPost("/api/bookings", {
        type: "experience",
        refId: id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        travelDates: form.travelDates,
        guests: form.guests,
        message: form.message,
      });
      setStatus({ state: "success", message: t("details.bookingSent") });
      setForm({
        fullName: "",
        email: "",
        phone: "",
        travelDates: "",
        guests: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        state: "error",
        message: t("details.bookingFailed"),
      });
    }
  };

  if (!loading && (error || !exp)) {
    return (
      <>
        <Navbar />
        <SlideDown>
          <EmptyState
            title={t("details.experienceNotFound")}
            description={t("details.experienceNotFoundDesc")}
            actionLabel={t("details.browseExperiences")}
            actionTo="/experiences"
          />
        </SlideDown>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero / Image Section */}
      <SlideDown>
        <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold bg-white/70 px-3 py-1 rounded-full">
              {exp?.category || t("nav.experiences")}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-textDark leading-tight mt-4">
              {exp?.title || t("pages.experiences.loading")}
            </h1>
            <p className="mt-5 text-gray-700 text-lg md:text-xl max-w-3xl">
              {exp?.description}
            </p>
            {exp && (
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-sm font-semibold text-textDark">
                  ★ {exp.rating} rating
                </span>
                <span className="px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-sm font-semibold text-textDark">
                  ⏱ {exp.duration}
                </span>
                <span className="px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-sm font-semibold text-textDark">
                  {t("details.easyToBook")}
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
            {exp && (
              <img
                src={exp.image}
                alt={exp.title}
                className="rounded-3xl shadow-2xl w-full h-[420px] object-cover"
              />
            )}
          </div>
        </div>
        </section>
      </SlideDown>

      {/* Content / Details */}
      <SlideDown>
        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {loading && <p className="text-gray-600">{t("details.loadingExperience")}</p>}
          {!loading && exp && (
            <>
              <div className="bg-white rounded-3xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-textDark mb-4">
                  {t("details.highlights")}
                </h2>
                <ul className="space-y-3">
                  {(exp.highlights || []).map((h, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <i className="fas fa-check-circle text-primary"></i>
                      <span className="text-gray-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-textDark mb-6">
                  {t("details.whatYouWillDo")}
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {steps.map((step, idx) => (
                    <div
                      key={step}
                      className="bg-primary/5 rounded-2xl p-5 border border-primary/10"
                    >
                      <p className="text-xs uppercase tracking-widest text-primary font-semibold">
                        {t("details.step", { number: idx + 1 })}
                      </p>
                      <p className="mt-2 text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-textDark mb-4">
                    {t("details.included")}
                  </h3>
                  <ul className="space-y-3">
                    {included.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <i className="fas fa-badge-check text-primary"></i>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-textDark mb-4">
                    {t("details.goodToKnow")}
                  </h3>
                  <ul className="space-y-3">
                    {goodToKnow.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <i className="fas fa-circle-info text-primary"></i>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 h-fit flex flex-col gap-4 sticky top-24 border border-gray-100">
          {exp && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-primary">
                  ★ {exp.rating} rating
                </p>
                <p className="text-sm text-gray-500">
                  {t("details.durationLabel", { duration: exp.duration })}
                </p>
              </div>

              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-sm text-gray-700">
                {t("details.bookNowHint")}
              </div>

              <form onSubmit={submitBooking} className="space-y-3 mt-2">
                <input
                  type="text"
                  placeholder={t("details.fullName")}
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
                <input
                  type="email"
                  placeholder={t("details.email")}
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
                <input
                  type="text"
                  placeholder={t("details.phoneOptional")}
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  placeholder={t("details.travelDates")}
                  value={form.travelDates}
                  onChange={handleChange("travelDates")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  placeholder={t("details.guests")}
                  value={form.guests}
                  onChange={handleChange("guests")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  rows="3"
                  placeholder={t("details.message")}
                  value={form.message}
                  onChange={handleChange("message")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  disabled={status.state === "loading"}
                  className="mt-2 w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full hover:opacity-90 transition disabled:opacity-60"
                >
                  {status.state === "loading"
                    ? t("details.sending")
                    : t("details.bookExperience")}
                </button>
              </form>
              {status.message && (
                <p
                  className={`text-xs ${
                    status.state === "error"
                      ? "text-red-500"
                      : "text-emerald-600"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </>
          )}
        </div>
        </section>
      </SlideDown>

      <Footer />
    </>
  );
};

export default ExperienceDetails;
