import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import StayCard from "../components/stays/StayCard";
import StayFilter from "../components/stays/StayFilter";
import { apiGet } from "../utils/api";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const Stays = () => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState("All");
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet("/api/stays")
      .then((data) => {
        if (active) setStays(data);
      })
      .catch(() => {
        if (active) setError(t("pages.stays.loadError"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  const availableTypes = useMemo(() => {
    const types = new Set(stays.map((stay) => stay.type).filter(Boolean));
    return ["All", ...Array.from(types)];
  }, [stays]);

  const filteredStays =
    selectedType === "All" ? stays : stays.filter((stay) => stay.type === selectedType);

  return (
    <>
      <Navbar />

      <SlideDown>
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-24">
          <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-textDark leading-tight">
              {t("pages.stays.titlePrefix")}{" "}
              <span className="text-primary">{t("pages.stays.titleHighlight")}</span>
            </h1>
            <p className="mt-4 text-gray-700 text-lg md:text-xl max-w-3xl">
              {t("pages.stays.subtitle")}
            </p>
          </div>
        </section>
      </SlideDown>

      <SlideDown>
        <section className="max-w-7xl mx-auto px-6 py-16">
          <StayFilter
            selected={selectedType}
            setSelected={setSelectedType}
            types={availableTypes}
          />

          {loading && <p className="text-gray-600">{t("pages.stays.loading")}</p>}
          {!loading && error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
              {filteredStays.map((stay) => (
                <StayCard key={stay.id} stay={stay} />
              ))}
            </div>
          )}
        </section>
      </SlideDown>

      <Footer />
    </>
  );
};

export default Stays;
