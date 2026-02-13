import { useNavigate } from "react-router-dom";

const ExperienceCard = ({ experience }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/experiences/${experience.id}`)}
      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <span className="absolute top-4 left-4 bg-gradient-to-r from-primary to-secondary text-white text-xs px-3 py-1 rounded-full shadow">
          {experience.category}
        </span>
      </div>

      <div className="p-6">
        <h3 className="mt-2 text-lg md:text-xl font-semibold text-textDark">
          {experience.title}
        </h3>
        <p className="text-sm md:text-base text-gray-600 mt-2">{experience.short}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
            ⏱ {experience.duration}
          </span>
          <span className="text-sm font-medium text-textDark">⭐ {experience.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
