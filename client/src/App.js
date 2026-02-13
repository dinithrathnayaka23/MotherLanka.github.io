import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatbot from "./components/chatbot/Chatbot";
import ScrollToTop from "./components/layout/ScrollToTop";
import Loader from "./components/ui/Loader";
import { LanguageProvider } from "./context/LanguageContext";

const Home = lazy(() => import("./pages/Home"));
const Destinations = lazy(() => import("./pages/Destinations"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DestinationDetails = lazy(() => import("./pages/DestinationDetails"));
const Stays = lazy(() => import("./pages/Stays"));
const StayDetails = lazy(() => import("./pages/StayDetails"));
const Experiences = lazy(() => import("./pages/Experiences"));
const ExperienceDetails = lazy(() => import("./pages/ExperienceDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        {/* Global UI */}
        <Chatbot />

        {/* Page Routes */}
        <Suspense fallback={<Loader label="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/stays" element={<Stays />} />
            <Route path="/stays/:id" element={<StayDetails />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/:id" element={<ExperienceDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}

export default App;
