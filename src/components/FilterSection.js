import styled from "styled-components";
import { FiSearch, FiX } from "react-icons/fi";
import { useFilterContext } from "../context/filter_context";

// "Under" price options, always shown; empty ones are disabled.
const PRICE_STEPS = [700, 1000, 1500, 2000, 2500];

const FilterSection = () => {
  const {
    filters: { text, categories, colors, price, maxPrice },
    updateFilterValue,
    all_products,
    clearFilters,
  } = useFilterContext();

  const productPrices = (all_products || []).map((product) => Number(product.price) || 0);
  const countUpTo = (limit) => productPrices.filter((value) => value <= limit).length;
  const priceOptions = [
    { key: "any", value: maxPrice, label: "Any price", count: productPrices.length },
    ...PRICE_STEPS.map((limit) => ({
      key: `under-${limit}`,
      value: limit,
      label: `Under ₹${limit.toLocaleString("en-IN")}`,
      count: countUpTo(limit),
    })),
  ];
  // Highlight the option that was picked. A limit above the dearest poster still
  // counts as picked (it just shows everything), so "Under ₹2,000" stays selected.
  const selectedKey = price === maxPrice || !PRICE_STEPS.includes(price) ? "any" : `under-${price}`;
  const choosePrice = (value) => updateFilterValue({ target: { name: "price", value } });

  const getUniqueData = (data, attr) => {
    let newVal = data.map((curElem) => curElem[attr]);

    if (attr === "colors") {
      newVal = newVal.flat();
    }

    return ["all", ...new Set(newVal)];
  };

  const categoryData = getUniqueData(all_products, "category");
  // Every colour any poster has, not just each poster's main colour.
  const colorData = getUniqueData(all_products, "colors");

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
          <div className="price-options" role="radiogroup" aria-label="Price">
            {priceOptions.map((option) => (
              <button
                type="button"
                key={option.key}
                role="radio"
                aria-checked={selectedKey === option.key}
                className={selectedKey === option.key ? "price-option active" : "price-option"}
                disabled={option.count === 0 && selectedKey !== option.key}
                onClick={() => choosePrice(option.value)}>
                <span className="price-radio" aria-hidden="true" />
                <span className="price-label">{option.label}</span>
                <span className="price-count">{option.count}</span>
              </button>
            ))}
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
    border-radius: 1.6rem;
    padding: 1.4rem;
    box-shadow: 0 14px 28px rgba(61, 41, 22, 0.06);
  }

  .filter-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1.2rem;
  }

  .eyebrow {
    display: inline-block;
    background: #f8ebdc;
    color: #8a5c43;
    border-radius: 999px;
    padding: 0;
    font-size: 1.05rem;
    text-transform: uppercase;
    margin-bottom: 0.45rem;
    background: transparent;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    white-space: nowrap;
  }

  .clear-btn {
    border: none;
    background: #fff;
    color: #6f6258;
    border: 1px solid #eadfce;
    border-radius: 999px;
    padding: 0.65rem 0.95rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .filter-search {
    margin-bottom: 1.2rem;

    form {
      display: flex;
      align-items: center;
      position: relative;
    }

    input {
      width: 100%;
      padding: 0.9rem 4rem 0.9rem 1.1rem;
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
    margin-top: 1.2rem;
    padding-top: 1.2rem;
    border-top: 1px solid #efe4d8;
  }

  h3 {
    font-size: 1.45rem;
    margin-bottom: 0.8rem;
  }

  .chip-group,
  .color-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .chip-group button,
  .color-chip {
    border: 1px solid #dfd1c2;
    background: #fff;
    color: #2d241e;
    border-radius: 999px;
    padding: 0.62rem 0.95rem;
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

  .price-options {
    display: grid;
    gap: 0.6rem;
  }

  .price-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 0.9rem 1.2rem;
    border-radius: 1.2rem;
    border: 1px solid #eadfce;
    background: #fff;
    color: #3f3833;
    font-size: 1.4rem;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .price-option:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .price-option:not(:disabled):hover {
    border-color: #d8b796;
  }

  .price-option.active {
    border-color: #231f20;
    background: #fbf6ef;
    color: #231f20;
    font-weight: 600;
  }

  .price-radio {
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid #cdbba8;
    transition: border 0.2s ease;
  }

  .price-option.active .price-radio {
    border: 5px solid #231f20;
  }

  .price-label {
    flex: 1;
  }

  .price-count {
    min-width: 2.4rem;
    padding: 0.1rem 0.7rem;
    border-radius: 999px;
    background: #f4ebe1;
    color: #7a6c60;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
  }
`;

export default FilterSection;
