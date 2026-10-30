import React from "react";
import styled from "styled-components";
import { BsFillGridFill, BsList } from "react-icons/bs";
import SortMenu from "./SortMenu";
import { useFilterContext } from "../context/filter_context";

const Sort = () => {
  const { filter_products, grid_view, setGridView, setListView, sorting, sorting_value } = useFilterContext();

  return (
    <Wrapper>
      <div className="view-toggle">
        <button
          type="button"
          className={grid_view ? "active sort-btn" : "sort-btn"}
          onClick={setGridView}
          aria-label="Grid view"
          aria-pressed={grid_view}>
          <BsFillGridFill className="icon" />
        </button>

        <button
          type="button"
          className={!grid_view ? "active sort-btn" : "sort-btn"}
          onClick={setListView}
          aria-label="List view"
          aria-pressed={!grid_view}>
          <BsList className="icon" />
        </button>
      </div>

      <div className="result-copy">
        <strong>{filter_products.length}</strong>
        <span>{filter_products.length === 1 ? "product" : "products"} available</span>
      </div>

      <div className="sort-selection">
        <label className="sort-label" htmlFor="sort">
          Sort by
        </label>
        <SortMenu value={sorting_value} onChange={(value) => sorting({ target: { value } })} />
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

  .sort-selection {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .sort-label {
    color: #8a7c70;
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .sort-selection {
      width: 100%;
    }
  }
`;

export default Sort;
