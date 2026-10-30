import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import FormatPrice from "./Helpers/FormatPrice";
import GridView from "./components/GridView";
import PosterFan from "./components/PosterFan";
import { useProductContext } from "./context/productcontex";
import { buildCollections } from "./data/collections";

const CollectionPage = () => {
  const { slug } = useParams();
  const { products: catalog, isLoading } = useProductContext();
  const collections = useMemo(() => buildCollections(catalog), [catalog]);
  const collection = collections.find((item) => item.slug === slug);
  const others = collections.filter((item) => item.slug !== slug).slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = collection ? `${collection.title} Collection | Poster Town` : "Poster Town";
    return () => {
      document.title = "Poster Town";
    };
  }, [collection]);

  if (!collection && isLoading) {
    return <Wrapper />;
  }

  if (!collection) {
    return (
      <Wrapper>
        <div className="collection-shell missing">
          <h1>Collection not found</h1>
          <Link to="/collections" className="back-link">
            <FiArrowLeft /> All collections
          </Link>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="collection-shell">
        <Link to="/collections" className="back-link">
          <FiArrowLeft /> All collections
        </Link>

        <header className="collection-banner" style={{ "--accent": collection.accent }}>
          <div className="banner-copy">
            <span className="banner-label">Collection</span>
            <h1>{collection.title}</h1>
            <p>{collection.description}</p>
            <div className="banner-meta">
              <span>{collection.count} {collection.count === 1 ? "poster" : "posters"}</span>
              {collection.fromPrice > 0 && (
                <span>
                  From <FormatPrice price={collection.fromPrice} />
                </span>
              )}
              <span>A4 · A3 · A2</span>
            </div>
          </div>
          <div className="banner-art">
            <PosterFan images={collection.previews} size="lg" />
          </div>
        </header>

        <GridView products={collection.products} />

        {others.length > 0 && (
          <section className="more-collections">
            <div className="more-head">
              <h2>More collections</h2>
              <Link to="/collections">
                View all <FiArrowRight />
              </Link>
            </div>
            <div className="more-grid">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  to={`/collections/${item.slug}`}
                  className="more-card"
                  style={{ "--accent": item.accent }}>
                  <div className="more-art">
                    <PosterFan images={item.previews} size="sm" />
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.count} {item.count === 1 ? "poster" : "posters"}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);
  min-height: 100vh;
  padding: 3rem 0 7rem;

  .collection-shell {
    width: min(100%, 140rem);
    margin: 0 auto;
    padding: 0 2.4rem;
  }

  .missing {
    display: grid;
    gap: 2rem;
    justify-items: start;
    padding-top: 6rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    color: #8a5c43;
    font-size: 1.4rem;
    font-weight: 600;
    text-decoration: none;
    margin-bottom: 1.8rem;
  }

  .collection-banner {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 3rem;
    align-items: center;
    padding: 3.6rem 4rem;
    border-radius: 2.8rem;
    color: #fff8f1;
    background:
      radial-gradient(circle at 75% 70%, color-mix(in srgb, var(--accent) 45%, transparent) 0%, transparent 55%),
      linear-gradient(135deg, #1c1715 0%, #2f2420 100%);
    box-shadow: 0 30px 60px rgba(40, 24, 14, 0.2);
    margin-bottom: 3rem;
    overflow: hidden;
  }

  .banner-label {
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

  .banner-copy h1 {
    font-size: clamp(3.4rem, 4.6vw, 5.4rem);
    line-height: 1;
    margin-bottom: 1.2rem;
    color: #fff8f1;
  }

  .banner-copy p {
    color: rgba(255, 248, 241, 0.78);
    font-size: 1.6rem;
    line-height: 1.75;
    max-width: 52rem;
  }

  .banner-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 2rem;
  }

  .banner-meta span {
    background: rgba(255, 248, 241, 0.1);
    border: 1px solid rgba(255, 248, 241, 0.16);
    border-radius: 999px;
    padding: 0.6rem 1.2rem;
    font-size: 1.3rem;
    color: rgba(255, 248, 241, 0.88);
  }

  .banner-art {
    height: 28rem;
  }

  .more-collections {
    margin-top: 4.4rem;
  }

  .more-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 1.6rem;
  }

  .more-head h2 {
    font-size: clamp(2.4rem, 3vw, 3rem);
    font-weight: 700;
    text-transform: none;
    color: #231f20;
  }

  .more-head a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #cf6d3f;
    font-size: 1.4rem;
    font-weight: 700;
    text-decoration: none;
  }

  .more-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.6rem;
  }

  .more-card {
    display: grid;
    gap: 1.2rem;
    padding: 1.6rem;
    border-radius: 2rem;
    background: #fffaf3;
    border: 1px solid #eadfce;
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .more-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 30px rgba(60, 38, 22, 0.1);
  }

  .more-art {
    height: 14rem;
    border-radius: 1.4rem;
    padding: 1.4rem 1rem 0;
    overflow: hidden;
    background:
      radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--accent) 26%, transparent) 0%, transparent 65%),
      radial-gradient(circle at top, #fff 0%, #f7ecdf 58%, #edd9c6 100%);
  }

  .more-card strong {
    display: block;
    font-size: 1.7rem;
    color: #231f20;
  }

  .more-card span {
    color: #6a5e54;
    font-size: 1.3rem;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .collection-banner {
      grid-template-columns: 1fr;
      padding: 3rem;
    }

    .banner-art {
      order: -1;
      height: 26rem;
    }

    .more-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 2rem 0 5rem;

    .collection-shell {
      padding: 0 1.6rem;
    }

    .collection-banner {
      padding: 2.4rem;
      border-radius: 2.4rem;
    }

    .banner-art {
      height: 32rem;
    }

    .more-art {
      height: 20rem;
    }
  }
`;

export default CollectionPage;
