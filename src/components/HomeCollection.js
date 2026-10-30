import { useMemo } from "react";
import { Link } from "react-router-dom";
import LoadingImage from "./LoadingImage";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";
import FormatPrice from "../Helpers/FormatPrice";
import { useProductContext } from "../context/productcontex";
import { buildCollections } from "../data/collections";

const MAX_POSTERS = 6;

// Home page band for one collection: shoppable posters first, then upcoming
// designs from the collection's showcase marked "Coming soon".
const HomeCollection = ({ slug }) => {
  const { products: catalog } = useProductContext();
  const collection = useMemo(() => buildCollections(catalog).find((item) => item.slug === slug), [catalog, slug]);

  if (!collection) {
    return null;
  }

  const shoppable = collection.products.map((product) => ({
    key: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    to: `/singleproduct/${product.id}`,
  }));
  const comingSoon = (collection.showcase || []).map((item) => ({ key: item.image, ...item }));
  const posters = [...shoppable, ...comingSoon].slice(0, MAX_POSTERS);

  return (
    <Band
      style={{
        "--accent": collection.accent,
        "--wall": collection.wallImage ? `url(${collection.wallImage})` : "none",
      }}>
      <div className="band-shell">
        <div className="band-head">
          <div>
            <span className="band-label">Collection</span>
            <h2>{collection.title}</h2>
            <p>{collection.description}</p>
          </div>
          <Link to={`/collections/${collection.slug}`} className="band-cta">
            Explore {collection.title} <FiArrowRight />
          </Link>
        </div>

        <div className="poster-row">
          {posters.map((poster) =>
            poster.to ? (
              <Link key={poster.key} to={poster.to} className="poster-tile">
                <div className="tile-frame">
                  <LoadingImage src={poster.image} alt={poster.name} loading="lazy" />
                </div>
                <div className="tile-copy">
                  <strong>{poster.name}</strong>
                  <span className="tile-price">
                    <FormatPrice price={poster.price} />
                  </span>
                </div>
              </Link>
            ) : (
              <div key={poster.key} className="poster-tile is-coming">
                <div className="tile-frame">
                  <LoadingImage src={poster.image} alt={poster.name} loading="lazy" />
                  <span className="soon-tag">Coming soon</span>
                </div>
                <div className="tile-copy">
                  <strong>{poster.name}</strong>
                  <span>Coming soon</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Band>
  );
};

const Band = styled.section`
  position: relative;
  padding: 7rem 0;
  overflow: hidden;
  color: #fff8f1;
  background:
    linear-gradient(180deg, rgba(20, 15, 13, 0.82) 0%, rgba(20, 15, 13, 0.9) 60%, rgba(20, 15, 13, 0.97) 100%),
    radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 55%),
    var(--wall) center / cover no-repeat,
    #1c1715;

  .band-shell {
    width: min(100%, 148rem);
    margin: 0 auto;
    padding: 0 2.4rem;
  }

  .band-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 3rem;
    margin-bottom: 3.6rem;
  }

  .band-label {
    display: inline-block;
    border: 1px solid rgba(255, 248, 241, 0.25);
    border-radius: 999px;
    padding: 0.5rem 1.1rem;
    font-size: 1.15rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 248, 241, 0.8);
    margin-bottom: 1.4rem;
  }

  h2 {
    font-size: clamp(3.6rem, 5vw, 6rem);
    font-weight: 800;
    line-height: 1;
    text-transform: none;
    color: #fff8f1;
    margin-bottom: 1.4rem;
  }

  .band-head p {
    color: rgba(255, 248, 241, 0.78);
    font-size: 1.6rem;
    line-height: 1.75;
    max-width: 60rem;
  }

  .band-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    flex-shrink: 0;
    background: #fff8f1;
    color: #231f20;
    border-radius: 999px;
    padding: 1.3rem 2.2rem;
    font-size: 1.45rem;
    font-weight: 700;
    text-decoration: none;
    transition: gap 0.25s ease, transform 0.25s ease;
  }

  .band-cta:hover {
    gap: 1.2rem;
    transform: translateY(-2px);
  }

  .poster-row {
    display: grid;
    grid-template-columns: repeat(${MAX_POSTERS}, minmax(0, 1fr));
    gap: 1.8rem;
  }

  .poster-tile {
    display: grid;
    gap: 1.2rem;
    text-decoration: none;
    color: inherit;
  }

  .tile-frame {
    position: relative;
    aspect-ratio: 1 / 1.414;
    border-radius: 0.8rem;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 22px 40px rgba(0, 0, 0, 0.45);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
  }

  .tile-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
  }

  a.poster-tile:hover .tile-frame {
    transform: translateY(-8px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 30px 50px rgba(0, 0, 0, 0.55),
      0 0 0 2px color-mix(in srgb, var(--accent) 70%, transparent);
  }

  .is-coming .tile-frame img {
    filter: saturate(0.75) brightness(0.8);
  }

  .soon-tag {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(20, 15, 13, 0.78);
    border: 1px solid rgba(255, 248, 241, 0.22);
    color: #fff8f1;
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    font-size: 1.05rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
  }

  .tile-copy {
    display: grid;
    gap: 0.3rem;
  }

  .tile-copy strong {
    font-size: 1.55rem;
    color: #fff8f1;
    line-height: 1.3;
  }

  .tile-copy span {
    font-size: 1.3rem;
    color: rgba(255, 248, 241, 0.6);
  }

  .tile-copy .tile-price {
    color: color-mix(in srgb, var(--accent) 65%, #fff8f1);
    font-weight: 700;
  }

  @media (max-width: 1200px) {
    .poster-row {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 5rem 0;

    .band-shell {
      padding: 0 1.6rem;
    }

    .band-head {
      flex-direction: column;
      align-items: flex-start;
      gap: 2rem;
      margin-bottom: 2.6rem;
    }

    /* Swipeable row on phones, with the next poster peeking in. */
    .poster-row {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding-left: 1.6rem;
      gap: 1.4rem;
      margin: 0 -1.6rem;
      padding: 0 1.6rem 1rem;
      scrollbar-width: none;
    }

    .poster-row::-webkit-scrollbar {
      display: none;
    }

    .poster-tile {
      flex: 0 0 62%;
      scroll-snap-align: start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tile-frame,
    .band-cta {
      transition: none;
    }
  }
`;

export default HomeCollection;
