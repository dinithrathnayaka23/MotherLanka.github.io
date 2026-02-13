import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fallbackImage = "/adams-peak.jpg";

  const handleImageError = (event) => {
    if (!event?.currentTarget) return;
    if (event.currentTarget.src.endsWith(fallbackImage)) return;
    event.currentTarget.src = fallbackImage;
  };

  const handleExplore = (event) => {
    event.stopPropagation();
    navigate(`/destinations/${destination.id}`);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 group cursor-pointer">
      <div className="relative h-60 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-white text-sm px-3 py-1 rounded-full shadow">
          {destination.category}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-semibold text-textDark">
          {destination.name}
        </h3>

        <p className="text-gray-700 text-sm md:text-base mt-2 line-clamp-2">
          {destination.description}
        </p>

        <button
          onClick={handleExplore}
          className="mt-4 inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-medium shadow hover:scale-105 transition-transform duration-300"
        >
          {t("cards.explore")} →
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
