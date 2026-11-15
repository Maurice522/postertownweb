import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { POLICY_UPDATED, policies, policyByPath } from "./data/policies";
import { usePageMeta } from "./utils/pageMeta";

// Shipping, refund, privacy and terms pages. The words live in data/policies.js, which
// the Cloudflare Worker also serves to search engines.
const PolicyPage = () => {
  const { pathname } = useLocation();
  const policy = policyByPath[pathname];
  usePageMeta({ title: policy.metaTitle, description: policy.description });
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <Wrapper>
      <header>
        <span className="eyebrow">Store policies</span>
        <h1>{policy.title}</h1>
        <p>{policy.intro}</p>
      </header>

      {policy.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {(section.paragraphs || []).map((text) => (
            <p key={text}>{text}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <p className="updated">Last updated: {POLICY_UPDATED}</p>
      <nav className="policy-links" aria-label="Store policies">
        {policies
          .filter((item) => item.path !== pathname)
          .map((item) => (
            <Link key={item.path} to={item.path}>
              {item.title}
            </Link>
          ))}
      </nav>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  width: min(100% - 3.2rem, 82rem);
  margin: 0 auto;
  padding: 4rem 0 6rem;
  color: #3d342e;
  font-size: 1.7rem;
  line-height: 1.7;

  .eyebrow {
    color: #8a7c70;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    color: #231f20;
    font-size: clamp(3rem, 5vw, 4.4rem);
    line-height: 1.1;
    margin: 0.8rem 0 1.6rem;
  }

  h2 {
    color: #231f20;
    font-size: 2.1rem;
    margin: 3.2rem 0 1rem;
  }

  ul {
    list-style: disc;
    padding-left: 2.2rem;
    display: grid;
    gap: 0.6rem;
  }

  .updated {
    color: #8a7c70;
    font-size: 1.4rem;
    margin-top: 4rem;
  }

  .policy-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
    margin-top: 1.6rem;
  }

  .policy-links a {
    color: #231f20;
    font-weight: 700;
    text-decoration: underline;
  }
`;

export default PolicyPage;
