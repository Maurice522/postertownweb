import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Work Sans", sans-serif;
  font-family: "Urbanist", sans-serif;
}


html {
  font-size: 62.5%;
  /* scroll-behavior: smooth; */
  /* 1rem = 10px */
  overflow-x: hidden;
}

body {
  overflow-x: hidden;
   scrollbar-color: rgb(98 84 243);
    scrollbar-width: thin;
}

body::-webkit-scrollbar {
  width: 1.5rem;
}

body::-webkit-scrollbar-track {
   background-color: rgb(24 24 29);
}

body::-webkit-scrollbar-thumb {
 
  background: #fff;
    border: 5px solid transparent;
    border-radius: 9px;
    background-clip: content-box;
}

h1,
h2,
h3,
h4 {
   font-family: "Work Sans", sans-serif;
   font-family: "Urbanist", sans-serif;

}

h1 {
  color: ${({ theme }) => theme.colors.heading};
  font-size: 6rem;
  font-weight: 900;
}

 h2 {
   color: ${({ theme }) => theme.colors.heading};
   font-size: 4.4rem;
   font-weight: 300;
   white-space: normal;
  
  }

h3 {
  font-size: 1.8rem;
  font-weight: 400;
}

p, button {
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.65rem;
  line-height: 1.5;
  font-weight:400;
}

a {
  text-decoration: none;
}

li {
  list-style: none;
}


${"" /* resuable code section  */}

.container {
  max-width: 120rem;
  margin: 0 auto;
}

.grid {
  display: grid;
  gap: 9rem;
}

.grid-two-column {
  grid-template-columns: repeat(2, 1fr);
}

.grid-three-column {
  grid-template-columns: repeat(3, 1fr);
}

.grid-four-column{
   grid-template-columns: 1fr 1.2fr .5fr .8fr ;
}

.grid-five-column{
  grid-template-columns: repeat(5, 1fr);
}

  .common-heading {
      font-size: 3.8rem;
      font-weight: 600;
      margin-bottom: 6rem;
      text-transform: capitalize;
    }

     .intro-data {
      margin-bottom: 0;
      text-transform: uppercase;
      color: #5138ee;
    }

   .caption {
      position: absolute;
      top: 15%;
      right: 10%;
      text-transform: uppercase;
      background-color: ${({ theme }) => theme.colors.bg};
      color: ${({ theme }) => theme.colors.helper};
      padding: 0.8rem 2rem;
      font-size: 1.2rem;
      border-radius: 2rem;
    }

input, textarea{
    max-width: 50rem;
    color: ${({ theme }) => theme.colors.black};
    padding: 1.6rem 2.4rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    text-transform: uppercase;
   box-shadow: ${({ theme }) => theme.colors.shadowSupport};
}
    input[type="submit"]{
    max-width: 16rem;
    margin-top: 2rem;
    background-color: ${({ theme }) => theme.colors.btn};
    color: ${({ theme }) => theme.colors.white};
    padding: 1.4rem 2.2rem;
    border-style: solid;
    border-width: .1rem;
    text-transform: uppercase;
    font-size: 1.8rem;
    cursor: pointer;
    }

@media (max-width: ${({ theme }) => theme.media.tab}) {
    .container {
    max-width: 130rem;
    padding: 0 3.2rem;
  }
  }

   @media (max-width: ${({ theme }) => theme.media.mobile}) {
       html {
      font-size: 50%;
    }

.grid{
  gap: 3.2rem;
}
      .grid-two-column , .grid-three-column, .grid-four-column{
          grid-template-columns: 1fr;
        }
    }

/* Image loader (components/LoadingImage.js) */
.pt-img.is-loading:not(.pt-img--self) {
  opacity: 0;
}

.pt-img.is-revealing {
  animation: ptImgReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.pt-img--self.is-loading {
  background: linear-gradient(110deg, #eadccb 30%, #fbf5ee 50%, #eadccb 70%) 100% 0 / 250% 100%;
  animation: ptShimmer 1.4s linear infinite;
}

.pt-img-loader {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: grid;
  place-items: center;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  background: linear-gradient(110deg, #efe3d4 30%, #fbf6f0 50%, #efe3d4 70%) 100% 0 / 250% 100%;
  animation: ptShimmer 1.4s linear infinite;
}

/* A blank metal sheet with a light glint sweeping across it. */
.pt-img-loader-poster {
  position: relative;
  height: min(62%, 22rem);
  aspect-ratio: 1 / 1.414;
  border-radius: 0.4rem;
  overflow: hidden;
  background: linear-gradient(160deg, #d9cfc4 0%, #b9aca0 45%, #e4dbd1 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 14px 26px rgba(60, 38, 22, 0.18);
  animation: ptFloat 1.8s ease-in-out infinite;
}

.pt-img-loader-poster::after {
  content: "";
  position: absolute;
  top: -20%;
  left: -60%;
  width: 45%;
  height: 140%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0) 100%);
  transform: skewX(-20deg);
  animation: ptGlint 1.6s ease-in-out infinite;
}

@keyframes ptShimmer {
  to {
    background-position: 0 0;
  }
}

@keyframes ptGlint {
  0% {
    left: -60%;
  }
  60%,
  100% {
    left: 120%;
  }
}

@keyframes ptFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.6rem);
  }
}

@keyframes ptImgReveal {
  from {
    opacity: 0;
    filter: blur(14px) saturate(0.6);
  }
  to {
    opacity: 1;
    filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pt-img-loader,
  .pt-img-loader-poster,
  .pt-img-loader-poster::after,
  .pt-img--self.is-loading,
  .pt-img.is-revealing {
    animation: none;
  }
}

`;
