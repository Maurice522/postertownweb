import { useState } from "react";
import LoadingImage from "./LoadingImage";
import styled from "styled-components";

// Up to three posters fanned out like prints laid on a table. Each image is
// { src, wide }; wide (landscape) prints get a landscape frame. The catalog's
// orientation is only a first guess: the real image shape wins once it loads.
const PosterFan = ({ images = [], size = "md" }) => {
  const [loadedShapes, setLoadedShapes] = useState({});

  return (
    <Fan className={`poster-fan fan-${size} fan-count-${Math.min(images.length, 3)}`}>
      {images.slice(0, 3).map((image, index) => {
        const wide = loadedShapes[image.src] ?? image.wide;
        return (
          <LoadingImage
            key={`${image.src}-${index}`}
            src={image.src}
            alt=""
            loading="lazy"
            overlay={false}
            className={`fan-poster fan-poster-${index}${wide ? " fan-wide" : ""}`}
            onLoad={(event) => {
              const isWide = event.currentTarget.naturalWidth > event.currentTarget.naturalHeight;
              setLoadedShapes((current) => (current[image.src] === isWide ? current : { ...current, [image.src]: isWide }));
            }}
          />
        );
      })}
    </Fan>
  );
};

const Fan = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .fan-poster {
    position: absolute;
    left: 50%;
    bottom: 0;
    height: 92%;
    max-width: 92%;
    aspect-ratio: 1 / 1.414;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 18px 34px rgba(20, 12, 8, 0.32);
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    transform-origin: 50% 100%;
  }

  /* Middle poster sits on top; the outer two peek out either side. */
  .fan-poster-0 {
    z-index: 3;
    transform: translateX(-50%);
  }

  .fan-poster-1 {
    z-index: 2;
    height: 82%;
    transform: translateX(-108%) rotate(-9deg);
  }

  .fan-poster-2 {
    z-index: 1;
    height: 82%;
    transform: translateX(8%) rotate(9deg);
  }

  &.fan-count-2 .fan-poster-0 {
    transform: translateX(-30%) rotate(4deg);
  }

  &.fan-count-2 .fan-poster-1 {
    transform: translateX(-82%) rotate(-7deg);
  }

  /* Landscape prints: wider frame, stacked a little higher so all three show. */
  .fan-wide {
    height: auto;
    width: 62%;
    max-height: 78%;
    aspect-ratio: 1.414 / 1;
  }

  .fan-wide.fan-poster-1 {
    width: 50%;
    bottom: 24%;
    transform: translateX(-92%) rotate(-7deg);
  }

  .fan-wide.fan-poster-2 {
    width: 50%;
    bottom: 24%;
    transform: translateX(-8%) rotate(7deg);
  }

  &.fan-sm .fan-poster {
    border-radius: 0.35rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .fan-poster {
      transition: none;
    }
  }
`;

export default PosterFan;
