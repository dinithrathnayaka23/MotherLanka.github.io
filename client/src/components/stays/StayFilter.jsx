import { useLanguage } from "../../context/LanguageContext";

const StayFilter = ({ selected, setSelected, types }) => {
  const { t } = useLanguage();
  const items = types?.length ? types : ["All", "Hotel", "Resort", "Homestay", "Eco Lodge"];
  const allLabel = t("filters.all");

  return (
    <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
      {items.map((type) => (
        <button
          key={type}
          onClick={() => setSelected(type)}
          className={`px-5 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 shadow-sm
            ${
              selected === type
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "bg-white text-textDark border border-gray-300 hover:border-primary hover:shadow-md"
            }`}
        >
          {type === "All" ? allLabel : type}
        </button>
      ))}
    </div>
  );
};

export default StayFilter;
