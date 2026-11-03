import React from "react";
import styled from "styled-components";
import { BsFillGridFill, BsList } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SortMenu from "./SortMenu";
import { useFilterContext } from "../context/filter_context";

// pageSize/onPageSizeChange and page/pageCount/onPageChange: shown only when the
// products page is paginated.
const Sort = ({ pageSize, pageSizeOptions = [], onPageSizeChange, page = 1, pageCount = 1, onPageChange }) => {
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

      <div className="toolbar-controls">
        {onPageChange && pageCount > 1 && (
          <div className="page-jump" aria-label="Change page">
            <button
              type="button"
              className="sort-btn"
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}>
              <FiChevronLeft className="icon" />
            </button>
            <span>
              Page <strong>{page}</strong> of {pageCount}
            </span>
            <button
              type="button"
              className="sort-btn"
              aria-label="Next page"
              disabled={page === pageCount}
              onClick={() => onPageChange(page + 1)}>
              <FiChevronRight className="icon" />
            </button>
          </div>
        )}

        {onPageSizeChange && (
          <div className="sort-selection">
            <label className="sort-label" htmlFor="page-size">
              Per page
            </label>
            <select
              id="page-size"
              className="page-size"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}>
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sort-selection">
          <label className="sort-label" htmlFor="sort">
            Sort by
          </label>
          <SortMenu value={sorting_value} onChange={(value) => sorting({ target: { value } })} />
        </div>
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

  .toolbar-controls {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    flex-wrap: wrap;
  }

  .page-jump {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #685d54;
    font-size: 1.4rem;
    white-space: nowrap;
  }

  .page-jump strong {
    color: #231f20;
  }

  .page-jump .sort-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #fff;
    color: inherit;
    border-color: #dfd1c2;
  }

  .page-size {
    height: 4.1rem;
    padding: 0 3rem 0 1.2rem;
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    background: #fff;
    color: #231f20;
    font-size: 1.4rem;
    font-weight: 600;
    cursor: pointer;
    text-transform: none;
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
    .toolbar-controls,
    .sort-selection {
      width: 100%;
    }
  }
`;

export default Sort;
