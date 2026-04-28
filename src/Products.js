import { useMemo } from "react";
import styled from "styled-components";
import FilterSection from "./components/FilterSection";
import ProductList from "./components/ProductList";
import Sort from "./components/Sort";

const Products = () => {
  const heroGif = useMemo(() => {
    const gifs = [
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3J4cnI1NXY3ZWV3ZHVwNHVuMmV4cmt2cTVrMmd6b2Z1cXR1MW92MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lsUWq3SQ3NLYusKJ4O/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3J4cnI1NXY3ZWV3ZHVwNHVuMmV4cmt2cTVrMmd6b2Z1cXR1MW92MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4ajQEQgTHvKxNWGFCK/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bGdxMHE1MGttcmk5YzhvdDZkZGV0M2ptdWJkY3Q1N3c2b2d0a3kxdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/EjLTU9HAnnskywtJ9j/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGFvdHhhYzcxZzg4ZXRvMnlscGtldjZhaWo5MDE3MjN3dThzOHJnMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/h2GpJK6ljDJJnLDWUA/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmswN3ZkOWVhZmZsMHoxbXg4cDBva25qa3dya2cxZzhhdDNrNGttbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xLzOrO1e19V3q/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmswN3ZkOWVhZmZsMHoxbXg4cDBva25qa3dya2cxZzhhdDNrNGttbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/NeqRhamuUqjjxVGIqh/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MDBpeG13cTU5YXYycjN3NHZ1YzcwNWFlb3BwcGF2dWhkdHFqNWIybCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pGlDpwgWTLgBi/giphy.gif",
    ];

    return gifs[Math.floor(Math.random() * gifs.length)];
  }, []);

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
            <img
              src={heroGif}
              alt="Animated anime showcase"
            />
          </div>
        </div>

        <div className="products-layout">
          <aside className="filter-section">
            <FilterSection />
          </aside>

          <section className="product-view">
            <div className="sort-filter">
              <Sort />
            </div>
            <div className="main-product">
              <ProductList />
            </div>
          </section>
        </div>

        <section className="products-outro">
          <div className="products-outro-shell">
            <span>Browse with ease</span>
            <p>Refine by category, switch views, and keep exploring without the page ending abruptly before the footer.</p>
          </div>
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
    margin-bottom: 3rem;
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
    font-size: clamp(3.4rem, 5vw, 5.6rem);
    line-height: 1.08;
    margin-bottom: 1rem;
  }

  .products-head p {
    color: #6a5e54;
    max-width: 62rem;
    line-height: 1.8;
  }

  .hero-media {
    height: 67.2%;
    min-height: 17.9rem;
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
    grid-template-columns: 30rem minmax(0, 1fr);
    gap: 2.4rem;
    align-items: start;
  }

  .products-outro {
    margin-top: 3.6rem;
    padding: 0 0 2rem;
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
    top: 10rem;
    align-self: start;
    max-height: calc(100vh - 12rem);
    overflow-y: auto;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: #c9aa8d transparent;
  }

  .product-view {
    min-width: 0;
    max-height: calc(100vh - 12rem);
    overflow-y: auto;
    padding-right: 0.4rem;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: #c9aa8d transparent;
  }

  .sort-filter {
    margin-bottom: 1.6rem;
    position: sticky;
    top: 0;
    z-index: 2;
    background: linear-gradient(180deg, #f6ecde 0%, rgba(246, 236, 222, 0.96) 72%, rgba(246, 236, 222, 0) 100%);
    padding-bottom: 1rem;
  }

  .filter-section::-webkit-scrollbar,
  .product-view::-webkit-scrollbar {
    width: 0.7rem;
  }

  .filter-section::-webkit-scrollbar-track,
  .product-view::-webkit-scrollbar-track {
    background: transparent;
  }

  .filter-section::-webkit-scrollbar-thumb,
  .product-view::-webkit-scrollbar-thumb {
    background: rgba(201, 170, 141, 0.9);
    border-radius: 999px;
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
    padding: 3rem 0 5rem;

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
