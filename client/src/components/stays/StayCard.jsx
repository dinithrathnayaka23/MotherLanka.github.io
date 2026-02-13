import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const StayCard = ({ stay }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const usdPrice = Number(stay.price) / 300;
  const priceFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdPrice);

  return (
    <div
      onClick={() => navigate(`/stays/${stay.id}`)}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-60 overflow-hidden">
        <img
          src={stay.image}
          alt={stay.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
        <span className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-white text-sm px-3 py-1 rounded-full shadow">
          {stay.type}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-lg md:text-xl font-semibold text-textDark">{stay.name}</h3>
        <p className="text-sm md:text-base text-gray-600">{stay.location}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
            {priceFormatted}
            {t("cards.perNight")}
          </span>
          <span className="text-sm text-gray-500">★ {stay.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default StayCard;
