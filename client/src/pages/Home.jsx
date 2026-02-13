import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import ExperienceSelector from "../components/home/ExperienceSelector";
import FeaturedDestinations from "../components/home/FeatureDestinations";
import ChatbotButton from "../components/chatbot/ChatbotButton";
import HomeStats from "../components/home/HomeStats";
import HomeHowItWorks from "../components/home/HomeHowItWorks";
import HomeTestimonials from "../components/home/HomeTestimonials";
import HomeNewsletter from "../components/home/HomeNewsletter";
import SlideDown from "../components/ui/SlideDown";

const Home = () => {
  return (
    <>
      <Navbar />
      <SlideDown>
        <HeroSection />
      </SlideDown>
      <SlideDown>
        <HomeStats />
      </SlideDown>
      <SlideDown>
        <ExperienceSelector />
      </SlideDown>
      <SlideDown>
        <FeaturedDestinations />
      </SlideDown>
      <SlideDown>
        <HomeHowItWorks />
      </SlideDown>
      <SlideDown>
        <HomeTestimonials />
      </SlideDown>
      <SlideDown>
        <HomeNewsletter />
      </SlideDown>
      <ChatbotButton onClick={() => window.dispatchEvent(new Event("open-chatbot"))} />
      <Footer />
    </>
  );
};

export default Home;
