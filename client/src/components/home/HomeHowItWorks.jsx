import SectionTitle from "../ui/SectionTitle";
import { useLanguage } from "../../context/LanguageContext";

const steps = [
  {
    titleKey: "step1Title",
    descriptionKey: "step1Description",
    icon: "fa-compass",
  },
  {
    titleKey: "step2Title",
    descriptionKey: "step2Description",
    icon: "fa-route",
  },
  {
    titleKey: "step3Title",
    descriptionKey: "step3Description",
    icon: "fa-shield-heart",
  },
];

const HomeHowItWorks = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-bgLight py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          eyebrow={t("home.howItWorks.eyebrow")}
          title={t("home.howItWorks.title")}
          subtitle={t("home.howItWorks.subtitle")}
          align="center"
        />

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <i className={`fas ${step.icon}`}></i>
              </div>
              <h3 className="mt-6 text-xl font-bold text-textDark">
                {t(`home.howItWorks.${step.titleKey}`)}
              </h3>
              <p className="mt-3 text-gray-600">
                {t(`home.howItWorks.${step.descriptionKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHowItWorks;
