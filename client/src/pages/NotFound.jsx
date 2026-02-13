import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <SlideDown>
        <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="text-center px-6">
            <p className="text-sm font-semibold text-primary">404</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-textDark">
              {t("pages.notFound.title")}
            </h1>
            <p className="mt-4 text-gray-600 max-w-md mx-auto">
              {t("pages.notFound.description")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="md">{t("pages.notFound.backHome")}</Button>
              </Link>
              <Link to="/destinations">
                <Button variant="secondary" size="md">
                  {t("pages.notFound.exploreDestinations")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </SlideDown>
      <Footer />
    </>
  );
};

export default NotFound;
