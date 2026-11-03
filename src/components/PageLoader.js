import styled from "styled-components";

// Shown wherever a page is still loading (its code or its data). It fades in after
// a moment, so quick loads don't flash a spinner. public/index.html has the same
// loader inline for the time before the app's code arrives; keep them alike.
const PageLoader = ({ label = "Loading" }) => (
  <Wrapper role="status" aria-live="polite">
    <span className="pt-loader-ring" aria-hidden="true" />
    <span className="pt-loader-label">{label}</span>
  </Wrapper>
);

const Wrapper = styled.div`
  min-height: 70vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1.4rem;
  opacity: 0;
  animation: ptLoaderIn 0.3s ease 0.25s forwards;

  .pt-loader-ring {
    width: 4.4rem;
    height: 4.4rem;
    border-radius: 50%;
    border: 0.4rem solid #eadfce;
    border-top-color: #231f20;
    animation: ptLoaderSpin 0.8s linear infinite;
  }

  .pt-loader-label {
    color: #8a7c70;
    font-size: 1.3rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @keyframes ptLoaderSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ptLoaderIn {
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pt-loader-ring {
      animation-duration: 2s;
    }
  }
`;

export default PageLoader;
