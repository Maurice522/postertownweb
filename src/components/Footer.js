import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FiArrowRight, FiMail, FiPhone } from "react-icons/fi";
import { useMemo } from "react";
import { useProductContext } from "../context/productcontex";
import { buildCollections } from "../data/collections";

// Franchise collections first, then the broad ones; empty collections drop out.
const FOOTER_COLLECTIONS = ["demon-slayer", "dragon-ball-z", "one-piece", "naruto", "superheroes", "villains", "gaming", "cars"];
const pickFooterCollections = (products) =>
  buildCollections(products)
    .filter((collection) => FOOTER_COLLECTIONS.includes(collection.slug))
    .sort((a, b) => FOOTER_COLLECTIONS.indexOf(a.slug) - FOOTER_COLLECTIONS.indexOf(b.slug))
    .slice(0, 6);

const navGroups = [
  {
    title: "Shop",
    links: [
      { to: "/collections", label: "Collections" },
      { to: "/products", label: "All posters" },
      { to: "/collections/bestsellers", label: "Bestsellers" },
      { to: "/collections/new-arrivals", label: "New arrivals" },
    ],
  },
  {
    title: "Poster Town",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About us" },
      { to: "/orders", label: "Your orders" },
      { to: "/cart", label: "Cart" },
    ],
  },
];

const Footer = () => {
  const { products } = useProductContext();
  const footerCollections = useMemo(() => pickFooterCollections(products), [products]);
  return (
    <Wrapper>
      <footer>
        <div className="footer-shell">
          <section className="footer-top">
            <div className="footer-brand">
              <span className="footer-kicker">Poster Town</span>
              <h3>Premium posters for anime, games, and movie walls.</h3>
              <p>
                Curated art prints, cleaner browsing, and a more polished shopping flow from homepage to checkout.
              </p>
            </div>

            <div className="footer-cta">
              <span>Shop by collection</span>
              <div className="collection-pills">
                {footerCollections.map((collection) => (
                  <NavLink
                    key={collection.slug}
                    to={`/collections/${collection.slug}`}
                    className="collection-pill"
                    style={{ "--accent": collection.accent }}>
                    <i aria-hidden="true" />
                    {collection.title}
                  </NavLink>
                ))}
              </div>
              <NavLink to="/collections" className="cta-link">
                All collections
                <FiArrowRight />
              </NavLink>
            </div>
          </section>

          <section className="footer-grid">
            <div className="footer-card">
              <div className="footer-nav">
                {navGroups.map((group) => (
                  <div key={group.title}>
                    <span className="footer-label">{group.title}</span>
                    <ul className="footer-links">
                      {group.links.map((link) => (
                        <li key={link.to}>
                          <NavLink to={link.to} end>
                            {link.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-card">
              <span className="footer-label">Contact</span>
              <div className="footer-stack">
                <a href="tel:+919953749307">
                  <FiPhone />
                  +91 9953749307
                </a>
                <a href="mailto:hello@postertown.in">
                  <FiMail />
                  hello@postertown.in
                </a>
              </div>
            </div>

            <div className="footer-card">
              <span className="footer-label">Follow</span>
              <div className="footer-social">
                <a href="https://www.instagram.com/metalpostertown/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61566400029644" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
              </div>
            </div>
          </section>

          <section className="footer-bottom">
            <p>© {new Date().getFullYear()} Poster Town. All rights reserved.</p>
            <div className="footer-bottom-links">
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
            </div>
          </section>
        </div>
      </footer>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  footer {
    background:
      radial-gradient(circle at top left, rgba(255, 118, 94, 0.16) 0%, transparent 32%),
      radial-gradient(circle at top right, rgba(255, 214, 156, 0.08) 0%, transparent 28%),
      linear-gradient(180deg, #161110 0%, #0f0b0b 100%);
    padding: 3rem 2rem 2rem;
  }

  .footer-shell {
    width: min(100%, 156rem);
    margin: 0 auto;
    padding: 3.2rem;
    border-radius: 3rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 24px 54px rgba(0, 0, 0, 0.22);
  }

  .footer-top {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(26rem, 0.8fr);
    gap: 2rem;
    align-items: end;
    padding-bottom: 2.8rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .footer-kicker,
  .footer-label,
  .footer-cta span {
    color: rgba(255, 210, 177, 0.82);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 1.1rem;
  }

  .footer-brand h3 {
    color: #fff6ef;
    font-size: clamp(2.8rem, 3vw, 4.2rem);
    font-weight: 700;
    line-height: 1.08;
    margin: 1rem 0 1.2rem;
    max-width: 72rem;
  }

  .footer-brand p,
  .footer-bottom p,
  .footer-bottom-links span {
    color: rgba(255, 241, 231, 0.72);
  }

  .footer-brand p {
    max-width: 64rem;
    line-height: 1.8;
  }

  .footer-cta {
    padding: 2rem;
    border-radius: 2.2rem;
    background: linear-gradient(135deg, rgba(255, 115, 92, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    align-self: stretch;
    justify-content: space-between;
  }

  .collection-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .collection-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.7rem 1.3rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff8f1;
    font-size: 1.35rem;
    font-weight: 600;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .collection-pill i {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: var(--accent);
  }

  .collection-pill:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
  }

  .cta-link {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    color: #fff8f1;
    font-size: 1.6rem;
    font-weight: 700;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.6rem;
    padding: 2.4rem 0;
  }

  .footer-card {
    min-height: 14rem;
    padding: 1.8rem;
    border-radius: 2.2rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
  }

  .footer-links,
  .footer-stack {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin-top: 1.1rem;
  }

  .footer-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    gap: 0.2rem;
  }

  .footer-links a {
    display: inline-block;
    padding: 0.35rem 0;
    color: rgba(255, 241, 231, 0.78);
    font-size: 1.45rem;
    font-weight: 500;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .footer-links a:hover {
    transform: translateX(3px);
  }

  .footer-links a.active {
    color: #fff8f1;
  }

  .footer-stack a {
    color: #fff8f1;
    font-size: 1.45rem;
    transition: color 0.22s ease;
  }

  .footer-stack a {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
  }

  .footer-links a:hover,
  .footer-stack a:hover,
  .cta-link:hover {
    color: #ffb48d;
  }

  .footer-social {
    display: flex;
    gap: 1rem;
    margin-top: 1.1rem;
  }

  .footer-social a {
    width: 5rem;
    height: 5rem;
    border-radius: 1.6rem;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #fff8f1;
    font-size: 2rem;
    transition: transform 0.22s ease, background 0.22s ease;
  }

  .footer-social a:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }

  .footer-bottom {
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    gap: 1.6rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .footer-bottom-links {
    display: flex;
    gap: 1.4rem;
    flex-wrap: wrap;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .footer-top,
    .footer-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    footer {
      padding: 2rem 1rem 1rem;
    }

    .footer-shell {
      padding: 2rem;
      border-radius: 2.4rem;
    }

    .footer-card {
      min-height: auto;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default Footer;
