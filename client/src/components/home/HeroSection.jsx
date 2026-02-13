import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/vecteezy_aerial-top-view-drone-4k-footage-of-koggala-beach-waves-and_24487105.mov"   // 👉 put video in public folder
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay (dark + gradient) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/50 to-accent/40"></div>
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              {t("hero.titleLine1")}{" "}
              <span className="text-accent">Sri Lanka</span>
              <br />
              {t("hero.titleLine2")}
            </h1>

            <p className="mt-6 text-white/90 max-w-lg text-lg md:text-xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/destinations"
                className="bg-gradient-to-r from-primary to-secondary text-white px-7 py-3 rounded-full shadow-xl hover:scale-105 transition-transform duration-300 font-semibold"
              >
                {t("hero.startExploring")}
              </Link>

              <Link
                to="/about"
                className="border-2 border-white text-white px-7 py-3 rounded-full hover:bg-white hover:text-primary transition-colors duration-300 font-semibold"
              >
                {t("hero.learnMore")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
