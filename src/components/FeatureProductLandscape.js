import { useProductContext } from "../context/productcontex";
import styled from "styled-components";
import Product from "./Product";
import RotatingText from './RotatingText';
import { CardBody, CardContainer, CardItem } from "./3dcard";
import './Tailwind.css';

const FeatureProductLandscape = () => {
  const { isLoading, featureProducts } = useProductContext();

  if (isLoading) {
    return <div style={{textAlign: "center", backgroundColor: "black"}}> <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjAzM2VoenNoODI5aGczdXMzM3B1dWU1M3pzeDJjcGd5MjFsOTJ3YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uIJBFZoOaifHf52MER/giphy.gif"/> </div>;
  }

  const productList = [
    { id:1, 
      name: "Solo Leveling", 
      image:"images/sololeveling.jpeg", 
      price:"99900", 
      category:"Anime" },
    { id:2, 
      name: "Luffy", 
      image:"images/luffyland.jpg", 
      price:"99900", 
      category:"Anime" },
    
  ]

  const productList2 = [
    { id:1, 
      name: "Pikachu", 
      image:"images/pikachuland.jpg", 
      price:"99900", 
      category:"Anime" },
    { id:2, 
      name: "Minion", 
      image:"images/minionland.jpg", 
      price:"99900", 
      category:"Cartoon" },
   
  ]

  return (
    <Wrapper className="section">
      <div className="container">
        {/* <div className="intro-data">Check Now!</div> */}
       
        <div className="common-heading">
          <RotatingText
          texts={['Landscape', 'Awesome']}
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
        <div className="grid grid-two-column">
          {productList.map((curElem) => {
            return (
              <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  Make things float in air
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  Hover over this card to unleash the power of CSS perspective
                </CardItem>
                <CardItem translateZ="100" className="w-full mt-4">
                  <img
                    src={curElem.image}
                    height="1000"
                    width="1000"
                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt="thumbnail"
                  />
                </CardItem>
                <div className="flex justify-between items-center mt-20">
                  <CardItem
                    translateZ={20}
                    as="a"
                    href="https://twitter.com/mannupaaji"
                    target="__blank"
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Try now →
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Sign up
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>

            )
          })}
        </div>
        <div className="grid grid-two-column mgtop">
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
    padding-top: 3rem;

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

export default FeatureProductLandscape;
