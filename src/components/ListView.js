import { Link } from "react-router-dom";
import styled from "styled-components";
import FormatPrice from "../Helpers/FormatPrice";

const normalizeImagePath = (path) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
};

const ListView = ({ products }) => {
  return (
    <Wrapper>
      <div className="list-grid">
        {products.map((curElem) => {
          const { id, name, image, price, description, category } = curElem;
          const teaser = (description || "Premium wall-ready poster with a bold finish.")
            .slice(0, 120)
            .trim();

          return (
            <Link key={id} to={`/singleproduct/${id}`} className="list-card">
              <div className="list-image-shell">
                <span className="category-badge">{category}</span>
                <img src={normalizeImagePath(image)} alt={name} />
              </div>

              <div className="list-copy">
                <div className="top-row">
                  <div className="copy-main">
                    <span className="list-kicker">Premium metal print</span>
                    <h3>{name}</h3>
                  </div>
                  <div className="price-stack">
                    <span className="list-mrp">Rs. 1,299</span>
                    <p className="list-price">
                      <FormatPrice price={price} />
                    </p>
                  </div>
                </div>
                <p className="list-description">
                  {teaser}...
                </p>
                <div className="list-meta">
                  <span>Wall-ready finish</span>
                  <span>Fade-resistant print</span>
                  <span>Fast dispatch</span>
                </div>
                <span className="read-more">View details</span>
              </div>
            </Link>
          );
        })}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .list-grid {
    display: grid;
    gap: 1.6rem;
  }

  .list-card {
    display: grid;
    grid-template-columns: 26rem minmax(0, 1fr);
    gap: 2.2rem;
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 2.4rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 16px 30px rgba(61, 41, 22, 0.08);
    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  }

  .list-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 42px rgba(61, 41, 22, 0.12);
    border-color: #dcc5ad;
  }

  .list-image-shell {
    position: relative;
    background: radial-gradient(circle at top, #fff 0%, #f7ecdf 58%, #edd9c6 100%);
    min-height: 25rem;
    display: grid;
    place-items: center;
    padding: 1.8rem;
  }

  .list-image-shell img {
    width: 100%;
    max-width: 18.8rem;
    height: 22.8rem;
    object-fit: cover;
    border-radius: 1.6rem;
    box-shadow: 0 24px 28px rgba(0, 0, 0, 0.17);
  }

  .category-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(35, 31, 32, 0.94);
    color: #fff;
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font-size: 1.05rem;
    text-transform: uppercase;
  }

  .list-copy {
    padding: 2rem 2rem 2rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    gap: 1.4rem;
    align-items: start;
    margin-bottom: 1rem;
  }

  .copy-main {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .list-kicker {
    color: #8f6548;
    font-size: 1.15rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .price-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
  }

  .list-mrp {
    color: #b8aa9a;
    font-size: 1.25rem;
    text-decoration: line-through;
  }

  h3 {
    font-size: 2.5rem;
    color: #231f20;
    line-height: 1.15;
  }

  .list-price {
    color: #cf6d3f;
    font-size: 2.2rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .list-description {
    color: #685d54;
    line-height: 1.75;
    margin-bottom: 1.2rem;
    max-width: 62rem;
  }

  .list-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 1.3rem;
  }

  .list-meta span {
    border: 1px solid #ead7c3;
    background: rgba(255, 255, 255, 0.72);
    color: #6b584c;
    border-radius: 999px;
    padding: 0.55rem 0.95rem;
    font-size: 1.18rem;
  }

  .read-more {
    color: #7c563d;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .list-card {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .list-copy {
      padding: 1.6rem;
    }

    .list-image-shell {
      min-height: 20rem;
    }

    .top-row {
      flex-direction: column;
    }

    .price-stack {
      align-items: flex-start;
    }
  }
`;

export default ListView;
