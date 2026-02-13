import { useLanguage } from "../../context/LanguageContext";

const ExperienceFilter = ({ selected, setSelected, categories }) => {
  const { t } = useLanguage();
  const items = categories?.length
    ? categories
    : ["All", "Wildlife", "Adventure", "Beach", "Culture", "Wellness"];
  const allLabel = t("filters.all");

  return (
    <div className="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
      {items.map((category) => (
        <button
          key={category}
          onClick={() => setSelected(category)}
          className={`px-5 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 shadow-sm
            ${
              selected === category
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "bg-white text-textDark border border-gray-300 hover:border-primary hover:shadow-md"
            }`}
        >
          {category === "All" ? allLabel : category}
        </button>
      ))}
    </div>
  );
};

export default ExperienceFilter;
