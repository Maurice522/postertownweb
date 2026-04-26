import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiArrowUp } from "react-icons/fi";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <Button onClick={scrollToTop} className="scroll-top-btn">
      <FiArrowUp />
      <span className="btn-text">Top</span>
    </Button>
  );
};

const Button = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.btn};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  font-size: 1.4rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  z-index: 1000;

  .btn-text {
    font-size: 0.85rem;
    font-weight: bold;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  }
`;

export default ScrollButton;