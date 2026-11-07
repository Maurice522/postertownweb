import styled from "styled-components";
import { storeFaq } from "../data/faq";

// Visible FAQ plus the same questions as schema.org FAQPage data, which search
// engines read from the rendered page. Use it at most once per page.
const faqSchema = (items) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }).replace(/</g, "\\u003c");

const FaqSection = ({ items = storeFaq, title = "Frequently asked questions", intro, className = "" }) => (
  <Wrapper className={className} aria-labelledby="faq-heading">
    <h2 id="faq-heading">{title}</h2>
    {intro && <p className="faq-intro">{intro}</p>}
    <div className="faq-list">
      {items.map(({ question, answer }, index) => (
        <details key={question} className="faq-card" open={index === 0}>
          <summary>
            <h3>{question}</h3>
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(items) }} />
  </Wrapper>
);

const Wrapper = styled.section`
  background: #fffaf3;
  border: 1px solid #eadfce;
  border-radius: 2rem;
  padding: 3rem;

  h2 {
    font-size: clamp(2.4rem, 3vw, 3.2rem);
    margin-bottom: 0.6rem;
  }

  .faq-intro {
    color: #6a5e54;
    margin-bottom: 1.8rem;
  }

  .faq-list {
    display: grid;
    gap: 1.2rem;
    margin-top: 1.6rem;
  }

  .faq-card {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.6rem 1.8rem;
  }

  .faq-card summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.2rem;
  }

  .faq-card summary::-webkit-details-marker {
    display: none;
  }

  .faq-card summary::after {
    content: "+";
    font-size: 2.2rem;
    line-height: 1;
    color: #8a5c43;
    flex-shrink: 0;
  }

  .faq-card[open] summary::after {
    content: "−";
  }

  .faq-card h3 {
    font-size: 1.65rem;
    font-weight: 600;
    margin: 0;
  }

  .faq-card p {
    color: #645950;
    margin-top: 1rem;
    line-height: 1.7;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 2rem 1.6rem;
  }
`;

export default FaqSection;
