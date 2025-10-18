import Footer from "../components/Footer";
import Header from "../components/Header";
import DeepDiveSection from "./components/DeepDiveSection";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import NewsletterSection from "./components/NewsletterSection";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="container">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <DeepDiveSection />
        <NewsletterSection />
      </div>
      <Footer />
    </div>
  );
}
