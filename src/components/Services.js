import styled from "styled-components";
import { TbTruckDelivery } from "react-icons/tb";
import { MdSecurity } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { RiRefund2Fill } from "react-icons/ri";

const Services = () => {
  return (
    <Wrapper>
      <div className="container">
        <div className="grid grid-three-column">
          <div className="services-1">
            <div>
              <TbTruckDelivery color="#FF4C4C" className="icon" />
              <h3>Super Fast and Free Delivery</h3>
            </div>
          </div>

<div className="services-2">
            <div className="services-colum-2">
              <div>
                <RiRefund2Fill color="#FF4C4C" className="icon" />
                <h3>7 Day Refund Guaranteed</h3>
              </div>
            </div>
            <div className="services-colum-2">
              <div>
                <GiReceiveMoney color="#FF4C4C" className="icon" />
                <h3>Money-back Guaranteed</h3>
              </div>
            </div>
          </div>

          <div className="services-3">
            <div>
              <RiSecurePaymentLine color="#FF4C4C" className="icon" />
              <h3>Super Secure Payment System</h3>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 9rem 0;

  .grid {
    gap: 4.8rem;
  }

  .services-1,
  .services-2,
  .services-3 {
    width: auto;
    height: 30rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background: ${({ theme }) => theme.colors.navbg};
    text-align: center;
    border-radius: 2rem;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .services-2 {
    gap: 4rem;
    background-color: transparent;
    box-shadow: none;

    .services-colum-2 {
      background: ${({ theme }) => theme.colors.navbg};
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: center;
      align-items: center;
      border-radius: 2rem;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }
    }
  }

  h3 {
    margin-top: 1.4rem;
    font-size: 2rem;
    color: white;
  }

  .services-1 > div,
  .services-3 > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .icon {
    /* font-size: rem; */
    width: 8rem;
    height: 8rem;
    padding: 2rem;
    border-radius: 50%;
    background-color:${({ theme }) => theme.colors.navbg};
    border: 2px solid #FF4C4C;
    color: #5138ee;
  }

  @media (max-width: 1030px) {
    padding: 5rem 0;

    .services-2 {
      .services-colum-2 {
        width: 100%;
        min-height: 18rem;
        padding: 1.5rem;
      }
    }

    h3 {
      font-size: 1.8rem;
    }

    .icon {
      width: 7rem;
      height: 7rem;
      padding: 1.7rem;
    }

    .grid {
      gap: 3rem;
    }

    .container {
      margin: 40px;
    }
  }

  @media (max-width: 998px) {
    padding: 5rem 0;

    .services-1,
    .services-2,
    .services-3 {
      height: auto;
      min-height: 20rem;
      padding: 2rem 1rem;
    }

    .services-2 {
      gap: 2rem;

      .services-colum-2 {
        min-height: 15rem;
        padding: 1.5rem;
      }
    }

    h3 {
      font-size: 1.6rem;
      margin-top: 1rem;
    }

    .icon {
      width: 6rem;
      height: 6rem;
      padding: 1.5rem;
    }

    .grid {
      gap: 2.5rem;
    }
  }

  @media (max-width: 768px) {
    padding: 4rem 0;

    .grid {
      gap: 2rem;
    }

    .services-1,
    .services-2,
    .services-3 {
      min-height: auto;
      padding: 1.5rem 1rem;
    }

    .services-2 {
      flex-direction: column;
      gap: 1.5rem;

      .services-colum-2 {
        width: 100%;
        min-height: 12rem;
      }
    }

    h3 {
      font-size: 1.4rem;
    }

    .icon {
      width: 5rem;
      height: 5rem;
      padding: 1.2rem;
    }
  }
`;
export default Services;
