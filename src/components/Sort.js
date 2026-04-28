import React from "react";
import styled from "styled-components";
import { BsFillGridFill, BsList } from "react-icons/bs";
import { useFilterContext } from "../context/filter_context";

const Sort = () => {
  const { filter_products, grid_view, setGridView, setListView, sorting } = useFilterContext();

  return (
    <Wrapper>
      <div className="view-toggle">
        <button className={grid_view ? "active sort-btn" : "sort-btn"} onClick={setGridView}>
          <BsFillGridFill className="icon" />
        </button>

        <button className={!grid_view ? "active sort-btn" : "sort-btn"} onClick={setListView}>
          <BsList className="icon" />
        </button>
      </div>

      <div className="result-copy">
        <strong>{filter_products.length}</strong>
        <span>products available</span>
      </div>

      <div className="sort-selection">
        <select name="sort" id="sort" className="sort-selection--style" onChange={sorting}>
          <option value="lowest">Price: Lowest First</option>
          <option value="highest">Price: Highest First</option>
          <option value="a-z">Name: A to Z</option>
          <option value="z-a">Name: Z to A</option>
        </select>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  background: rgba(255, 250, 243, 0.96);
  border: 1px solid #eadfce;
  border-radius: 1.8rem;
  padding: 1.2rem 1.4rem;
  box-shadow: 0 10px 22px rgba(61, 41, 22, 0.05);

  .view-toggle {
    display: flex;
    gap: 0.6rem;
  }

  .sort-btn {
    width: 4.1rem;
    height: 4.1rem;
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    display: grid;
    place-items: center;
    cursor: pointer;
    background: #fff;
    transition: all 0.2s ease;
  }

  .sort-btn:hover,
  .sort-btn.active {
    background: #231f20;
    color: #fff;
    border-color: #231f20;
  }

  .icon {
    font-size: 1.6rem;
  }

  .result-copy {
    display: flex;
    align-items: baseline;
    gap: 0.55rem;
    color: #685d54;
  }

  .result-copy strong {
    font-size: 1.9rem;
    color: #231f20;
  }

  .sort-selection--style {
    padding: 1rem 1.2rem;
    cursor: pointer;
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    background: #fff;
    font-size: 1.35rem;
    color: #2d241e;
    min-width: 20rem;
  }

  .sort-selection--style:focus {
    outline: none;
    border-color: #cf6d3f;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .sort-selection,
    .sort-selection--style {
      width: 100%;
    }

    .sort-selection--style {
      min-width: 0;
    }
  }
`;

export default Sort;
