import styled from "styled-components";
import Product from "./Product";
import RotatingText from "./RotatingText";

const FeatureProductLandscape = () => {
  const productList = [
    {
      id: "poster-001",
      name: "Solo Leveling",
      image: "images/sololeveling.jpeg",
      price: 999,
      category: "Anime",
      stock: 50,
      color: "black",
    },
    {
      id: "poster-002",
      name: "Luffy Gear 5",
      image: "images/luffyland.jpg",
      price: 999,
      category: "Anime",
      stock: 30,
      color: "orange",
    },
    {
      id: "poster-004",
      name: "Demon Slayer",
      image: "images/demonslayerall.jpg",
      price: 999,
      category: "Anime",
      stock: 25,
      color: "blue",
    },
    {
      id: "poster-007",
      name: "Rengoku",
      image: "images/rengoku.jpg",
      price: 999,
      category: "Anime",
      stock: 18,
      color: "red",
    },
    {
      id: "poster-003",
      name: "Naruto Shippuden",
      image: "images/naruto.jpg",
      price: 899,
      category: "Anime",
      stock: 0,
      color: "orange",
    },
    {
      id: "poster-005",
      name: "Dragon Ball Z",
      image: "images/broly.jpg",
      price: 799,
      category: "Anime",
      stock: 40,
      color: "yellow",
    },
  ];

  return (
    <Wrapper className="section">
      <div className="container">
        <div className="common-heading">
          <RotatingText
            texts={["Landscape", "Awesome"]}
            mainClassName="landscape-rotator"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName=""
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>

        <div className="product-grid">
          {productList.map((curElem) => (
            <Product key={curElem.id} {...curElem} cardStyle="landscape" />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 9rem 0;
  background: linear-gradient(180deg, #f1e7da 0%, #f8f5ef 100%);

  .container {
    max-width: 132rem;
  }

  .common-heading {
    margin-bottom: 4rem;
    display: flex;
    justify-content: center;
  }

  .landscape-rotator {
    width: auto;
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }

  .landscape-rotator .text-rotate {
    background: transparent;
    width: auto;
    padding: 0;
    justify-content: center;
  }

  .landscape-rotator .text-rotate-word,
  .landscape-rotator .text-rotate-element,
  .landscape-rotator .text-rotate-space {
    color: #2d241e;
    font-size: clamp(3rem, 4vw, 5rem);
    font-weight: 700;
    letter-spacing: 0;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .container {
      max-width: 100%;
    }

    .product-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 6rem 0;

    .common-heading {
      margin-bottom: 3rem;
    }

    .product-grid {
      grid-template-columns: 1fr;
      gap: 1.6rem;
    }
  }
`;

export default FeatureProductLandscape;
