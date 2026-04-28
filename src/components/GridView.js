import React from "react";
import styled from "styled-components";
import Product from "./Product";

const GridView = ({ products }) => {
  return (
    <Wrapper>
      <div className="product-grid">
        {products.map((curElem) => (
          <Product key={curElem.id} {...curElem} />
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .product-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .product-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .product-grid {
      grid-template-columns: 1fr;
      gap: 1.6rem;
    }
  }
`;

export default GridView;
