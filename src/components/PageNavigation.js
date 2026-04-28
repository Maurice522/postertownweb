import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const PageNavigation = ({ title }) => {
  return (
    <Wrapper>
      <div className="breadcrumb-shell">
        <NavLink to="/">Home</NavLink>
        <span className="divider">/</span>
        <span className="current">{title}</span>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: transparent;
  padding: 2rem 0 0;

  .breadcrumb-shell {
    width: min(100%, 156rem);
    margin: 0 auto;
    padding: 0 2.4rem;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    color: #8a7d72;
    font-size: 1.45rem;
    line-height: 1;
  }

  a {
    color: #5f544b;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #cf6d3f;
  }

  .divider {
    color: #b4a79b;
  }

  .current {
    color: #231f20;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding-top: 1.4rem;

    .breadcrumb-shell {
      padding: 0 1.4rem;
      font-size: 1.3rem;
      gap: 0.7rem;
    }
  }
`;

export default PageNavigation;
