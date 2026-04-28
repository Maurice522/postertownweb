import styled from "styled-components";
import RotatingText from "./RotatingText";
import Product from "./Product";

const FeatureProduct = () => {
  const productList = [
    {
      id: "poster-006",
      name: "Giyu Tomoioka",
      image: "images/giyu.jpg",
      price: 999,
      category: "Anime",
      stock: 15,
      color: "blue",
    },
    {
      id: "batman-001",
      name: "Batman",
      image: "images/batmanneon.jpg",
      price: 999,
      category: "DC",
      stock: 20,
      color: "black",
    },
    {
      id: "deadpool-001",
      name: "Deadpool",
      image: "images/deadpool.jpg",
      price: 999,
      category: "Marvel",
      stock: 25,
      color: "red",
    },
    {
      id: "movie-001",
      name: "Optimus Prime",
      image: "images/optimusprime.jpg",
      price: 999,
      category: "Movie",
      stock: 12,
      color: "blue",
    },
    {
      id: "car-001",
      name: "GT3 RS",
      image: "images/gt3rswhite.jpg",
      price: 999,
      category: "Car",
      stock: 8,
      color: "white",
    },
    {
      id: "games-001",
      name: "Modern Warfare 2",
      image: "images/mw2.jpg",
      price: 999,
      category: "Games",
      stock: 20,
      color: "black",
    },
  ];

  return (
    <Wrapper className="section">
      <div className="container">
        <div className="common-heading">
          <RotatingText
            texts={["Anime", "Artist", "Cars", "Cartoon", "DC", "Games", "Marvel", "Movies", "Scenery", "Sports"]}
            mainClassName="feature-rotator"
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
            <Product key={curElem.id} {...curElem} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 9rem 0;
  background: linear-gradient(180deg, #f8f5ef 0%, #f1e7da 100%);

  .container {
    max-width: 132rem;
  }

  .common-heading {
    display: flex;
    justify-content: center;
    margin-bottom: 4rem;
  }

  .feature-rotator {
    width: auto;
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }

  .feature-rotator .text-rotate {
    background: transparent;
    width: auto;
    padding: 0;
    justify-content: center;
  }

  .feature-rotator .text-rotate-word,
  .feature-rotator .text-rotate-element,
  .feature-rotator .text-rotate-space {
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

export default FeatureProduct;
