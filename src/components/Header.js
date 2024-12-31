import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Nav from "./Nav";

const Header = () => {
  return (
    <MainHeader>
      <NavLink to="/">
      <div className="logocontainer">s
        <img
          src="images/PosterTownc.png"
          alt="Logo"
          className="logo"
        />
        
          <h1 className="logotxt">
            POSTER TOWN
          </h1>
        </div>
      </NavLink>
      <Nav />
    </MainHeader>
  );
};

const MainHeader = styled.header`
  padding: 0 4.8rem;
  height: 10rem;
  background-color: ${({ theme }) => theme.colors.navbg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  color: white;
  .logo {
    height: 6.5rem;
  }
  .logotxt {
    font-size: 18px;
    background-color: white;
    padding: 4px 8px;
    border-radius: 20px;
    height: 35px;
    margin-top: 15px;
    margin-left: 10px;
  }
  .logocontainer{
    display: flex;
    flex-direction: row;
  }
`;
export default Header;
