import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import StayGallery from "../components/stays/StayGallery";
import StayAmenities from "../components/stays/StayAmenities";
import StayCard from "../components/stays/StayCard";
import EmptyState from "../components/ui/EmptyState";
import { apiGet, apiPost } from "../utils/api";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const buildDescription = (stay) =>
  `Experience a relaxing ${stay.type.toLowerCase()} escape in ${
    stay.location
  }. Thoughtfully designed spaces, scenic surroundings, and warm hospitality make this stay a memorable base for your Sri Lanka journey.`;

const buildHighlights = (stay) => [
  `Prime ${stay.location} location with easy access to top attractions`,
  `${stay.type} vibes with curated comfort and modern amenities`,
  `Great value with a ${stay.rating}+ guest rating`,
];

const StayDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [stayBase, setStayBase] = useState(null);
  const [relatedStays, setRelatedStays] = useState([]);
  const [destinationImages, setDestinationImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    travelDates: "",
    guests: "",
    message: "",
  });
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      apiGet(`/api/stays/${id}`),
      apiGet("/api/stays"),
      apiGet("/api/destinations"),
    ])
      .then(([stay, allStays, destinations]) => {
        if (!active) return;
        setStayBase(stay);
        setDestinationImages(destinations || []);
        const related = allStays
          .filter(
            (s) =>
              s.id !== stay.id &&
              (s.location === stay.location || s.type === stay.type)
          )
          .slice(0, 3);
        setRelatedStays(related);
      })
      .catch(() => {
        if (active) setError(t("details.stayNotFound"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, t]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("payment");
    if (status === "success" || status === "cancel") {
      setPaymentStatus(status);
    }
  }, []);

  const stay = useMemo(() => {
    if (!stayBase) return null;
    const baseImages =
      Array.isArray(stayBase.images) && stayBase.images.length > 0
        ? stayBase.images
        : [stayBase.image].filter(Boolean);

    const uniqueImages = Array.from(new Set(baseImages));

    if (uniqueImages.length < 4) {
      const locationKey = stayBase.location?.toLowerCase() || "";
      const relatedDestinationImages = destinationImages
        .filter((destination) => {
          const name = destination.name?.toLowerCase() || "";
          const region = destination.region?.toLowerCase() || "";
          const description = destination.description?.toLowerCase() || "";
          return (
            locationKey &&
            (name.includes(locationKey) ||
              region.includes(locationKey) ||
              description.includes(locationKey))
          );
        })
        .flatMap((destination) => destination.images || []);

      const filler = relatedDestinationImages.filter(
        (img) => !uniqueImages.includes(img)
      );
      uniqueImages.push(...filler);
    }

    return {
      ...stayBase,
      description: buildDescription(stayBase),
      images: uniqueImages.slice(0, 4),
      highlights: buildHighlights(stayBase),
    };
  }, [stayBase, destinationImages]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const redirectToPayHere = (action, fields) => {
    const formEl = document.createElement("form");
    formEl.method = "POST";
    formEl.action = action;

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value ?? "";
      formEl.appendChild(input);
    });

    document.body.appendChild(formEl);
    formEl.submit();
    document.body.removeChild(formEl);
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const payload = await apiPost("/api/payments/payhere/checkout", {
        type: "stay",
        refId: id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        country: form.country,
        travelDates: form.travelDates,
        guests: form.guests,
        message: form.message,
      });
      redirectToPayHere(payload.action, payload.fields);
    } catch (err) {
      setStatus({
        state: "error",
        message: t("details.paymentInitFailed"),
      });
    }
  };

  if (!loading && (error || !stay)) {
    return (
      <>
        <Navbar />
        <SlideDown>
          <EmptyState
            title={t("details.stayNotFound")}
            description={t("details.stayNotFoundDesc")}
            actionLabel={t("details.browseStays")}
            actionTo="/stays"
          />
        </SlideDown>
        <Footer />
      </>
    );
  }

  const priceFormatted = stay
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(stay.price) / 300)
    : "";

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <SlideDown>
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mt-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  {stay?.type || "Stay"}
                </span>
                {stay && (
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    * {stay.rating} {t("details.rating")}
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-textDark leading-tight">
                {stay?.name || "Loading..."}
              </h1>
              <p className="mt-3 text-gray-700 text-lg md:text-xl">
                {stay?.location}
              </p>
              <p className="mt-6 text-gray-700 text-lg md:text-xl max-w-3xl">
                {stay?.description}
              </p>

              {stay && (
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="bg-white/80 backdrop-blur px-4 py-3 rounded-2xl shadow-md border border-white/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-xs text-gray-500">{t("details.priceFrom")}</p>
                    <p className="text-lg font-bold text-primary">
                      {priceFormatted}{t("cards.perNight")}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur px-4 py-3 rounded-2xl shadow-md border border-white/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-xs text-gray-500">{t("details.bestFor")}</p>
                    <p className="text-lg font-semibold text-textDark">
                      {t("details.couplesFamilies")}
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur px-4 py-3 rounded-2xl shadow-md border border-white/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-xs text-gray-500">{t("details.highlights")}</p>
                    <p className="text-lg font-semibold text-textDark">
                      {t("details.scenicViews")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
              {stay && (
                <img
                  src={stay.images[0]}
                  alt={stay.name}
                  className="rounded-3xl shadow-2xl w-full h-[420px] object-cover"
                />
              )}
            </div>
          </div>
        </div>
        </section>
      </SlideDown>

      {/* Gallery & Details */}
      <SlideDown>
        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {loading && <p className="text-gray-600">{t("details.loadingStay")}</p>}
          {!loading && stay && (
            <>
              <StayGallery images={stay.images} />

              <div className="mt-10 bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-textDark mb-3">
                  {t("details.whyLove")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {stay.highlights.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10 transition-all duration-500 hover:-translate-y-1 hover:bg-primary/10 hover:shadow-lg"
                    >
                      <span className="mt-1 text-primary">-</span>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-textDark mt-10 mb-4">
                {t("details.amenities")}
              </h2>
              <StayAmenities />

              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <h3 className="text-xl font-bold text-textDark">
                    {t("details.houseRules")}
                  </h3>
                  <p className="mt-3 text-gray-600">
                    {t("details.houseRulesDesc")}
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <h3 className="text-xl font-bold text-textDark">
                    {t("details.cancellation")}
                  </h3>
                  <p className="mt-3 text-gray-600">
                    {t("details.cancellationDesc")}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6 h-fit flex flex-col gap-5 sticky top-24 border border-gray-100 transition-all duration-500 hover:shadow-2xl">
          {stay && (
            <>
              {paymentStatus && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm border ${
                    paymentStatus === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  {paymentStatus === "success" ? t("details.paymentSuccess") : t("details.paymentCancel")}
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">
                  {priceFormatted}
                  {t("cards.perNight")}
                </p>
                <span className="text-sm text-gray-500">* {stay.rating}</span>
              </div>

              <form onSubmit={submitBooking} className="space-y-3">
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
                  placeholder={t("details.address")}
                  value={form.address}
                  onChange={handleChange("address")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
                <input
                  type="text"
                  placeholder={t("details.city")}
                  value={form.city}
                  onChange={handleChange("city")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
                <input
                  type="text"
                  placeholder={t("details.country")}
                  value={form.country}
                  onChange={handleChange("country")}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
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
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full hover:opacity-90 transition disabled:opacity-60"
                >
                  {status.state === "loading" ? t("details.redirecting") : t("details.payDeposit")}
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

              <div className="text-xs text-gray-500">
                {t("details.depositHint")}
              </div>
            </>
          )}
        </div>
        </section>
      </SlideDown>

      {relatedStays.length > 0 && (
        <SlideDown>
          <section className="max-w-7xl mx-auto px-6 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-textDark">
                {t("details.similarStays")}
              </h2>
              <Link to="/stays" className="text-primary font-semibold">
                {t("details.viewAll")}
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
              {relatedStays.map((item) => (
                <StayCard key={item.id} stay={item} />
              ))}
            </div>
          </section>
        </SlideDown>
      )}

      <Footer />
    </>
  );
};

export default StayDetails;

