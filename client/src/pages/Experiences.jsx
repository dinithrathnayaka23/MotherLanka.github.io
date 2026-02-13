import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ExperienceCard from "../components/experiences/ExperienceCard";
import ExperienceFilter from "../components/experiences/ExperienceFilter";
import { apiGet } from "../utils/api";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const Experiences = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState("All");
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet("/api/experiences")
      .then((data) => {
        if (active) setExperiences(data);
      })
      .catch(() => {
        if (active) setError(t("pages.experiences.loadError"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  const categories = useMemo(() => {
    const unique = new Set(experiences.map((exp) => exp.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [experiences]);

  const filtered =
    selected === "All"
      ? experiences
      : experiences.filter((exp) => exp.category === selected);

  return (
    <>
      <Navbar />

      <SlideDown>
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-24">
          <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-textDark leading-tight">
              {t("pages.experiences.titlePrefix")}{" "}
              <span className="text-primary">{t("pages.experiences.titleHighlight")}</span>
            </h1>
            <p className="mt-4 text-gray-700 text-lg md:text-xl max-w-3xl">
              {t("pages.experiences.subtitle")}
            </p>
          </div>
        </section>
      </SlideDown>

      <SlideDown>
        <section className="max-w-7xl mx-auto px-6 py-16">
          <ExperienceFilter
            selected={selected}
            setSelected={setSelected}
            categories={categories}
          />

          {loading && <p className="text-gray-600">{t("pages.experiences.loading")}</p>}
          {!loading && error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          )}
        </section>
      </SlideDown>

      <Footer />
    </>
  );
};

export default Experiences;
