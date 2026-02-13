import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-r from-primary to-secondary py-12 mt-24 text-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-extrabold">MotherLanka</h2>
          <p className="mt-2 text-white/80">{t("footer.tagline")}</p>
        </div>

        <div className="flex flex-col items-center gap-3 text-sm">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/destinations" className="hover:text-accent transition-colors">
              {t("nav.destinations")}
            </Link>
            <Link to="/stays" className="hover:text-accent transition-colors">
              {t("nav.stays")}
            </Link>
            <Link to="/experiences" className="hover:text-accent transition-colors">
              {t("nav.experiences")}
            </Link>
            <Link to="/about" className="hover:text-accent transition-colors">
              {t("nav.about")}
            </Link>
            <Link to="/contact" className="hover:text-accent transition-colors">
              {t("nav.contact")}
            </Link>
          </div>
          <div className="flex gap-5 text-xl">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent transition-colors"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <div className="text-center md:text-right text-white/80 text-sm">
          <p>{t("footer.crafted")}</p>
          <p className="mt-1">&copy; 2026 MotherLanka</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
