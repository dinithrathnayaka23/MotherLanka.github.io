import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DestinationCard from "../components/destinations/DestinationCard";
import DestinationFilter from "../components/destinations/DestinationFilter";
import { apiGet } from "../utils/api";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const Destinations = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet("/api/destinations")
      .then((data) => {
        if (active) setDestinations(data);
      })
      .catch(() => {
        if (active) setError(t("pages.destinations.loadError"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  const categories = useMemo(() => {
    const unique = new Set(destinations.map((d) => d.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [destinations]);

  const filteredDestinations =
    selectedCategory === "All"
      ? destinations
      : destinations.filter((destination) => destination.category === selectedCategory);

  return (
    <>
      <Navbar />

      <SlideDown>
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-24">
          <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-textDark leading-tight">
              {t("pages.destinations.titlePrefix")}{" "}
              <span className="text-primary">{t("pages.destinations.titleHighlight")}</span>{" "}
              {t("pages.destinations.titleSuffix")}
            </h1>
            <p className="mt-4 text-gray-700 text-lg md:text-xl max-w-3xl">
              {t("pages.destinations.subtitle")}
            </p>
          </div>
        </section>
      </SlideDown>

      <SlideDown>
        <section className="max-w-7xl mx-auto px-6 py-16">
          <DestinationFilter
            selected={selectedCategory}
            setSelected={setSelectedCategory}
            categories={categories}
          />

          {loading && <p className="text-gray-600">{t("pages.destinations.loading")}</p>}
          {!loading && error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}
        </section>
      </SlideDown>

      <Footer />
    </>
  );
};

export default Destinations;
