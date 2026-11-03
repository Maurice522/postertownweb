import styled, { css } from "styled-components";

// Placeholders shown while the catalog loads. They take the same space as the real
// cards so nothing jumps when products arrive. The shimmer animation (ptShimmer) and
// the poster glint come from GlobalStyle.

const shimmer = css`
  background: linear-gradient(110deg, #efe3d4 30%, #fbf6f0 50%, #efe3d4 70%) 100% 0 / 250% 100%;
  animation: ptShimmer 1.4s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Bar = styled.span`
  display: block;
  height: ${({ $h = "1.4rem" }) => $h};
  width: ${({ $w = "100%" }) => $w};
  border-radius: 0.6rem;
  ${shimmer}
`;

export const ProductCardSkeleton = ({ landscape = false }) => (
  <Card $landscape={landscape} aria-hidden="true">
    <div className="sk-image">
      <span className="pt-img-loader-poster" />
    </div>
    <div className="sk-copy">
      <div className="sk-title">
        <Bar $h="2.2rem" $w="62%" />
        <Bar $h="2.2rem" $w="18%" />
      </div>
      <Bar $h="1.6rem" $w="86%" />
      <div className="sk-actions">
        <Bar $h="3.8rem" />
        <Bar $h="3.8rem" />
      </div>
    </div>
  </Card>
);

// A grid of card placeholders, announced once to screen readers.
export const ProductGridSkeleton = ({ count = 6, landscape = false, className = "product-grid" }) => (
  <div className={className} role="status" aria-label="Loading posters">
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} landscape={landscape} />
    ))}
  </div>
);

export const ProductListSkeleton = ({ count = 4 }) => (
  <ListGrid role="status" aria-label="Loading posters">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="sk-list-card" aria-hidden="true">
        <div className="sk-list-image">
          <span className="pt-img-loader-poster" />
        </div>
        <div className="sk-list-copy">
          <Bar $h="1.2rem" $w="30%" />
          <Bar $h="2.2rem" $w="70%" />
          <Bar $w="92%" />
          <Bar $w="80%" />
          <Bar $h="3.6rem" $w="40%" />
        </div>
      </div>
    ))}
  </ListGrid>
);

// One home page collection band: heading, button and a row of poster tiles.
export const CollectionBandSkeleton = ({ tiles = 6 }) => (
  <Band role="status" aria-label="Loading collection">
    <div className="sk-band-shell">
      <div className="sk-band-head">
        <div className="sk-band-copy">
          <Bar $h="1.2rem" $w="9rem" />
          <Bar $h="3.6rem" $w="min(36rem, 80%)" />
          <Bar $w="min(48rem, 95%)" />
        </div>
        <Bar $h="4.4rem" $w="18rem" className="sk-band-cta" />
      </div>
      <div className="sk-band-row">
        {Array.from({ length: tiles }, (_, index) => (
          <div key={index} className="sk-tile" aria-hidden="true">
            <div className="sk-tile-frame" />
            <Bar $w="80%" />
            <Bar $w="35%" />
          </div>
        ))}
      </div>
    </div>
  </Band>
);

const Card = styled.div`
  height: 100%;
  background: linear-gradient(180deg, #fffaf3 0%, #f6ecdf 100%);
  border: 1px solid #eadfce;
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 16px 28px rgba(60, 38, 22, 0.08);

  .sk-image {
    position: relative;
    display: grid;
    place-items: center;
    height: ${({ $landscape }) => ($landscape ? "30rem" : "31rem")};
    padding: 2.4rem 1.5rem;
    ${shimmer}
  }

  .sk-image .pt-img-loader-poster {
    height: 82%;
    ${({ $landscape }) => $landscape && "aspect-ratio: 1.414 / 1; height: auto; width: 82%;"}
  }

  /* Same heights as the real card's copy: title, one line of text, two buttons. */
  .sk-copy {
    display: grid;
    gap: 0.8rem;
    padding: 1.25rem;
  }

  .sk-title {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .sk-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
  }

  /* Matches the real card on phones, where its frame grows (Product.js). */
  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .sk-image {
      height: ${({ $landscape }) => ($landscape ? "36rem" : "46rem")};
      padding: 3rem;
    }
  }
`;

const ListGrid = styled.div`
  display: grid;
  gap: 1.6rem;

  .sk-list-card {
    display: grid;
    grid-template-columns: minmax(18rem, 26rem) minmax(0, 1fr);
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    overflow: hidden;
  }

  .sk-list-image {
    display: grid;
    place-items: center;
    min-height: 25rem;
    ${shimmer}
  }

  .sk-list-image .pt-img-loader-poster {
    height: 70%;
  }

  .sk-list-copy {
    display: grid;
    align-content: center;
    gap: 1.2rem;
    padding: 2.4rem;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .sk-list-card {
      grid-template-columns: 1fr;
    }

    .sk-list-image {
      min-height: 20rem;
    }
  }
`;

const Band = styled.section`
  padding: 7rem 2.4rem;
  background: #231d1a;

  .sk-band-shell {
    width: min(100%, 148rem);
    margin: 0 auto;
  }

  .sk-band-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
    margin-bottom: 3.2rem;
  }

  .sk-band-copy {
    display: grid;
    gap: 1.2rem;
    flex: 1;
  }

  .sk-band-row {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 1.8rem;
  }

  .sk-tile {
    display: grid;
    gap: 0.9rem;
  }

  .sk-tile-frame {
    aspect-ratio: 1 / 1.414;
    border-radius: 0.8rem;
    ${shimmer}
  }

  /* Dark band: dim the light shimmer so it sits on the wall colour. */
  span,
  .sk-tile-frame {
    opacity: 0.16;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .sk-band-row {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 5rem 1.4rem;

    .sk-band-head {
      flex-direction: column;
      align-items: flex-start;
    }

    .sk-band-row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;
