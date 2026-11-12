import { Link } from "react-router-dom";
import styled from "styled-components";
import { homeCopyIntro, homeCopySections } from "../data/homeCopy";

// About-the-store copy on the home page. The words live in data/homeCopy.js so the
// Cloudflare Worker can serve the same text to search engines.
const Paragraph = ({ pieces }) => (
  <p>
    {pieces.map((piece, index) =>
      Array.isArray(piece) ? (
        <Link key={index} to={piece[1]}>
          {piece[0]}
        </Link>
      ) : (
        piece
      )
    )}
  </p>
);

const HomeSeoCopy = () => (
  <Wrapper aria-labelledby="about-metal-posters">
    <header className="seo-intro">
      <h2 id="about-metal-posters">{homeCopyIntro.heading}</h2>
      <Paragraph pieces={homeCopyIntro.paragraph} />
    </header>

    <div className="seo-grid">
      {homeCopySections.map((section) => (
        <section key={section.heading} className={section.wide ? "wide" : undefined}>
          <h3>{section.heading}</h3>
          <Paragraph pieces={section.paragraph} />
        </section>
      ))}
    </div>
  </Wrapper>
);

const Wrapper = styled.section`
  width: min(100% - 3.2rem, 120rem);
  margin: 5rem auto 0;
  color: #3d342e;

  .seo-intro {
    max-width: 92rem;
    margin-bottom: 2.8rem;
  }

  h2 {
    font-size: clamp(2.6rem, 3.4vw, 3.8rem);
    line-height: 1.15;
    margin-bottom: 1.4rem;
  }

  h3 {
    font-size: 1.9rem;
    margin-bottom: 0.8rem;
    color: #231f20;
  }

  p {
    color: #5f544b;
    line-height: 1.8;
    font-size: 1.55rem;
  }

  .seo-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.4rem 3.2rem;
  }

  .seo-grid .wide {
    grid-column: 1 / -1;
  }

  .seo-grid section {
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 1.8rem;
    padding: 2.2rem 2.4rem;
  }

  a {
    color: #b4532a;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .seo-grid {
      grid-template-columns: 1fr;
      gap: 1.6rem;
    }

    .seo-grid section {
      padding: 1.8rem;
    }
  }
`;

export default HomeSeoCopy;
