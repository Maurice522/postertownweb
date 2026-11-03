import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import LoadingImage from "./components/LoadingImage";
import FilterSection from "./components/FilterSection";
import ProductList from "./components/ProductList";
import Sort from "./components/Sort";
import { pickHeroGif } from "./data/heroGifs";
import Pagination from "./components/Pagination";
import { useFilterContext } from "./context/filter_context";
import useIsPhone from "./utils/useIsPhone";

const PAGE_SIZES = [40, 50, 60, 70, 80];
const PAGE_SIZE_KEY = "postertown:page-size";

function savedPageSize() {
  try {
    const saved = Number(localStorage.getItem(PAGE_SIZE_KEY));
    return PAGE_SIZES.includes(saved) ? saved : PAGE_SIZES[0];
  } catch {
    return PAGE_SIZES[0];
  }
}

const Products = () => {
  const heroGif = useMemo(pickHeroGif, []);
  const { filter_products, filters, sorting_value } = useFilterContext();
  // Phones scroll one long list; bigger screens get pages.
  const isPhone = useIsPhone();
  const [pageSize, setPageSize] = useState(savedPageSize);
  const [page, setPage] = useState(1);
  const viewRef = useRef(null);

  const pageCount = Math.max(1, Math.ceil(filter_products.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageProducts = isPhone
    ? undefined
    : filter_products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // A new search, filter or sort starts again from the first page (a background
  // catalog refresh doesn't).
  const filterKey = JSON.stringify(filters);
  useEffect(() => {
    setPage(1);
  }, [filterKey, sorting_value]);

  const changePageSize = (size) => {
    setPageSize(size);
    setPage(1);
    try {
      localStorage.setItem(PAGE_SIZE_KEY, String(size));
    } catch {
      // Not saved (private mode); the choice still applies on this visit.
    }
  };

  const changePage = (next) => {
    setPage(next);
    viewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Wrapper>
      <div className="products-shell">
        <div className="products-hero">
          <div className="products-head">
            <span className="eyebrow">Browse Collection</span>
            <h1>Find the right poster for your wall.</h1>
            <p>
              Explore anime, games, movies, cars, and more with cleaner filters and a more comfortable browse flow.
            </p>
          </div>

          <div className="hero-media">
            <LoadingImage
              src={heroGif}
              loading="eager"
              alt="Animated anime showcase"
            />
          </div>
        </div>

        <div className="products-layout">
          <aside className="filter-section">
            <FilterSection />
          </aside>

          <section className="product-view" ref={viewRef}>
            <div className="sort-filter">
              <Sort
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZES}
                onPageSizeChange={isPhone ? undefined : changePageSize}
                page={currentPage}
                pageCount={pageCount}
                onPageChange={isPhone ? undefined : changePage}
              />
            </div>
            <div className="main-product">
              <ProductList products={pageProducts} />
            </div>
            {!isPhone && (
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                total={filter_products.length}
                pageSize={pageSize}
                onPageChange={changePage}
              />
            )}
          </section>
        </div>

        <section className="products-outro">
          <div className="products-outro-shell">
            <span>Browse with ease</span>          </div>
        </section>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);
  min-height: 100vh;
  padding: 4rem 0 7rem;

  .products-shell {
    width: min(100%, 156rem);
    margin: 0 auto;
    padding: 0 2.4rem;
  }

  .products-head {
    max-width: 72rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .products-hero {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(42rem, 1fr);
    gap: 3rem;
    align-items: stretch;
    margin-bottom: 2rem;
  }

  .eyebrow {
    display: inline-block;
    background: transparent;
    color: #8a5c43;
    border-radius: 0;
    padding: 0;
    font-size: 1.15rem;
    text-transform: uppercase;
    margin-bottom: 1rem;
    letter-spacing: 0.08em;
  }

  h1 {
    font-size: clamp(3rem, 4vw, 4.6rem);
    line-height: 1.08;
    margin-bottom: 1rem;
  }

  .products-head p {
    color: #6a5e54;
    max-width: 62rem;
    line-height: 1.8;
  }

  .hero-media {
    position: relative;
    height: 14rem;
    min-height: 14rem;
    aspect-ratio: 16 / 6;
    width: min(100%, 43rem);
    justify-self: center;
    align-self: center;
    border-radius: 2.4rem;
    overflow: hidden;
    background: linear-gradient(135deg, #241f1d 0%, #4a352b 100%);
    box-shadow: 0 18px 34px rgba(61, 41, 22, 0.12);
    border: 1px solid #e3d5c5;
  }

  .hero-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .products-layout {
    display: grid;
    grid-template-columns: 28rem minmax(0, 1fr);
    gap: 1.8rem;
    align-items: start;
  }

  .products-outro {
    margin-top: 2.4rem;
    padding: 0;
  }

  .products-outro-shell {
    border-top: 1px solid rgba(138, 92, 67, 0.16);
    padding-top: 2.4rem;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
  }

  .products-outro-shell span {
    color: #8a5c43;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 1.15rem;
    flex-shrink: 0;
  }

  .products-outro-shell p {
    max-width: 66rem;
    color: #6a5e54;
    line-height: 1.8;
    text-align: right;
  }

  .filter-section {
    position: sticky;
    top: 8rem;
    align-self: start;
  }

  .product-view {
    min-width: 0;
    padding-right: 0.4rem;
  }

  .sort-filter {
    margin-bottom: 1.6rem;
    position: sticky;
    top: 0;
    z-index: 2;
    background: linear-gradient(180deg, #f6ecde 0%, rgba(246, 236, 222, 0.96) 72%, rgba(246, 236, 222, 0) 100%);
    padding-bottom: 1rem;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .products-hero {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .products-layout {
      grid-template-columns: 26rem minmax(0, 1fr);
      gap: 1.8rem;
    }

    .products-outro-shell {
      align-items: flex-start;
      flex-direction: column;
    }

    .products-outro-shell p {
      text-align: left;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 2.4rem 0 5rem;

    .products-shell {
      padding: 0 1.4rem;
    }

    .products-head {
      margin-bottom: 2.2rem;
    }

    .products-hero {
      grid-template-columns: 1fr;
      margin-bottom: 2.2rem;
    }

    .hero-media {
      height: 18rem;
      min-height: 18rem;
      aspect-ratio: auto;
      width: 100%;
      justify-self: stretch;
    }

    .products-layout {
      grid-template-columns: 1fr;
    }

    .products-outro {
      margin-top: 2.6rem;
      padding-bottom: 0;
    }

    .filter-section {
      position: static;
      max-height: none;
      overflow: visible;
    }

    .product-view {
      max-height: none;
      overflow: visible;
      padding-right: 0;
    }

    .sort-filter {
      position: static;
      background: transparent;
      padding-bottom: 0;
    }
  }
`;

export default Products;
