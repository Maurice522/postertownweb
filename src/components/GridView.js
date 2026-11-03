import React from "react";
import styled from "styled-components";
import Product from "./Product";
import { ProductGridSkeleton } from "./Skeletons";

const GridView = ({ products, loading = false }) => {
  return (
    <Wrapper>
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <div className="product-grid">
          {products.map((curElem) => (
            <Product key={curElem.id} {...curElem} />
          ))}
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.4rem;
  }

  @media (max-width: 1320px) {
    .product-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .product-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  /* Two posters per row on phones, with a compact card; the list view shows one per
     row for anyone who wants them bigger. */
  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .product-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .product-grid .product-card .image-shell {
      height: 26rem;
      padding: 1.6rem 1rem;
    }

    .product-grid .product-card .category-badge {
      top: 0.8rem;
      right: 0.8rem;
      padding: 0.35rem 0.7rem;
      font-size: 0.9rem;
    }

    .product-grid .product-card .card-copy {
      padding: 1rem;
    }

    .product-grid .product-card .title-row {
      flex-direction: column;
      gap: 0.3rem;
    }

    .product-grid .product-card h3 {
      font-size: 1.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-grid .product-card .sub-copy {
      display: none;
    }

    .product-grid .product-card .card-actions {
      flex-direction: column;
      gap: 0.6rem;
    }

    .product-grid .product-card .card-btn {
      width: 100%;
      padding: 0.9rem 0.6rem;
      font-size: 1.2rem;
    }

    /* Loading placeholders take the same compact shape. */
    .product-grid .sk-image {
      height: 26rem;
      padding: 1.6rem 1rem;
    }

    .product-grid .sk-actions {
      grid-template-columns: 1fr;
    }
  }
`;

export default GridView;
