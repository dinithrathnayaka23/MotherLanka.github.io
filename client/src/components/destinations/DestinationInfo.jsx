import { useLanguage } from "../../context/LanguageContext";

const DestinationInfo = ({ destination }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-16 grid md:grid-cols-3 gap-12">
      {/* Main Info */}
      <div className="md:col-span-2">
        <h2 className="text-3xl md:text-4xl font-bold text-textDark">
          {t("details.aboutDestination", { name: destination.name })}
        </h2>

        <p className="text-gray-700 mt-6 leading-relaxed text-lg">
          {destination.description}
        </p>

        {/* Info Cards */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <InfoItem icon="fa-location-dot" label={destination.region} />
          <InfoItem icon="fa-cloud-sun" label={destination.weather} />
          <InfoItem icon="fa-clock" label={destination.duration} />
          <InfoItem icon="fa-mountain-sun" label={destination.category} />
        </div>
      </div>

      {/* Side Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 h-fit border border-primary/20">
        <h3 className="font-semibold text-xl mb-3 text-textDark">
          {t("details.bestTimeToVisit")}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {destination.bestTime}
        </p>

        <a
          href="/contact"
          className="mt-8 w-full inline-flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full font-semibold tracking-wide hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
        >
          {t("details.planMyTrip")}
        </a>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label }) => (
  <div className="group bg-white/80 backdrop-blur-lg border border-primary/20 rounded-2xl shadow-lg p-5 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl hover:border-primary transition-all duration-300">
    
    {/* Icon Circle */}
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl group-hover:bg-primary group-hover:text-white transition">
      <i className={`fas ${icon}`}></i>
    </div>

    {/* Label */}
    <span className="mt-4 text-sm font-semibold text-textDark">
      {label}
    </span>
  </div>
);

export default DestinationInfo;
