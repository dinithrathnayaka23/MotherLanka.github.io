import { useLanguage } from "../../context/LanguageContext";

const defaultCategories = [
  "All",
  "Ancient cities and Heritage",
  "Nature and Wildlife",
  "Hill Country and Scenic",
  "Beaches and Coastal",
];

const DestinationFilter = ({ selected, setSelected, categories }) => {
  const { t } = useLanguage();
  const items = categories?.length ? categories : defaultCategories;
  const allLabel = t("filters.all");

  return (
    <div className="mb-6 md:mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-3 md:mb-4">
        <h3 className="text-xs md:text-sm uppercase tracking-widest text-gray-500">
          {t("filters.filterByCategory")}
        </h3>
        <span className="hidden md:inline text-xs text-gray-400">
          {selected === "All" ? t("filters.allDestinations") : selected}
        </span>
      </div>

      <div className="md:hidden relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {items.map((category) => (
            <button
              key={category}
              onClick={() => setSelected(category)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                ${
                  selected === category
                    ? "bg-primary text-white shadow"
                    : "bg-white text-textDark border border-gray-200"
                }`}
            >
              {category === "All" ? allLabel : category}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent"></div>
      </div>

      <div className="hidden md:block relative">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {items.map((category) => (
            <button
              key={category}
              onClick={() => setSelected(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm
                ${
                  selected === category
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "bg-white text-textDark border border-gray-200 hover:border-primary hover:shadow-md"
                }`}
            >
              {category === "All" ? allLabel : category}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default DestinationFilter;
