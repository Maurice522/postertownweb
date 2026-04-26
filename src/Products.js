import styled from "styled-components";
import FilterSection from "./components/FilterSection";
import ProductList from "./components/ProductList";
import Sort from "./components/Sort";
import { useFilterContext } from "./context/filter_context";

const Products = () => {
  return (
    <Wrapper>
      <div className="container grid grid-filter-column">
        <div className="filter-section">
          <FilterSection />
        </div>

        <section className="product-view--sort">
          <div className="sort-filter">
            <Sort />
          </div>
          <div className="main-product">
            <ProductList />
          </div>
        </section>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .container {
    max-width: 150rem;
    width: 100%;
    margin: 0 auto;
  }

  .grid-filter-column {
    grid-template-columns: 0.18fr 1fr;
  }

  .filter-section {
    position: sticky;
    top: 80px;
    height: calc(100vh - 100px);
    overflow-y: auto;
  }

  .main-product {
    height: calc(100vh - 150px);
    overflow-y: auto;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .grid-filter-column {
      grid-template-columns: 1fr;
    }
    .filter-section, .main-product {
      position: static;
      height: auto;
    }
  }
`;

export default Products;