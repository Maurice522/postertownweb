import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

const renderArtwork = (image, className = "") => {
  if (!image) {
    return null;
  }

  if (image.variant === "desk") {
    return (
      <div className={`scene scene-desk ${className}`}>
        <div className="wall-art desk-art">
          <img src={image.url} alt={image.filename} />
        </div>
        <div className="desk-line" />
        <div className="desk-lamp" />
      </div>
    );
  }

  if (image.variant === "room") {
    return (
      <div className={`scene scene-room ${className}`}>
        <div className="wall-art room-art">
          <img src={image.url} alt={image.filename} />
        </div>
        <div className="sofa" />
        <div className="floor-shadow" />
      </div>
    );
  }

  if (image.variant === "closeup") {
    return (
      <div className={`scene scene-closeup ${className}`}>
        <img src={image.url} alt={image.filename} className="closeup-image" />
      </div>
    );
  }

  return (
    <div className={`scene scene-poster ${className}`}>
      <img src={image.url} alt={image.filename} className="poster-image" />
    </div>
  );
};

const MyImage = ({ imgs = [{ url: "" }] }) => {
  const [mainImage, setMainImage] = useState(imgs[0]);
  const thumbRailRef = useRef(null);

  useEffect(() => {
    setMainImage(imgs[0]);
  }, [imgs]);

  const scrollThumbs = (direction) => {
    if (!thumbRailRef.current) {
      return;
    }

    thumbRailRef.current.scrollBy({
      left: direction === "next" ? 180 : -180,
      behavior: "smooth",
    });
  };

  return (
    <Wrapper>
      <div className="main-screen">
        <span className="image-label">Premium metal print</span>
        {renderArtwork(mainImage, "main-artwork")}
        <div className="image-meta">
          <span>High-detail finish</span>
          <span>Wall-ready display</span>
        </div>
      </div>

      <div className="thumb-strip">
        <button type="button" className="thumb-scroll-btn" onClick={() => scrollThumbs("prev")}>
          <TbChevronLeft />
        </button>

        <div className="grid" ref={thumbRailRef}>
          {imgs.map((curElm, index) => {
            const isActive = mainImage?.filename === curElm.filename;

            return (
              <button
                key={index}
                type="button"
                className={isActive ? "thumb-frame active" : "thumb-frame"}
                onClick={() => setMainImage(curElm)}
              >
                {renderArtwork(curElm, "thumb-artwork")}
                <span>{curElm.label || `View ${index + 1}`}</span>
              </button>
            );
          })}
        </div>

        <button type="button" className="thumb-scroll-btn" onClick={() => scrollThumbs("next")}>
          <TbChevronRight />
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  .main-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, #fffdf8 0%, #f6ece0 100%);
    border: 1px solid #ead9c8;
    border-radius: 2.4rem;
    padding: 2rem;
    min-height: 58rem;
    position: relative;
    overflow: hidden;
  }

  .image-label {
    position: absolute;
    top: 1.6rem;
    left: 1.6rem;
    background: rgba(35, 31, 32, 0.92);
    color: #fff;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    z-index: 2;
  }

  .main-artwork {
    width: 100%;
    min-height: 45rem;
    animation: imageReveal 0.45s ease;
  }

  .scene {
    width: 100%;
    height: 100%;
    border-radius: 1.8rem;
    position: relative;
    overflow: hidden;
  }

  .scene img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .scene-poster {
    display: grid;
    place-items: center;
    background: radial-gradient(circle at top, #fff 0%, #f8efdf 58%, #edd9c6 100%);
  }

  .poster-image {
    max-width: 68%;
    max-height: 42rem;
    object-fit: contain;
    filter: drop-shadow(0 24px 26px rgba(0, 0, 0, 0.22));
  }

  .scene-closeup {
    background: linear-gradient(135deg, #1c1820 0%, #473a47 100%);
  }

  .closeup-image {
    transform: scale(1.28);
    transform-origin: center top;
  }

  .scene-desk {
    background: linear-gradient(180deg, #f4eee6 0%, #efe6dc 62%, #ccb197 62%, #c39e7b 100%);
  }

  .desk-line {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 9rem;
    height: 0.35rem;
    background: rgba(82, 55, 34, 0.35);
  }

  .desk-lamp {
    position: absolute;
    right: 12%;
    bottom: 9rem;
    width: 3rem;
    height: 11rem;
    border-radius: 2rem 2rem 0 0;
    background: linear-gradient(180deg, #2f2c32 0%, #0f0d11 100%);
    transform: rotate(12deg);
    box-shadow: -1.5rem -1rem 0 -0.9rem rgba(43, 40, 45, 0.95);
  }

  .wall-art {
    position: absolute;
    left: 50%;
    top: 44%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 1.1rem;
    border-radius: 1rem;
    box-shadow: 0 20px 34px rgba(0, 0, 0, 0.16);
  }

  .desk-art {
    width: 36%;
    height: 48%;
  }

  .desk-art img,
  .room-art img {
    object-fit: cover;
  }

  .scene-room {
    background: linear-gradient(180deg, #f8f5f2 0%, #ebe3db 68%, #d4c1af 68%, #c5ab94 100%);
  }

  .room-art {
    width: 32%;
    height: 40%;
  }

  .sofa {
    position: absolute;
    left: 50%;
    bottom: 6rem;
    transform: translateX(-50%);
    width: 52%;
    height: 8.2rem;
    border-radius: 2rem 2rem 1rem 1rem;
    background: linear-gradient(180deg, #9e8772 0%, #7a6655 100%);
    box-shadow: 0 1.8rem 2.2rem rgba(0, 0, 0, 0.16);
  }

  .floor-shadow {
    position: absolute;
    left: 50%;
    bottom: 3rem;
    transform: translateX(-50%);
    width: 42%;
    height: 1.2rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.14);
    filter: blur(0.6rem);
  }

  .thumb-strip {
    display: flex;
    gap: 1rem;
    align-items: stretch;
    padding: 0.4rem 0;
  }

  .thumb-scroll-btn {
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 999px;
    border: 1px solid #e7d8c7;
    background: #fffaf5;
    color: #2a241f;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
    flex-shrink: 0;
  }

  .thumb-scroll-btn:hover {
    background: #f3e3d2;
    transform: translateY(-1px);
  }

  .grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(10rem, 13rem);
    gap: 1rem;
    overflow-x: auto;
    overflow-y: visible;
    width: 100%;
    padding: 0.4rem 0.2rem 0.8rem;
  }

  .grid::-webkit-scrollbar {
    height: 0.6rem;
  }

  .grid::-webkit-scrollbar-thumb {
    background: #ddc5ab;
    border-radius: 999px;
  }

  .thumb-frame {
    border: 2px solid transparent;
    border-radius: 1.4rem;
    padding: 0.6rem;
    background: #fff;
    transition: border-color 0.2s ease, transform 0.25s ease, box-shadow 0.25s ease;
    text-align: left;
    cursor: pointer;
    position: relative;
  }

  .thumb-frame span {
    display: block;
    font-size: 1.15rem;
    color: #6b5f55;
    margin-top: 0.6rem;
  }

  .thumb-frame.active {
    border-color: #d86b35;
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(216, 107, 53, 0.16);
  }

  .thumb-artwork {
    height: 9rem;
  }

  .thumb-artwork .poster-image {
    max-width: 56%;
    max-height: 8rem;
  }

  .thumb-artwork .closeup-image {
    transform: scale(1.18);
  }

  .thumb-artwork .desk-art,
  .thumb-artwork .room-art {
    width: 42%;
    height: 48%;
  }

  .thumb-artwork .sofa {
    bottom: 1.8rem;
    height: 2.8rem;
  }

  .thumb-artwork .floor-shadow {
    bottom: 0.8rem;
  }

  .thumb-artwork .desk-line {
    bottom: 2.4rem;
  }

  .thumb-artwork .desk-lamp {
    bottom: 2.4rem;
    width: 1.4rem;
    height: 4.6rem;
  }

  .image-meta {
    display: flex;
    gap: 1rem;
    margin-top: 1.6rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .image-meta span {
    background: #fff;
    color: #5b5148;
    border: 1px solid #ebdfd2;
    border-radius: 999px;
    padding: 0.8rem 1.2rem;
    font-size: 1.25rem;
  }

  @keyframes imageReveal {
    from {
      opacity: 0;
      transform: scale(0.96);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .main-screen {
      min-height: auto;
      padding: 1.6rem;
    }

    .main-artwork {
      min-height: 32rem;
    }

    .grid {
      grid-auto-columns: minmax(9rem, 11rem);
    }
  }
`;

export default MyImage;
