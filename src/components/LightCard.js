import React, { useState, useEffect } from 'react';
import './LightCard.css'; // Assuming the CSS is in a separate file

const LightCard = ({ dataImage, header, content }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const [mouseLeaveDelay, setMouseLeaveDelay] = useState(null);

  useEffect(() => {
    const cardElement = document.querySelector('.light-card-wrap');
    setCardDimensions({
      width: cardElement.offsetWidth,
      height: cardElement.offsetHeight,
    });
  }, []);

  const handleMouseMove = (e) => {
    const card = e.target;
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    setMouseX(e.pageX - card.offsetLeft - width / 2);
    setMouseY(e.pageY - card.offsetTop - height / 2);
  };

  const handleMouseEnter = () => {
    clearTimeout(mouseLeaveDelay);
  };

  const handleMouseLeave = () => {
    setMouseLeaveDelay(setTimeout(() => {
      setMouseX(0);
      setMouseY(0);
    }, 1000));
  };

  // Reduced sensitivity by modifying the angle range
  const mousePX = mouseX / cardDimensions.width;
  const mousePY = mouseY / cardDimensions.height;

  const cardStyle = {
    transform: `rotateY(${mousePX * 2}deg) rotateX(${mousePY * -2}deg)`, // Reduced rotation
  };

  const cardBgTransform = {
    transform: `translateX(${mousePX * 0}px) translateY(${mousePY * 0}px)`, // Reduced the transform
  };

  const cardBgImage = {
    backgroundImage: `url(${dataImage})`,
  };

  return (
    <div
      className="light-card-wrap"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="light-card" style={cardStyle}>
        <div className="light-card-bg" style={{ ...cardBgTransform, ...cardBgImage }}></div>
        <div className="light-card-info">
          <h1 style={{color:"white"}}>{header}</h1>
          <p style={{color:"white"}}>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default LightCard;
