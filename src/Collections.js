import { useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";
import FormatPrice from "./Helpers/FormatPrice";
import PosterFan from "./components/PosterFan";
import { useProductContext } from "./context/productcontex";
import { buildCollections } from "./data/collections";

const Collections = () => {
  const { products: catalog } = useProductContext();
  const collections = useMemo(() => buildCollections(catalog), [catalog]);
  const featured = collections.find((collection) => collection.featured) || collections[0];
  const rest = collections.filter((collection) => collection !== featured);

  return (
    <Wrapper>
      <div className="collections-shell">
        <header className="collections-hero">
          <span className="eyebrow">Collections</span>
          <h1>Curated walls for every fandom.</h1>
          <p>
            Hand-picked sets of metal prints, grouped by series, genre and style. Start with a collection and build a wall
            that tells one story.
          </p>
          <div className="hero-stats">
            <span>
              <strong>{collections.length}</strong> collections
            </span>
            <span>
              <strong>{catalog.length}</strong> posters
            </span>
            <span>
              <strong>A4 to A2</strong> sizes
            </span>
          </div>
        </header>

        {featured && (
          <Link
            to={`/collections/${featured.slug}`}
            className="featured-collection"
            style={{ "--accent": featured.accent }}>
            <div className="featured-copy">
              <span className="featured-label">Featured collection</span>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <div className="featured-meta">
                <span>{featured.count} posters</span>
                {featured.fromPrice > 0 && (
                  <span>
                    From <FormatPrice price={featured.fromPrice} />
                  </span>
                )}
              </div>
              <span className="featured-cta">
                Explore collection <FiArrowRight />
              </span>
            </div>
            <div className="featured-art">
              <PosterFan images={featured.previews} size="lg" />
            </div>
          </Link>
        )}

        <section className="collection-grid" aria-label="All collections">
          {rest.map((collection) => (
            <Link
              key={collection.slug}
              to={`/collections/${collection.slug}`}
              className="collection-card"
              style={{ "--accent": collection.accent }}>
              <div className="card-art">
                <PosterFan images={collection.previews} />
              </div>
              <div className="card-copy">
                <div className="card-title-row">
                  <h3>{collection.title}</h3>
                  <span className="card-count">{collection.count}</span>
                </div>
                <p>{collection.tagline}</p>
                <span className="card-link">
                  {collection.fromPrice > 0 ? (
                    <>
                      From <FormatPrice price={collection.fromPrice} />
                    </>
                  ) : (
                    "View posters"
                  )}
                  <FiArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="collections-outro">
          <div>
            <span className="eyebrow">Can't decide?</span>
            <h2>Browse every poster in one place.</h2>
          </div>
          <Link to="/products" className="outro-btn">
            Shop all posters <FiArrowRight />
          </Link>
        </section>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);
  min-height: 100vh;
  padding: 4rem 0 7rem;

  .collections-shell {
    width: min(100%, 140rem);
    margin: 0 auto;
    padding: 0 2.4rem;
  }

  .eyebrow {
    display: inline-block;
    color: #8a5c43;
    font-size: 1.15rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .collections-hero {
    max-width: 76rem;
    margin-bottom: 3rem;
  }

  .collections-hero h1 {
    font-size: clamp(3.2rem, 4.4vw, 5.2rem);
    line-height: 1.06;
    margin-bottom: 1.2rem;
    color: #231f20;
  }

  .collections-hero p {
    color: #6a5e54;
    font-size: 1.6rem;
    line-height: 1.8;
    max-width: 62rem;
  }

  .hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
  }

  .hero-stats span {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid #eadfce;
    border-radius: 999px;
    padding: 0.8rem 1.4rem;
    color: #6a5e54;
    font-size: 1.3rem;
  }

  .hero-stats strong {
    color: #231f20;
  }

  /* Featured banner */
  .featured-collection {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: 3rem;
    align-items: center;
    min-height: 40rem;
    padding: 4rem;
    border-radius: 2.8rem;
    text-decoration: none;
    color: #fff8f1;
    background:
      radial-gradient(circle at 78% 60%, color-mix(in srgb, var(--accent) 45%, transparent) 0%, transparent 55%),
      linear-gradient(135deg, #1c1715 0%, #2f2420 100%);
    box-shadow: 0 30px 60px rgba(40, 24, 14, 0.22);
    margin-bottom: 2.4rem;
    overflow: hidden;
  }

  .featured-label {
    display: inline-block;
    border: 1px solid rgba(255, 248, 241, 0.25);
    border-radius: 999px;
    padding: 0.5rem 1.1rem;
    font-size: 1.15rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 248, 241, 0.8);
    margin-bottom: 1.6rem;
  }

  .featured-copy h2 {
    font-size: clamp(3.4rem, 4.6vw, 5.6rem);
    font-weight: 800;
    text-transform: none;
    line-height: 1;
    margin-bottom: 1.4rem;
    color: #fff8f1;
  }

  .featured-copy p {
    color: rgba(255, 248, 241, 0.78);
    font-size: 1.6rem;
    line-height: 1.75;
    max-width: 46rem;
  }

  .featured-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
    margin: 2rem 0 2.4rem;
    color: rgba(255, 248, 241, 0.7);
    font-size: 1.4rem;
  }

  .featured-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background: #fff8f1;
    color: #231f20;
    border-radius: 999px;
    padding: 1.2rem 2rem;
    font-size: 1.4rem;
    font-weight: 700;
    transition: gap 0.25s ease;
  }

  .featured-art {
    height: 34rem;
  }

  .featured-collection:hover .featured-cta {
    gap: 1.2rem;
  }

  .featured-collection:hover .fan-poster-1:not(.fan-wide) {
    transform: translateX(-118%) rotate(-12deg);
  }

  .featured-collection:hover .fan-poster-2:not(.fan-wide) {
    transform: translateX(18%) rotate(12deg);
  }

  /* Collection cards */
  .collection-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }

  .collection-card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2.2rem;
    overflow: hidden;
    box-shadow: 0 16px 28px rgba(60, 38, 22, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .collection-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 26px 40px rgba(60, 38, 22, 0.14);
  }

  .card-art {
    height: 24rem;
    padding: 2.4rem 2rem 0;
    background:
      radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--accent) 28%, transparent) 0%, transparent 65%),
      radial-gradient(circle at top, #fff 0%, #f7ecdf 58%, #edd9c6 100%);
    overflow: hidden;
  }

  .collection-card:hover .fan-poster-0:not(.fan-wide) {
    transform: translateX(-50%) translateY(-6px);
  }

  .collection-card:hover .fan-count-2 .fan-poster-0 {
    transform: translateX(-30%) translateY(-6px) rotate(4deg);
  }

  .collection-card:hover .fan-poster-1:not(.fan-wide) {
    transform: translateX(-114%) rotate(-11deg);
  }

  .collection-card:hover .fan-poster-2:not(.fan-wide) {
    transform: translateX(14%) rotate(11deg);
  }

  .card-copy {
    padding: 1.8rem 2rem 2rem;
    display: grid;
    gap: 0.6rem;
    flex: 1;
  }

  .card-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .card-title-row h3 {
    font-size: 2.1rem;
    font-weight: 700;
    color: #231f20;
  }

  .card-count {
    min-width: 3rem;
    height: 3rem;
    padding: 0 0.9rem;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--accent) 14%, #fff);
    color: color-mix(in srgb, var(--accent) 80%, #231f20);
    font-size: 1.3rem;
    font-weight: 700;
  }

  .card-copy p {
    color: #6a5e54;
    font-size: 1.45rem;
    line-height: 1.6;
  }

  .card-link {
    margin-top: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    color: #cf6d3f;
    font-size: 1.4rem;
    font-weight: 700;
    transition: gap 0.25s ease;
  }

  .collection-card:hover .card-link {
    gap: 1rem;
  }

  .collections-outro {
    margin-top: 4rem;
    padding-top: 3rem;
    border-top: 1px solid rgba(138, 92, 67, 0.16);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .collections-outro h2 {
    font-size: clamp(2.4rem, 3vw, 3.2rem);
    font-weight: 700;
    text-transform: none;
    color: #231f20;
  }

  .outro-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background: linear-gradient(135deg, #231f20 0%, #49372f 100%);
    color: #fff8f1;
    border-radius: 999px;
    padding: 1.3rem 2.2rem;
    font-size: 1.45rem;
    font-weight: 700;
    text-decoration: none;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .collection-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .featured-collection {
      grid-template-columns: 1fr;
      padding: 3rem;
    }

    .featured-art {
      height: 30rem;
      order: -1;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 2.4rem 0 5rem;

    .collections-shell {
      padding: 0 1.6rem;
    }

    .collection-grid {
      grid-template-columns: 1fr;
    }

    .featured-collection {
      padding: 2.4rem;
      border-radius: 2.4rem;
    }

    .featured-art {
      height: 34rem;
    }

    .card-art {
      height: 30rem;
    }

    .collections-outro {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .collection-card,
    .featured-cta,
    .card-link {
      transition: none;
    }
  }
`;

export default Collections;
