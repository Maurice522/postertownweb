import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FiShoppingCart } from "react-icons/fi";
import { CgMenuRight, CgClose } from "react-icons/cg";
import { useCartContext } from "../context/cart_context";
import { useAuth0 } from "@auth0/auth0-react";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { total_item } = useCartContext();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const closeMenu = () => setMenuOpen(false);

  return (
    <NavWrap>
      <div className={menuOpen ? "navbar active" : "navbar"}>
        <ul className="navbar-lists">
          <li>
            <NavLink to="/" className="navbar-link" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="navbar-link" onClick={closeMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className="navbar-link" onClick={closeMenu}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="navbar-link" onClick={closeMenu}>
              Contact
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          {isAuthenticated && user?.name ? (
            <span className="user-login--name">Hi, {user.name.split(" ")[0]}</span>
          ) : null}

          {isAuthenticated ? (
            <button
              type="button"
              className="auth-button ghost"
              onClick={() => {
                closeMenu();
                logout({ returnTo: window.location.origin });
              }}>
              Log out
            </button>
          ) : (
            <button
              type="button"
              className="auth-button"
              onClick={() => {
                closeMenu();
                loginWithRedirect();
              }}>
              Log in
            </button>
          )}

          <NavLink to="/cart" className="cart-trolley--link" onClick={closeMenu} aria-label="Cart">
            <FiShoppingCart className="cart-trolley" />
            <span className="cart-total--item">{total_item || 0}</span>
          </NavLink>
        </div>

        <button
          type="button"
          className="mobile-navbar-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <CgClose className="mobile-nav-icon" /> : <CgMenuRight className="mobile-nav-icon" />}
        </button>
      </div>
    </NavWrap>
  );
};

const NavWrap = styled.nav`
  .navbar {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .navbar-lists {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .navbar-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 4.4rem;
    padding: 0 1.4rem;
    border-radius: 999px;
    color: rgba(255, 245, 236, 0.82);
    font-size: 1.42rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
  }

  .navbar-link:hover,
  .navbar-link.active {
    color: #fff8f1;
    background: rgba(255, 255, 255, 0.08);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 0.8rem;
  }

  .user-login--name {
    color: rgba(255, 220, 194, 0.84);
    font-size: 1.28rem;
    white-space: nowrap;
  }

  .auth-button {
    min-height: 4.6rem;
    border: none;
    border-radius: 999px;
    padding: 0 1.8rem;
    background: linear-gradient(135deg, #ff855f 0%, #ff5c68 100%);
    color: #fff;
    font-size: 1.32rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
    box-shadow: 0 14px 26px rgba(255, 92, 104, 0.2);
  }

  .auth-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 32px rgba(255, 92, 104, 0.26);
  }

  .auth-button.ghost {
    background: rgba(255, 255, 255, 0.07);
    box-shadow: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff3e7;
  }

  .cart-trolley--link {
    position: relative;
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 1.6rem;
    display: grid;
    place-items: center;
    color: #fff8f1;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: transform 0.25s ease, background 0.25s ease;
  }

  .cart-trolley--link:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }

  .cart-trolley {
    font-size: 2.4rem;
  }

  .cart-total--item {
    min-width: 2.1rem;
    height: 2.1rem;
    padding: 0 0.45rem;
    position: absolute;
    top: -0.55rem;
    right: -0.45rem;
    background: linear-gradient(135deg, #ff6f52 0%, #ff4d63 100%);
    color: #fff;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-size: 1.1rem;
    font-weight: 700;
    border: 2px solid rgba(32, 26, 24, 0.9);
  }

  .mobile-navbar-btn {
    display: none;
    width: 4.8rem;
    height: 4.8rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.06);
    color: #fff8f1;
    cursor: pointer;
  }

  .mobile-nav-icon {
    font-size: 2.8rem;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .navbar-link {
      padding: 0 1rem;
      font-size: 1.3rem;
    }

    .auth-button {
      padding: 0 1.4rem;
    }

    .user-login--name {
      display: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .navbar {
      position: relative;
    }

    .mobile-navbar-btn {
      display: grid;
      place-items: center;
      z-index: 1001;
    }

    .navbar-lists,
    .nav-actions {
      position: fixed;
      left: 1rem;
      right: 1rem;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-1.2rem);
      transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
    }

    .navbar-lists {
      top: 8.8rem;
      flex-direction: column;
      align-items: stretch;
      gap: 0.8rem;
      padding: 1.4rem;
      border-radius: 2rem 2rem 0 0;
      background: rgba(28, 22, 21, 0.97);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: none;
      z-index: 1000;
    }

    .nav-actions {
      top: calc(8.8rem + 24rem);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
      padding: 0 1.4rem 1.4rem;
      border-radius: 0 0 2rem 2rem;
      background: rgba(28, 22, 21, 0.97);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-top: none;
      z-index: 1000;
      margin-left: 0;
    }

    .active .navbar-lists,
    .active .nav-actions {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .navbar-link,
    .auth-button,
    .cart-trolley--link {
      width: 100%;
      justify-content: center;
    }

    .cart-trolley--link {
      height: 5rem;
    }

    .user-login--name {
      display: block;
      text-align: center;
    }
  }
`;

export default Nav;
