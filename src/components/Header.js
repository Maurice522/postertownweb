import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Nav from "./Nav";

const Header = () => {
  return (
    <MainHeader>
      <div className="header-shell">
        <NavLink to="/" className="brand-link" aria-label="Poster Town home">
          <div className="brand-mark">
            <img
              src="/images/PosterTownc.png"
              alt="Poster Town logo"
              className="logo"
            />
          </div>

          <div className="brand-copy">
            <span className="brand-kicker">Premium wall art</span>
            <strong className="brand-name">Poster Town</strong>
          </div>
        </NavLink>

        <Nav />
      </div>
    </MainHeader>
  );
};

const MainHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  padding: 1.6rem 2rem 0;
  background: linear-gradient(180deg, rgba(22, 18, 17, 0.92) 0%, rgba(22, 18, 17, 0.72) 68%, rgba(22, 18, 17, 0) 100%);
  backdrop-filter: blur(16px);

  .header-shell {
    width: min(100%, 156rem);
    margin: 0 auto;
    min-height: 8.2rem;
    padding: 1.2rem 1.8rem;
    border-radius: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    background: rgba(32, 26, 24, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.16);
  }

  .brand-link {
    display: inline-flex;
    align-items: center;
    gap: 1.2rem;
    min-width: 0;
  }

  .brand-mark {
    width: 5.6rem;
    height: 5.6rem;
    border-radius: 1.8rem;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .logo {
    width: 4.4rem;
    height: 4.4rem;
    object-fit: contain;
    display: block;
  }

  .brand-copy {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .brand-kicker {
    font-size: 1.05rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255, 210, 177, 0.78);
  }

  .brand-name {
    color: #fff8f1;
    font-size: 2rem;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 1rem 1rem 0;

    .header-shell {
      min-height: 7.4rem;
      padding: 1rem 1.2rem;
      border-radius: 2rem;
    }

    .brand-kicker {
      display: none;
    }

    .brand-name {
      font-size: 1.75rem;
    }

    .brand-mark {
      width: 5rem;
      height: 5rem;
    }

    .logo {
      width: 3.9rem;
      height: 3.9rem;
    }
  }
`;

export default Header;
