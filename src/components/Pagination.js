import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Page numbers to show: the first, the last and two either side of the current one,
// with "…" where pages are skipped (1 … 4 5 6 7 8 … 12).
function pageList(page, pageCount) {
  const pages = new Set([1, pageCount, page - 2, page - 1, page, page + 1, page + 2]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);
  return sorted.flatMap((value, index) => (index && value - sorted[index - 1] > 1 ? ["gap", value] : [value]));
}

const Pagination = ({ page, pageCount, total, pageSize, onPageChange }) => {
  if (pageCount <= 1) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);

  return (
    <Wrapper aria-label="Product pages">
      <p className="page-summary">
        Showing <strong>{first}–{last}</strong> of {total}
      </p>
      <div className="page-buttons">
        <button type="button" className="page-step" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <FiChevronLeft /> Previous
        </button>
        {pageList(page, pageCount).map((value, index) =>
          value === "gap" ? (
            <span key={`gap-${index}`} className="page-gap">…</span>
          ) : (
            <button
              key={value}
              type="button"
              className={value === page ? "page-number active" : "page-number"}
              aria-current={value === page ? "page" : undefined}
              onClick={() => onPageChange(value)}>
              {value}
            </button>
          )
        )}
        <button type="button" className="page-step" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>
          Next <FiChevronRight />
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 2.4rem;
  padding: 1.2rem 1.4rem;
  background: rgba(255, 250, 243, 0.96);
  border: 1px solid #eadfce;
  border-radius: 1.8rem;

  .page-summary {
    color: #685d54;
    font-size: 1.4rem;
  }

  .page-summary strong {
    color: #231f20;
  }

  .page-buttons {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .page-number,
  .page-step {
    min-width: 4.1rem;
    height: 4.1rem;
    padding: 0 1.2rem;
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    background: #fff;
    color: #231f20;
    font-size: 1.4rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-number:hover,
  .page-step:not(:disabled):hover,
  .page-number.active {
    background: #231f20;
    color: #fff;
    border-color: #231f20;
  }

  .page-step:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .page-gap {
    color: #8a7c70;
    padding: 0 0.2rem;
  }
`;

export default Pagination;
