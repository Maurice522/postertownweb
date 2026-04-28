import styled from "styled-components";
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
    <Wrapper>
      <HeroSection myData={data} />
      <Collection />
      <FeatureProduct />
      <CollectionDBZ />
      <Services />
      <FeatureProductLandscape />

      <section className="page-outro">
        <div className="outro-shell">
          <span>Built for your wall</span>
          <p>Curated anime, gaming, and movie prints with a cleaner browse flow from top to footer.</p>
        </div>
      </section>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  background: linear-gradient(180deg, rgba(248, 245, 239, 0) 0%, rgba(244, 236, 224, 0.9) 100%);

  .page-outro {
    padding: 4rem 2rem 6rem;
    background: linear-gradient(180deg, rgba(244, 236, 224, 0) 0%, rgba(236, 222, 205, 0.92) 100%);
  }

  .outro-shell {
    width: min(100%, 148rem);
    margin: 0 auto;
    border-top: 1px solid rgba(138, 92, 67, 0.18);
    padding-top: 2.2rem;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
  }

  .outro-shell span {
    color: #8a5c43;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 1.15rem;
    flex-shrink: 0;
  }

  .outro-shell p {
    max-width: 68rem;
    color: #6c5d52;
    line-height: 1.8;
    text-align: right;
  }

  @media (max-width: 768px) {
    .page-outro {
      padding: 3rem 1.4rem 4rem;
    }

    .outro-shell {
      flex-direction: column;
      align-items: flex-start;
    }

    .outro-shell p {
      text-align: left;
    }
  }
`;

export default Home;
