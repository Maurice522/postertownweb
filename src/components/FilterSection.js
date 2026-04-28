import styled from "styled-components";
import { FiSearch, FiX } from "react-icons/fi";
import { useFilterContext } from "../context/filter_context";

const FilterSection = () => {
  const {
    filters: { text, categories, colors, price, maxPrice },
    updateFilterValue,
    all_products,
    clearFilters,
  } = useFilterContext();

  const getUniqueData = (data, attr) => {
    let newVal = data.map((curElem) => curElem[attr]);

    if (attr === "colors") {
      newVal = newVal.flat();
    }

    return ["all", ...new Set(newVal)];
  };

  const categoryData = getUniqueData(all_products, "category");
  const colorData = getUniqueData(all_products, "color");

  return (
    <Wrapper>
      <div className="filter-card">
        <div className="filter-top">
          <div>
            <span className="eyebrow">Filter</span>
            <h2>Refine Results</h2>
          </div>
          <button className="clear-btn" onClick={clearFilters}>
            <FiX />
            Reset
          </button>
        </div>

        <div className="filter-search">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="text"
              placeholder="Search posters"
              value={text}
              onChange={updateFilterValue}
            />
            <button type="submit" className="search-btn">
              <FiSearch />
            </button>
          </form>
        </div>

        <div className="filter-group">
          <h3>Category</h3>
          <div className="chip-group">
            <button
              type="button"
              name="category"
              value="all"
              className={categories.length === 0 ? "active" : ""}
              onClick={updateFilterValue}
            >
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
                  onClick={updateFilterValue}
                >
                  {curElem}
                </button>
              );
            })}
          </div>
        </div>

        <div className="filter-group">
          <h3>Colors</h3>
          <div className="color-group">
            <button
              type="button"
              value="all"
              name="color"
              className={colors.length === 0 ? "color-chip active" : "color-chip"}
              onClick={updateFilterValue}
            >
              <span className="color-dot neutral" />
              All
            </button>
            {colorData.map((curColor, index) => {
              if (curColor === "all") return null;

              return (
                <button
                  key={index}
                  type="button"
                  value={curColor}
                  name="color"
                  title={curColor}
                  className={colors.includes(curColor) ? "color-chip active" : "color-chip"}
                  onClick={updateFilterValue}
                >
                  <span
                    className={`color-dot ${curColor === "white" ? "is-white" : ""}`}
                    style={{ backgroundColor: curColor }}
                  />
                  {curColor}
                </button>
              );
            })}
          </div>
        </div>

        <div className="filter-group">
          <h3>Price</h3>
          <div className="price-box">
            <div className="price-top">
              <span className="price-value">Rs. {Number(price).toLocaleString("en-IN")}</span>
              <span className="price-note">{price >= maxPrice ? "max range" : "and below"}</span>
            </div>
            <input
              type="range"
              name="price"
              min={100}
              max={maxPrice || 5000}
              step="100"
              value={price || maxPrice || 5000}
              onChange={updateFilterValue}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .filter-card {
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 2rem 1.8rem;
    box-shadow: 0 14px 28px rgba(61, 41, 22, 0.06);
  }

  .filter-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1.8rem;
  }

  .eyebrow {
    display: inline-block;
    background: #f8ebdc;
    color: #8a5c43;
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    font-size: 1.05rem;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
  }

  h2 {
    font-size: 2.4rem;
    font-weight: 700;
  }

  .clear-btn {
    border: none;
    background: #fff;
    color: #6f6258;
    border: 1px solid #eadfce;
    border-radius: 999px;
    padding: 0.8rem 1.1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .filter-search {
    margin-bottom: 1.8rem;

    form {
      display: flex;
      align-items: center;
      position: relative;
    }

    input {
      width: 100%;
      padding: 1.1rem 4.2rem 1.1rem 1.3rem;
      border: 1px solid #dfd1c2;
      border-radius: 1.4rem;
      background: #fff;
      box-shadow: none;
      text-transform: none;
    }

    .search-btn {
      position: absolute;
      right: 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #7a6c62;
      display: grid;
      place-items: center;
      font-size: 1.5rem;
    }
  }

  .filter-group + .filter-group {
    margin-top: 1.8rem;
    padding-top: 1.8rem;
    border-top: 1px solid #efe4d8;
  }

  h3 {
    font-size: 1.55rem;
    margin-bottom: 1rem;
  }

  .chip-group,
  .color-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .chip-group button,
  .color-chip {
    border: 1px solid #dfd1c2;
    background: #fff;
    color: #2d241e;
    border-radius: 999px;
    padding: 0.75rem 1.1rem;
    cursor: pointer;
    text-transform: capitalize;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
  }

  .chip-group button:hover,
  .color-chip:hover,
  .chip-group .active,
  .color-chip.active {
    background: #231f20;
    color: #fff;
    border-color: #231f20;
  }

  .color-dot {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    border: 1px solid transparent;
    flex-shrink: 0;
  }

  .color-dot.neutral {
    background: #7d7268;
  }

  .color-dot.is-white {
    border-color: #c9b9a9;
  }

  .price-box {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.3rem 1.2rem;
  }

  .price-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .price-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #cf6d3f;
  }

  .price-note {
    color: #84786d;
    font-size: 1.2rem;
  }

  input[type="range"] {
    width: 100%;
    padding: 0;
    box-shadow: none;
    cursor: pointer;
  }
`;

export default FilterSection;
