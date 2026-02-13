import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/ui/PageHeader";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import Accordion from "../components/ui/Accordion";
import { apiPost } from "../utils/api";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const faqs = [
  {
    title: "How soon will I receive a response?",
    body: "Our team typically responds within 24 hours on business days.",
  },
  {
    title: "Do you offer custom itineraries?",
    body: "Yes. Share your preferences and travel dates and we will tailor recommendations.",
  },
  {
    title: "Can I book stays and experiences together?",
    body: "Absolutely. We can bundle stays, experiences, and transport tips in one plan.",
  },
];

const Contact = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    travelDates: "",
    interests: "",
    message: "",
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      await apiPost("/api/contact", {
        name: form.name,
        email: form.email,
        travelDates: form.travelDates,
        interests: form.interests,
        message: form.message,
      });
      setStatus({ state: "success", message: "Message sent successfully." });
      setForm({
        name: "",
        email: "",
        travelDates: "",
        interests: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        state: "error",
        message: "Unable to send message. Try again.",
      });
    }
  };

  return (
    <>
      <Navbar />

      <SlideDown>
        <PageHeader
        title={t("pages.contact.headerTitle")}
        highlight={t("pages.contact.headerHighlight")}
        subtitle={t("pages.contact.headerSubtitle")}
        />
      </SlideDown>

      <SlideDown>
        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8">
            <SectionTitle
              eyebrow="Contact"
              title="Send us a message"
              subtitle="We’re happy to help with trip planning, recommendations, and custom routes."
              align="left"
            />
            <form
              className="mt-8 grid md:grid-cols-2 gap-5"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange("name")}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange("email")}
                required
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                placeholder="Travel dates"
                value={form.travelDates}
                onChange={handleChange("travelDates")}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="text"
                placeholder="Interests (beach, culture, wildlife)"
                value={form.interests}
                onChange={handleChange("interests")}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                rows="5"
                placeholder="Tell us about your trip"
                value={form.message}
                onChange={handleChange("message")}
                required
                className="md:col-span-2 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="md:col-span-2">
                <Button size="lg" disabled={status.state === "loading"}>
                  {status.state === "loading" ? "Sending..." : "Send message"}
                </Button>
                {status.message && (
                  <p
                    className={`mt-3 text-sm ${
                      status.state === "error"
                        ? "text-red-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8">
            <SectionTitle
              eyebrow="FAQ"
              title="Quick answers"
              subtitle="Everything you need to know before contacting us."
              align="left"
            />
            <div className="mt-8">
              <Accordion items={faqs} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6">
            <h3 className="text-lg font-bold text-textDark">Contact details</h3>
            <p className="mt-4 text-sm text-gray-600">
              Reach out for itinerary ideas, support, or partnership inquiries.
            </p>
            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <i className="fas fa-phone text-primary"></i>
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-envelope text-primary"></i>
                <span>hello@motherlanka.com</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-location-dot text-primary"></i>
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-6 border border-primary/10">
            <h3 className="text-lg font-bold text-textDark">Need a fast reply?</h3>
            <p className="mt-3 text-sm text-gray-600">
              Use the chatbot for instant tips, stays, and experience ideas.
            </p>
            <Button
              variant="primary"
              size="md"
              className="mt-6 w-full"
              onClick={() => window.dispatchEvent(new Event("open-chatbot"))}
              type="button"
            >
              Open Chatbot
            </Button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6">
            <h3 className="text-lg font-bold text-textDark">Operating hours</h3>
            <p className="mt-3 text-sm text-gray-600">
              Monday to Saturday, 9:00 AM to 6:00 PM (Sri Lanka Time)
            </p>
          </div>
        </div>
        </section>
      </SlideDown>

      <Footer />
    </>
  );
};

export default Contact;
