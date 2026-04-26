import FeatureProduct from "./components/FeatureProduct";
import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import Trending from "./components/Trending";
import Trusted from "./components/Trusted";
import Collection from "./components/Collection";
import CollectionDBZ from "./components/CollectionDBZ";
import FeatureProductLandscape from "./components/FeatureProductLandscape";

const Home = () => {
  const data = {
    name: "Poster Town",
  };

  return (
    <>
      <HeroSection myData={data} />
      <Collection/>
      <FeatureProduct />
      <CollectionDBZ/>
      <Services />
      <FeatureProductLandscape/>
    </>
  );
};

export default Home;
