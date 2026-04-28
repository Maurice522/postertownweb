import { useProductContext } from "../context/productcontex";
import styled from "styled-components";
import Product from "./Product";
import RotatingText from './RotatingText'
import demonImage from './demonslayerall.jpg';
import VoyageSlider from "./VoyageSlider";
import LightCard from "./LightCard";
import ASCIIText from './ASCIIText';

const Collection = () => {
  const { isLoading, featureProducts } = useProductContext();

  if (isLoading) {
    return <div style={{textAlign: "center", backgroundColor: "black"}}> <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjAzM2VoenNoODI5aGczdXMzM3B1dWU1M3pzeDJjcGd5MjFsOTJ3YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uIJBFZoOaifHf52MER/giphy.gif"/> </div>;
  }

  const productList = [
    { id:1, 
      name: "Sanemi Shinazugawa", 
      image:"images/sanemi.jpg", 
      price:"99900", 
      category:"Anime" },
    { id:2, 
      name: "Inosuke", 
      image:"images/inosuke.jpg", 
      price:"99900", 
      category:"Anime" },
    { id:3, 
      name: "Tanjiro", 
      image:"images/tanjiro.jpg", 
      price:"99900", 
      category:"Anime" },
    { id:4, 
      name: "Giyu", 
      image:"images/giyuwater.jpg", 
      price:"99900", 
      category:"Anime" },
    { id:5, 
      name: "Zengitsu", 
      image:"images/zengitsu.jpg", 
      price:"99900", 
      category:"Anime" },
  ]


  return (
    <Wrapper className="section" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${demonImage})`, backgroundRepeat: "no-repeat", backgroundSize: 'cover',backgroundPosition: 'center',}}>
      <div className="container">
        {/* <div className="intro-data">Check Now!</div> */}
        {/* <ASCIIText
          text='Demon Slayer Collection'
          enableWaves={true}
          asciiFontSize={8}
        /> */}
        <h1 className="collhead permanent-marker-regular"> Demon Slayer Collection</h1>
       <div className="collection-row">
       {productList.map((curElem) => {
            return <LightCard
        key={curElem.id}
        dataImage={curElem.image}
        header={curElem.name}
        content="shuioadhuishduihsaui hsauishdui hsaiuh sahiud huisah uidhsaiu hiuashaius "
          />;
          })}
       </div>
        

        
        
        {/* <div className="grid grid-three-column">
          {productList.map((curElem) => {
            return <Product key={curElem.id} {...curElem} />;
          })}
        </div> */}
        {/* <div className="grid grid-three-column mgtop">
          {productList2.map((curElem) => {
            return <Product key={curElem.id} {...curElem} />;
          })}
        </div> */}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 9rem 0;
  background-color: ${({ theme }) => theme.colors.bg};

  .collhead{
  width: 100%;
  color:white;
  text-shadow: rgba(240, 46, 170, 0.4) 0px 5px, rgba(240, 46, 170, 0.3) 0px 10px, rgba(240, 46, 170, 0.2) 0px 15px, rgba(240, 46, 170, 0.1) 0px 20px, rgba(240, 46, 170, 0.05) 0px 25px;
  text-align: center;
  margin: 0px;
  font-size:72px;
  }

  .container {
    max-width: 188rem;
    margin: 0 auto;
    padding: 0 2rem;
    
  }

  .collection-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    width: 100%;
    gap: 1.6rem;
    align-items: stretch;
    margin: 5% auto 0;
    max-width: 100%;
  }

  .permanent-marker-regular {
  font-family: "Permanent Marker", cursive;
  font-weight: 800;
  font-style: normal;
}

.chokokutai-regular {
  font-family: "Chokokutai", system-ui;
  font-weight: 400;
  font-style: normal;
}
  .section{
    background-image: url('./images/demonslayerall.jpg');
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
      background-color: rgba(0, 0, 0, 0.5);
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

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .collhead {
      text-align: center;
      font-size: 5.6rem;
      padding: 0 2rem;
    }

    .container {
      max-width: 100%;
    }

    .collection-row {
      margin: 4rem auto 0;
      gap: 1.2rem;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 6rem 0;

    .collhead {
      font-size: 3.8rem;
      text-align: center;
      line-height: 1.2;
      padding: 0 1.4rem;
    }

    .collection-row {
      flex-wrap: wrap;
      margin: 3rem 1.4rem 0;
      gap: 1.2rem;
    }
  }
`;

export default Collection;
