import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles/Button";
import SplitText from "./SplitText";
import Magnet from './Magnet'
import React, { useEffect, useRef } from 'react';

const HeroSection = ({ myData }) => {

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
    <Wrapper>
      <div className="hero">
        <div className="hero-copy">
          <p className="intro-data">Welcome to</p>
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
          <p className="hero-tagline">
            Transform your space with bold, quirky metal posters from Poster Town—where every wall <b>becomes a statement.</b>
          </p>
          <Magnet padding={1000} disabled={false} magnetStrength={50}>
            {/* A link styled as the button (a button nested in a link isn't valid HTML). */}
            <Button as={NavLink} to="/products" className="hero-cta">
              Shop now
            </Button>
          </Magnet>
        </div>
        <div className="hero-art">
          <img ref={imageRef} src="images/rengokuext.jpg" alt="Rengoku metal poster" className="hero-image" />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .hero {
    max-width: 132rem;
    margin: 0 auto;
    padding: 6rem 4rem 8rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    gap: 6rem;
    align-items: center;
  }

  .intro-data {
    margin: 0 0 0.8rem;
    color: ${({ theme }) => theme.colors.red2};
    font-size: 2.4rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .logotxt {
    margin: 0;
    color: #1d1d1d;
    font-size: clamp(3.6rem, 4.6vw, 5.6rem);
    font-weight: 800;
    line-height: 1.1;
    text-transform: uppercase;
  }

  .hero-tagline {
    max-width: 54rem;
    margin: 2.4rem 0 3.2rem;
    color: #3f3a36;
    font-family: "Zain", sans-serif;
    font-size: 2.6rem;
    font-weight: 700;
    line-height: 1.45;
  }

  .hero-tagline b {
    padding: 0 0.4rem;
    background: #ffff00;
    color: #1d1d1d;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  .hero-cta {
    display: inline-block;
    padding: 1.4rem 3.2rem;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .hero-art {
    perspective: 500px;
  }

  .hero-image {
    display: block;
    width: 100%;
    aspect-ratio: 23 / 15;
    object-fit: cover;
    border-radius: 1.2rem;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 40px 45px, rgba(0, 0, 0, 0.12) 0px -8px 24px, rgba(0, 0, 0, 0.12) 0px 4px 6px;
    transition: transform 0.1s ease-out;
    will-change: transform;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .hero {
      grid-template-columns: 1fr;
      gap: 4.8rem;
      padding: 4rem 3.2rem 6rem;
    }

    .hero-tagline {
      max-width: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .hero {
      gap: 4rem;
      padding: 3.2rem 2rem 5rem;
    }

    .intro-data {
      font-size: 2.2rem;
    }

    .logotxt {
      font-size: 3.8rem;
    }

    .hero-tagline {
      margin: 1.6rem 0 2.8rem;
      font-size: 2.6rem;
    }

    .hero-cta {
      font-size: 1.8rem;
      padding: 1.6rem 3.6rem;
    }

    .hero-image {
      box-shadow: rgba(0, 0, 0, 0.22) 0px 24px 30px, rgba(0, 0, 0, 0.1) 0px 4px 8px;
    }
  }
`;

export default HeroSection;
