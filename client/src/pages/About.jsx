import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FadeIn from "../components/ui/FadeIn";
import SpotlightCard from "../components/ui/spotlight";

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1552055568-e9943cd2a08f",
      alt: "Sri Lanka Beach",
    },
    {
      url: "https://travelrebels.com/wp-content/uploads/2018/06/anuradhapura-sunset.jpg",
      alt: "Sri Lanka Temple",
    },
    {
      url: "https://adventuretravel.aggressor.com/wp-content/uploads/2023/05/ASL-Lodge17-1024x685.jpg",
      alt: "Sri Lanka Elephants",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40"></div>

        <FadeIn>
          <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              Sri Lanka — The Pearl of the Indian Ocean
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90">
              Ancient civilizations, golden beaches, misty mountains, and warm
              smiles.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* INTRO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <FadeIn>
          <div>
            <span className="text-primary font-semibold uppercase tracking-wide">
              About the Island
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">
              A Small Island with a Big Story
            </h2>
            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              Sri Lanka is an island rich in history, culture, and natural
              beauty. From ancient kingdoms to colonial forts, every corner
              tells a story spanning over 2,500 years.
            </p>
          </div>
        </FadeIn>

        {/* ✅ MAP WITH SPOTLIGHT */}
        <FadeIn>
          <SpotlightCard>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/1686_Mallet_Map_of_Ceylon_or_Sri_Lanka_%28Taprobane%29_-_Geographicus_-_Taprobane-mallet-1686.jpg/960px-1686_Mallet_Map_of_Ceylon_or_Sri_Lanka_%28Taprobane%29_-_Geographicus_-_Taprobane-mallet-1686.jpg"
              alt="Sri Lanka Map"
              className="h-60 w-full object-cover rounded-3xl shadow-xl border border-primary/30"
            />
          </SpotlightCard>
        </FadeIn>
      </section>

      {/* CULTURE */}
      <section className="bg-bgLight py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <img
              src="https://mysrilankatraveltourism.wordpress.com/wp-content/uploads/2019/03/heritage..png"
              alt="Culture"
              className="rounded-3xl shadow-xl border border-primary/20"
            />
          </FadeIn>

          <FadeIn>
            <div>
              <span className="text-primary font-semibold uppercase tracking-wide">
                Culture & Heritage
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold">
                Living Traditions
              </h2>
              <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                Buddhism, Hinduism, Islam, and Christianity blend into a rich
                cultural fabric expressed through festivals, dances, and sacred
                cities.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* NATURE */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <FadeIn>
          <div>
            <span className="text-primary font-semibold uppercase tracking-wide">
              Nature & Wildlife
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">
              A Biodiversity Hotspot
            </h2>
            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              Leopards, elephants, whales, rainforests, waterfalls, and national
              parks exist within a few hours of travel.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <img
            src="https://blog.bhlankatours.com/wp-content/uploads/2024/09/Best-Wildlife-Safaris-of-Sri-Lanka.jpg"
            alt="Wildlife"
            className="rounded-3xl shadow-xl border border-primary/20"
          />
        </FadeIn>
      </section>

      {/* WHY VISIT */}
      <section className="py-28 bg-bgLight">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Visit Sri Lanka?
            </h2>
          </FadeIn>

          <FadeIn>
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                ["Friendly People", "fa-heart"],
                ["Diverse Landscapes", "fa-earth-asia"],
                ["Rich History", "fa-landmark"],
                ["Unique Experiences", "fa-compass"],
              ].map(([title, icon], i) => (
                <div
                  key={i}
                  className="bg-white px-8 py-10 rounded-3xl shadow-lg border-2 border-blue-500/40 hover:border-blue-500 hover:-translate-y-2 transition"
                >
                  <i className={`fas ${icon} text-2xl text-blue-600`}></i>
                  <p className="mt-4 font-semibold">{title}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHY MOTHERLANKA EXISTS */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why MotherLanka Exists
            </h2>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              MotherLanka is built to help travelers explore Sri Lanka
              intelligently — with curated destinations, meaningful experiences,
              and future AI-powered trip planning.
            </p>

            <a
              href="/destinations"
              className="inline-block mt-10 bg-primary text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Explore Sri Lanka
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
