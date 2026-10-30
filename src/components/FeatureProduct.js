import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";
import Product from "./Product";
import { useProductContext } from "../context/productcontex";

const FeatureProduct = () => {
  const { products } = useProductContext();
  const isBestseller = (product) => (product.badges || product.tags || []).some((badge) => /bestseller/i.test(String(badge)));
  const portrait = products.filter((product) => product.orientation !== "landscape");
  const productList = [
    ...portrait.filter((product) => product.featured || isBestseller(product)),
    ...portrait.filter((product) => !(product.featured || isBestseller(product))),
  ].slice(0, 6);

  return (
    <Wrapper className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Featured posters</span>
            <h2>Picks from every fandom.</h2>
            <p>Anime, comics, movies, games and cars, all printed on 1 mm metal.</p>
          </div>
          <Link to="/products" className="section-link">
            Shop all posters <FiArrowRight />
          </Link>
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

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
    margin-bottom: 3.2rem;
  }

  .eyebrow {
    display: inline-block;
    color: #8a5c43;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .section-head h2 {
    color: #231f20;
    font-size: clamp(3rem, 3.6vw, 4.2rem);
    font-weight: 800;
    line-height: 1.12;
    text-transform: none;
    margin-bottom: 0.8rem;
  }

  .section-head p {
    color: #6a5e54;
    font-size: 1.6rem;
    line-height: 1.7;
  }

  .section-link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    flex-shrink: 0;
    color: #cf6d3f;
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
    transition: gap 0.2s ease;
  }

  .section-link:hover {
    gap: 1rem;
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

    .section-head {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 2.4rem;
    }

    .product-grid {
      grid-template-columns: 1fr;
      gap: 1.6rem;
    }
  }
`;

export default FeatureProduct;
