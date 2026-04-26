import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles/Button";
import SplitText from "./SplitText";
import Magnet from './Magnet'
import Aurora from './Aurora';
import PixelCard from './PixelCard';
import SpotlightCard from './SpotlightCard';
import React, { useEffect, useRef } from 'react';

const HeroSection = ({ myData }) => {
  const { name } = myData;

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
  
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;

    const handleMouseMove = (e) => {
      const rect = image.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = (x - rect.width / 2) / (rect.width / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);

      image.style.transform = `perspective(500px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
    };

    const handleMouseLeave = () => {
      image.style.transform = 'none';
    };

    if (image) {
      image.addEventListener('mousemove', handleMouseMove);
      image.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (image) {
        image.removeEventListener('mousemove', handleMouseMove);
        image.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div>
      {/* <Aurora
        colorStops={["#017ED5", "#00FF85", "#017ED5"]}
        blend={0.3}
        amplitude={1.0}
        speed={1.0}
      /> */}
    <Wrapper>
      
      <div className="container">
        <div className="grid grid-two-column">
          <div className="hero-section-data">
            <p className="intro-data">Welcome to </p>
            <SplitText
              text="Poster Town !"
              className="logotxt"
              delay={100}
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              easing="easeOutCubic"
              threshold={0.2}
              rootMargin="-50px"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            <p className="zain-bold">
            Transform your space with bold, quirky metal posters from Poster Town—where every wall <b className="zain-bold" style={{color:"#1D1D1D", backgroundColor:"#ffff00"}}> Becomes a statement. </b>
            </p>
            <Magnet padding={1000} disabled={false} magnetStrength={50}>
            <NavLink>
              <Button>show now</Button>
            </NavLink>
            </Magnet>
          </div>
          {/* our homepage image  */}
          <div className="hero-section-image">
              <div className="hoverImageWrapper">
              <img
                ref={imageRef}
                src="images/rengokuext.jpg"
                alt="hero-section-photo"
                className="img-style hoverImage"
                style={{width: "200%" , marginTop:"6%" , marginBottom: "8%"}}
              />
              </div>
          </div>
        </div>
      </div>
    </Wrapper>
    </div>
  );
};

const Wrapper = styled.section`
  padding: 0rem 0;
  padding-left: 5rem;
  padding-bottom: 2rem;
  img {
    min-width: 10rem;
    height: 10rem;
  }

  .hero-section-data {
    padding-top: 12rem;
    p {
      margin: 2rem 0;
      font-size:26px;
    }
    
    .zain-extralight {
  font-family: "Zain", sans-serif;
  font-weight: 200;
  font-style: normal;
}

.zain-light {
  font-family: "Zain", sans-serif;
  font-weight: 300;
  font-style: normal;
}

.zain-regular {
  font-family: "Zain", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.zain-bold {
  font-family: "Zain", sans-serif;
  font-weight: 700;
  font-style: normal;
}

.zain-extrabold {
  font-family: "Zain", sans-serif;
  font-weight: 800;
  font-style: normal;
}

.zain-black {
  font-family: "Zain", sans-serif;
  font-weight: 900;
  font-style: normal;
}

.zain-light-italic {
  font-family: "Zain", sans-serif;
  font-weight: 300;
  font-style: italic;
}

.zain-regular-italic {
  font-family: "Zain", sans-serif;
  font-weight: 400;
  font-style: italic;
}


    h1 {
      text-transform: capitalize;
      font-weight: bold;
      color :  ${({ theme }) => theme.colors.charcoal};

    }
    
    .logotxt 
    {
      font-size: 30px;
      text-transform: capitalize;
      font-weight: bold;
      color :  #1D1D1D};

    }

    .intro-data {
      margin-bottom: 0;
      color :  ${({ theme }) => theme.colors.red2};
    }
  }

  .hero-section-image {
    width: 70%;
    margin-left: 18%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:5%;
    margin-bottom: 5%
  }
  figure {
    position: relative;

    &::after {
      content: "";
      width: 60%;
      height: 80%;
      background-color: rgba(81, 56, 238, 0.4);
      position: absolute;
      left: 50%;
      top: -5rem;
      z-index: -1;
    }
  }
  .img-style {
    width: 200%;
    height: auto;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .grid {
      gap: 10rem;
    }

    figure::after {
      content: "";
      width: 50%;
      height: 100%;
      left: 0;
      top: 10%;
      /* bottom: 10%; */
      background-color: rgba(81, 56, 238, 0.4);
    }
  }
  .hoverImageWrapper {
  display: inline-block;
  perspective: 500px;
}
.hoverImage {
  height: 480px;           /* Keeps the image height */
  width: auto;             /* Maintain aspect ratio */
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.1s ease-out;
  will-change: transform;
}
`;

export default HeroSection;
