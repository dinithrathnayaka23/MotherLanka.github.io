import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DestinationGallery from "../components/destinations/DestinationGallery";
import DestinationInfo from "../components/destinations/DestinationInfo";
import EmptyState from "../components/ui/EmptyState";
import { apiGet } from "../utils/api";
import SlideDown from "../components/ui/SlideDown";
import { useLanguage } from "../context/LanguageContext";

const DestinationDetails = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet(`/api/destinations/${id}`)
      .then((data) => {
        if (active) setDestination(data);
      })
      .catch(() => {
        if (active) setError(t("details.destinationNotFound"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, t]);

  if (!loading && (error || !destination)) {
    return (
      <>
        <Navbar />
        <SlideDown>
          <EmptyState
            title={t("details.destinationNotFound")}
            description={t("details.destinationNotFoundDesc")}
            actionLabel={t("pages.notFound.exploreDestinations")}
            actionTo="/destinations"
          />
        </SlideDown>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <SlideDown>
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-textDark">
            {destination?.name || t("pages.destinations.loading")}
          </h1>
          {destination && (
            <p className="mt-4 text-gray-700 max-w-2xl text-lg">
              {destination.category} • {destination.region}
            </p>
          )}
        </div>
        </section>
      </SlideDown>

      {/* Content */}
      <SlideDown>
        <section className="max-w-7xl mx-auto px-6 py-16">
        {loading && <p className="text-gray-600">{t("details.loadingDestination")}</p>}
        {!loading && destination && (
          <>
            <DestinationGallery images={destination.images || []} />
            <DestinationInfo destination={destination} />
          </>
        )}
        </section>
      </SlideDown>

      <Footer />
    </>
  );
};

export default DestinationDetails;
