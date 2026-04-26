import React from "react";
import styled from "styled-components";
import { BsFillGridFill, BsList } from "react-icons/bs";
import { useFilterContext } from "../context/filter_context";

const Sort = () => {
  const { filter_products, grid_view, setGridView, setListView, sorting } =
    useFilterContext();
  return (
    <Wrapper className="sort-section">
      {/* 1st column  */}
      <div className="sorting-list--grid">
        <button
          className={grid_view ? "active sort-btn" : "sort-btn"}
          onClick={setGridView}>
          <BsFillGridFill className="icon" />
        </button>

        <button
          className={!grid_view ? "active sort-btn" : " sort-btn"}
          onClick={setListView}>
          <BsList className="icon" />
        </button>
      </div>
      {/* 2nd column  */}
      <div className="product-data">
        <p>{`${filter_products.length} Product Available`}</p>
      </div>

      {/* 3rd column  */}
      <div className="sort-selection">
        <form action="#">
          <label htmlFor="sort"></label>
          <select
            name="sort"
            id="sort"
            className="sort-selection--style"
            onChange={sorting}>
            <option value="lowest">Price: Lowest First</option>
            <option value="highest">Price: Highest First</option>
            <option value="a-z">Name: A to Z</option>
            <option value="z-a">Name: Z to A</option>
          </select>
        </form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5rem;
  flex-wrap: wrap;
  gap: 1rem;

  .sorting-list--grid {
    display: flex;
    gap: 0.5rem;

    .sort-btn {
      padding: 0.8rem 1rem;
      border: 1px solid #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: transparent;
      transition: all 0.3s;
      &:hover {
        background-color: #f0f0f0;
        color: black;
      }
    }

    .icon {
      font-size: 1.6rem;
    }
    .active {
      background-color: ${({ theme }) => theme.colors.btn};
      color: #fff;
      border-color: ${({ theme }) => theme.colors.btn};
    }
  }

  .product-data {
    flex: 1;
    text-align: center;
    p {
      font-size: 1.4rem;
      color: #666;
    }
  }

  .sort-selection .sort-selection--style {
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background: white;
    font-size: 1.4rem;
    color: #333;
    min-width: 180px;
    transition: all 0.3s;

    &:hover, &:focus {
      border-color: ${({ theme }) => theme.colors.btn};
      outline: none;
    }

    .sort-select--option {
      padding: 0.5rem 0;
      cursor: pointer;
      height: 2rem;
      padding: 10px;
    }
  }
`;

export default Sort;
