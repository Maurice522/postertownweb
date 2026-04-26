import { useProductContext } from "../context/productcontex";
import styled from "styled-components";
import Product from "./Product";
import RotatingText from './RotatingText'

const FeatureProduct = () => {
  const { isLoading, featureProducts } = useProductContext();

  if (isLoading) {
    return <div style={{textAlign: "center", backgroundColor: "black"}}> <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjAzM2VoenNoODI5aGczdXMzM3B1dWU1M3pzeDJjcGd5MjFsOTJ3YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uIJBFZoOaifHf52MER/giphy.gif"/> </div>;
  }

  const productList = [
    { id:1, 
      name: "Giyu Tomoioka", 
      image:"images/giyu.jpg", 
      price:"99900", 
      category:"Anime" },
    { id:2, 
      name: "Batman", 
      image:"images/batmanneon.jpg", 
      price:"99900", 
      category:"DC" },
    { id:3, 
      name: "Deadpool", 
      image:"images/deadpool.jpg", 
      price:"99900", 
      category:"Marvel" },
  ]

  const productList2 = [
    { id:1, 
      name: "Optimus Prime", 
      image:"images/optimusprime.jpg", 
      price:"99900", 
      category:"Movie" },
    { id:2, 
      name: "GT3 RS", 
      image:"images/gt3rswhite.jpg", 
      price:"99900", 
      category:"Car" },
    { id:3, 
      name: "Mordern Warfare 2", 
      image:"images/mw2.jpg", 
      price:"99900", 
      category:"Games" },
  ]

  return (
    <Wrapper className="section">
      <div className="container">
        {/* <div className="intro-data">Check Now!</div> */}
       
        <div className="common-heading">
          <RotatingText
          texts={['Anime', 'Artist', 'Cars', 'Cartoon', 'DC', 'Games','Marvel' ,'Movies', 'Scenery', 'Sports']}
          mainClassName=""
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName=""
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        /></div>
        <div className="grid grid-three-column">
          {productList.map((curElem) => {
            return <Product key={curElem.id} {...curElem} />;
          })}
        </div>
        <div className="grid grid-three-column mgtop">
          {productList2.map((curElem) => {
            return <Product key={curElem.id} {...curElem} />;
          })}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 9rem 0;
  background-color: ${({ theme }) => theme.colors.bg};

  .container {
    max-width: 120rem;
  }
  
  .mgtop{
    margin-top: 5%;
  }

  figure {
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition: all 0.5s linear;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      border-top-left-radius: 80px 80px;
      transition: all 0.2s linear;
      cursor: pointer;
    }
    &:hover::after {
      width: 100%;
    }
    &:hover img {
      transform: scale(1.2);
    }
    img {
      max-width:85%;
      max-height:420px;
      margin-top: 1.5rem;
      border-top-left-radius: 80px 80px;
      transition: all 0.2s linear;
    }

    .caption {
      box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
      top: 15%;
      right: 10%;
      text-transform: uppercase;
      background-color: ${({ theme }) => theme.colors.navbg};
      color: ${({ theme }) => theme.colors.red};
      padding: 0.8rem 2rem;
      font-size: 1.2rem;
      border-radius: 2rem;
    }
  }

  .card {
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
    background-color: ${({ theme }) => theme.colors.navbg};
    border-radius: 2rem;
    padding-bottom: 0.2rem;
    padding-top: 1rem;

    .card-data {
      padding: 0 2rem;
    }

    .card-data-flex {
      margin: 2rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h3 {
      color: white;
      text-transform: capitalize;
    }

    .card-data--price {
      color: ${({ theme }) => theme.colors.red};
    }

    .btn {
      margin: 2rem auto;
      background-color: rgb(0 0 0 / 0%);
      border: 0.1rem solid rgb(98 84 243);
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
        background-color: rgb(98 84 243);
      }

      &:hover a {
        color: #fff;
      }
      a {
        color: rgb(98 84 243);
        font-size: 1.4rem;
      }
    }
  }
`;

export default FeatureProduct;
