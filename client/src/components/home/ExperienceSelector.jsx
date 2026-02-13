import SpotlightCard from "../ui/spotlight";
import { useLanguage } from "../../context/LanguageContext";

const experiences = [
  { icon: "fa-mountain", key: "adventure" },
  { icon: "fa-umbrella-beach", key: "relax" },
  { icon: "fa-landmark", key: "culture" },
  { icon: "fa-paw", key: "wildlife" },
];

const ExperienceSelector = () => {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-textDark mb-16">
        {t("home.experienceSelector.title")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {experiences.map((exp, i) => (
          <SpotlightCard key={i}>
            <div className="relative z-10 text-center cursor-pointer">
              <i
                className={`fas ${exp.icon} text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`}
              />
              <p className="mt-5 font-semibold text-lg text-textDark">
                {t(`home.experienceSelector.${exp.key}`)}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSelector;
