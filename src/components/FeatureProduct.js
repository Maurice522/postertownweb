import { useProductContext } from "../context/productcontex";
import styled from "styled-components";
import Product from "./Product";
import RotatingText from './RotatingText'
import { FiShoppingCart, FiShoppingBag } from 'react-icons/fi';
import { useCartContext } from "../context/cart_context";

const FeatureProduct = () => {
  const { isLoading, featureProducts } = useProductContext();

  if (isLoading) {
    return <div style={{textAlign: "center", backgroundColor: "black"}}> <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjAzM2VoenNoODI5aGczdXMzM3B1dWU1M3pzeDJjcGd5MjFsOTJ3YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uIJBFZoOaifHf52MER/giphy.gif"/> </div>;
  }

  const productList = [
    { id:"poster-006", 
      name: "Giyu Tomoioka", 
      image:"images/giyu.jpg", 
      price: 999, 
      category:"Anime",
      stock: 15 },
    { id:"batman-001", 
      name: "Batman", 
      image:"images/batmanneon.jpg", 
      price: 999, 
      category:"DC",
      stock: 20 },
    { id:"deadpool-001", 
      name: "Deadpool", 
      image:"images/deadpool.jpg", 
      price: 999, 
      category:"Marvel",
      stock: 25 },
  ]

  const productList2 = [
    { id:"movie-001", 
      name: "Optimus Prime", 
      image:"images/optimusprime.jpg", 
      price: 999, 
      category:"Movie",
      stock: 12 },
    { id:"car-001", 
      name: "GT3 RS", 
      image:"images/gt3rswhite.jpg", 
      price: 999, 
      category:"Car",
      stock: 8 },
    { id:"games-001", 
      name: "Modern Warfare 2", 
      image:"images/mw2.jpg", 
      price: 999, 
      category:"Games",
      stock: 20 },
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

    .card-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
      justify-content: center;
    }

    .btn {
      padding: 0.8rem 1.2rem;
      border: 0.1rem solid rgb(98 84 243);
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1.1rem;
      text-transform: capitalize;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &.add-to-cart {
        background-color: white;
        color: rgb(98 84 243);
        &:hover {
          background-color: rgb(98 84 243);
          color: white;
        }
      }

      &.buy-now {
        background-color: rgb(98 84 243);
        color: white;
        &:hover {
          background-color: white;
          color: rgb(98 84 243);
        }
      }
    }
  }
`;

export default FeatureProduct;
