import FaqSection from "./components/FaqSection";
import HeroSection from "./components/HeroSection";
import HomeSeoCopy from "./components/HomeSeoCopy";

// About the store: the hero, the store's story (the same words as the home page,
// data/homeCopy.js) and the FAQ. The Cloudflare Worker serves this text to search
// engines too.
const About = () => (
  <>
    <HeroSection />
    <HomeSeoCopy />
    <FaqSection intro="Everything to know about our metal posters, delivery and offers." />
  </>
);

export default About;
