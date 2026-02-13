import { useLanguage } from "../../context/LanguageContext";

const stats = [
  { value: "150+", key: "curatedDestinations" },
  { value: "1,200+", key: "verifiedStays" },
  { value: "4.8/5", key: "travelerRating" },
  { value: "24/7", key: "localSupport" },
];

const HomeStats = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
            <p className="mt-2 text-sm text-gray-600">{t(`home.stats.${stat.key}`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeStats;
