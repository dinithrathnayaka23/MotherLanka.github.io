import SectionTitle from "../ui/SectionTitle";
import { useLanguage } from "../../context/LanguageContext";

const testimonials = [
  { name: "Amaya S.", key: "quote1" },
  { name: "Jacob L.", key: "quote2" },
  { name: "Nisha P.", key: "quote3" },
];

const HomeTestimonials = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          eyebrow={t("home.testimonials.eyebrow")}
          title={t("home.testimonials.title")}
          subtitle={t("home.testimonials.subtitle")}
          align="center"
        />

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star text-sm"></i>
                ))}
              </div>
              <p className="mt-5 text-gray-600">"{t(`home.testimonials.${item.key}`)}"</p>
              <p className="mt-6 font-semibold text-textDark">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
