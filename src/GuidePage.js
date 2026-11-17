import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useProductContext } from "./context/productcontex";
import { guideBySlug, guides, priceRanges } from "./data/guides";
import { usePageMeta } from "./utils/pageMeta";
import ErrorPage from "./ErrorPage";

// Buying guides (/guides and /guides/<slug>). The words live in data/guides.js, which
// the Cloudflare Worker also serves to search engines with Article schema.
const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const Pieces = ({ value }) =>
  (Array.isArray(value) ? value : [value]).map((piece, index) =>
    Array.isArray(piece) ? (
      <Link key={index} to={piece[1]}>
        {piece[0]}
      </Link>
    ) : (
      piece
    )
  );

const Block = ({ block, products }) => {
  if (block.h2) return <h2>{block.h2}</h2>;
  if (block.p)
    return (
      <p>
        <Pieces value={block.p} />
      </p>
    );
  if (block.list)
    return (
      <ul>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  if (block.steps)
    return (
      <ol>
        {block.steps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  const table = block.table || (block.priceTable && {
    head: ["Size", "Price range"],
    rows: priceRanges(products).map((range) => [range.label, range.min === range.max ? money(range.min) : `${money(range.min)} – ${money(range.max)}`]),
  });
  if (!table || !table.rows.length) return null;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {table.head.map((cell, index) => (
              <th key={index}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) => (index === 0 ? <th key={index}>{cell}</th> : <td key={index}>{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const GuidesIndex = () => {
  usePageMeta({
    title: "Metal Poster Guides – Hanging, Sizes & Prices | Metal Poster Town",
    description: "Guides to metal posters: what they are, how to hang one without drilling, how they compare with canvas and paper, and prices in India.",
  });
  return (
    <Wrapper>
      <header>
        <span className="eyebrow">Guides</span>
        <h1>Metal poster guides</h1>
        <p>Everything to know before you buy: what metal posters are, how to hang them, how they compare and what they cost.</p>
      </header>
      <ul className="guide-list">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link to={`/guides/${guide.slug}`}>
              <strong>{guide.title}</strong>
              <span>{guide.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

const GuidePage = () => {
  const { slug } = useParams();
  const guide = guideBySlug[slug];
  const { products } = useProductContext();
  usePageMeta(guide ? { title: guide.metaTitle, description: guide.description, type: "article" } : null);
  useEffect(() => window.scrollTo(0, 0), [slug]);
  if (!guide) return <ErrorPage />;

  return (
    <Wrapper>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/guides">Guides</Link>
      </nav>
      <header>
        <span className="eyebrow">Guide</span>
        <h1>{guide.title}</h1>
        <p className="intro">{guide.intro}</p>
      </header>
      {guide.blocks.map((block, index) => (
        <Block key={index} block={block} products={products} />
      ))}
      <aside className="more">
        <h2>More guides</h2>
        <ul>
          {guides
            .filter((item) => item.slug !== slug)
            .map((item) => (
              <li key={item.slug}>
                <Link to={`/guides/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
        </ul>
      </aside>
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

  .crumbs {
    color: #8a7c70;
    font-size: 1.4rem;
    margin-bottom: 1.6rem;
  }

  .crumbs a,
  p a,
  .more a {
    color: #231f20;
    font-weight: 700;
    text-decoration: underline;
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
    font-size: clamp(3rem, 5vw, 4.4rem);
    line-height: 1.1;
    margin: 0.8rem 0 1.6rem;
  }

  .intro {
    font-size: 1.9rem;
  }

  h2 {
    color: #231f20;
    font-size: 2.2rem;
    margin: 3.2rem 0 1rem;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  ul,
  ol {
    display: grid;
    gap: 0.8rem;
    padding-left: 2.4rem;
  }

  .table-wrap {
    overflow-x: auto;
    margin: 1.6rem 0;
  }

  table {
    border-collapse: collapse;
    font-size: 1.5rem;
    min-width: 52rem;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #eadfce;
    padding: 1rem 1.2rem;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    background: #231f20;
    color: #fff;
  }

  tbody th {
    background: #fffaf3;
    color: #231f20;
  }

  .guide-list {
    list-style: none;
    padding: 0;
    gap: 1.6rem;
  }

  .guide-list a {
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    color: inherit;
    display: grid;
    gap: 0.6rem;
    padding: 2rem 2.4rem;
    text-decoration: none;
  }

  .guide-list strong {
    color: #231f20;
    font-size: 2rem;
  }

  .more {
    border-top: 1px solid #eadfce;
    margin-top: 4rem;
  }
`;

export default GuidePage;
