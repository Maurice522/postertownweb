import { Link } from "react-router-dom";
import styled from "styled-components";
import FaqSection from "./components/FaqSection";
import { aboutCopy } from "./data/aboutCopy";

// About the store. The words live in data/aboutCopy.js, which the Cloudflare Worker
// also serves to search engines.
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

const About = () => (
  <Wrapper>
    <header className="about-intro">
      <span className="eyebrow">About us</span>
      <h1>{aboutCopy.heading}</h1>
      <Paragraph pieces={aboutCopy.intro} />
    </header>

    <div className="about-grid">
      {aboutCopy.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <Paragraph pieces={section.paragraph} />
        </section>
      ))}
    </div>

    <FaqSection intro="Everything to know about our metal posters, delivery and offers." />
  </Wrapper>
);

const Wrapper = styled.section`
  width: min(100% - 3.2rem, 120rem);
  margin: 0 auto;
  padding: 4rem 0 2rem;
  color: #3d342e;

  .about-intro {
    max-width: 82rem;
    margin-bottom: 3.2rem;
  }

  .eyebrow {
    color: #8a7c70;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    color: #231f20;
    font-size: clamp(3.2rem, 5vw, 5rem);
    line-height: 1.1;
    margin: 0.8rem 0 1.6rem;
  }

  h2 {
    color: #231f20;
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1.7rem;
    line-height: 1.7;
  }

  a {
    color: #231f20;
    font-weight: 700;
    text-decoration: underline;
  }

  .about-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(32rem, 1fr));
    margin-bottom: 2rem;
  }

  .about-grid section {
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 2.4rem;
  }
`;

export default About;
