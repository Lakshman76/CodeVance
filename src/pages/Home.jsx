import React from "react";
import HeroSection from "../components/Herosection";
import About from "../components/About";
import FeaturesSection from "../components/FeatureSection";
import CreatorsSection from "../components/CreatorSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <div id="hero">
        <HeroSection />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="creators">
        <CreatorsSection />
      </div>
      <Footer />
    </>
  );
}

export default Home;
