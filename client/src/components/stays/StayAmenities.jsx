import { useLanguage } from "../../context/LanguageContext";

const amenities = [
  { icon: "fa-wifi", key: "wifi" },
  { icon: "fa-utensils", key: "restaurant" },
  { icon: "fa-water-ladder", key: "pool" },
  { icon: "fa-spa", key: "spa" },
];

const StayAmenities = () => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
      {amenities.map((a, i) => (
        <div
          key={i}
          className="group flex items-center gap-3 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/30"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-105">
            <i className={`fas ${a.icon} text-lg`}></i>
          </span>
          <span className="text-sm md:text-base text-textDark font-semibold">
            {t(`amenities.${a.key}`)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StayAmenities;
