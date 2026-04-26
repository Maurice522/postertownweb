import styled from "styled-components";
import { useFilterContext } from "../context/filter_context";
import { FaCheck } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import FormatPrice from "../Helpers/FormatPrice";
import { Button } from "../styles/Button";

const FilterSection = () => {
  const {
    filters: { text, categories, colors, price },
    updateFilterValue,
    all_products,
    clearFilters,
  } = useFilterContext();

  const getUniqueData = (data, attr) => {
    let newVal = data.map((curElem) => {
      return curElem[attr];
    });

    if (attr === "colors") {
      newVal = newVal.flat();
    }

    return (newVal = ["all", ...new Set(newVal)]);
  };

  const categoryData = getUniqueData(all_products, "category");
  const colorData = getUniqueData(all_products, "color");

  return (
    <Wrapper>
      <div className="filter-search">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="text"
            placeholder="Search"
            value={text}
            onChange={updateFilterValue}
          />
          <button type="submit" className="search-btn">
            <FiSearch />
          </button>
        </form>
      </div>

      <div className="filter-clear-top">
        <button className="clear-btn" onClick={clearFilters}>
          <FiX />
          <span className="btn-text">Clear Filters</span>
        </button>
      </div>

      <div className="filter-category">
        <h3>Category</h3>
        <div>
          <button
            type="button"
            name="category"
            value="all"
            className={categories.length === 0 ? "active" : ""}
            onClick={updateFilterValue}>
            All
          </button>
          {categoryData.map((curElem, index) => {
            if (curElem === "all") return null;
            return (
              <button
                key={index}
                type="button"
                name="category"
                value={curElem}
                className={categories.includes(curElem) ? "active" : ""}
                onClick={updateFilterValue}>
                {curElem}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-colors colors">
        <h3>Colors</h3>

        <div className="filter-color-style">
          <button
            type="button"
            value="all"
            name="color"
            className={colors.length === 0 ? "color-all--style active" : "color-all--style"}
            onClick={updateFilterValue}>
            All
          </button>
          {colorData.map((curColor, index) => {
            if (curColor === "all") return null;
            const isWhite = curColor === "white";
            return (
              <button
                key={index}
                type="button"
                value={curColor}
                name="color"
                title={curColor}
                style={{ 
                  backgroundColor: curColor,
                  border: isWhite ? "2px solid #ccc" : "none"
                }}
                className={colors.includes(curColor) ? "btnStyle active" : "btnStyle"}
                onClick={updateFilterValue}>
                {colors.includes(curColor) ? <FaCheck className="checkStyle" style={{ color: curColor === "white" || curColor === "yellow" ? "#333" : "#fff" }} /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter_price">
        <h3>Price</h3>
        <div className="price-input-group">
          <span className="currency-symbol">₹</span>
          <input
            type="number"
            name="price"
            min={100}
            max={5000}
            step="100"
            value={price}
            onChange={updateFilterValue}
            className="price-input"
          />
          <p>and below</p>
        </div>
        <input
          type="range"
          name="price"
          min={100}
          max={5000}
          step="100"
          defaultValue={5000}
          value={price || 5000}
          onChange={updateFilterValue}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  h3 {
    padding: 1.5rem 0;
    font-size: bold;
  }

  .filter-clear-top {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0;
    
    .clear-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      color: #666;
      transition: all 0.2s;
      
      &:hover {
        background: ${({ theme }) => theme.colors.btn};
        color: white;
      }
      
      .btn-text {
        display: inline;
      }
    }
  }

  .filter-search {
    form {
      display: flex;
      align-items: center;
      position: relative;
    }
    
    input {
      padding: 0.6rem 1rem;
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.btn};
      }
    }
    
    .search-btn {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.3rem;
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      color: #666;
      
      &:hover {
        color: ${({ theme }) => theme.colors.btn};
      }
    }
  }

  .filter-category {
    div {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;

      button {
        border: 1px solid #ccc;
        background-color: transparent;
        text-transform: capitalize;
        cursor: pointer;
        padding: 0.4rem 1rem;
        border-radius: 1.5rem;
        transition: all 0.2s;

        &:hover {
          background-color: #f0f0f0;
          color: black;
        }
      }

      .active {
        background-color: ${({ theme }) => theme.colors.btn};
        color: white;
        border-color: ${({ theme }) => theme.colors.btn};
      }
    }
  }

  .filter-color-style {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .color-all--style {
    background-color: transparent;
    text-transform: capitalize;
    border: 1px solid #ccc;
    padding: 0.4rem 1rem;
    border-radius: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.btn};
      color: white;
      border-color: ${({ theme }) => theme.colors.btn};
    }
  }
  .btnStyle {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-left: 0;
    border: 2px solid transparent;
    outline: none;
    opacity: 0.6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    position: relative;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    &.active {
      opacity: 1;
      border: 2px solid #333;
      transform: scale(1.15);
    }
  }

  .checkStyle {
    font-size: 0.9rem;
    color: #fff;
    font-weight: bold;
    text-shadow: 0 0 2px #000;
  }

  .filter_price {
    .price-input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      
      .price-input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        width: 120px;
        font-size: 1.2rem;

        &:focus {
          outline: none;
          border-color: ${({ theme }) => theme.colors.btn};
        }
      }
      
      .currency-symbol {
        font-size: 1.4rem;
        font-weight: bold;
      }
      
      p {
        font-size: 1.1rem;
        color: #666;
      }
    }
    
    input[type="range"] {
      margin: 0.5rem 0 1rem 0;
      padding: 0;
      box-shadow: none;
      cursor: pointer;
      width: 100%;
    }
  }

  .filter-shipping {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .filter-clear .btn {
    background-color: #ec7063;
    color: #000;
  }
`;

export default FilterSection;
