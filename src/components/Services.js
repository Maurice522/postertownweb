import styled from "styled-components";
import { TbTruckDelivery } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";
import { RiSecurePaymentLine, RiRefund2Fill } from "react-icons/ri";

const serviceItems = [
  {
    icon: TbTruckDelivery,
    title: "Fast Delivery",
    copy: "Quick dispatch and careful packaging for doorstep-ready wall art.",
  },
  {
    icon: RiRefund2Fill,
    title: "7 Day Returns",
    copy: "Easy support if your order arrives with an issue or is not the right fit.",
  },
  {
    icon: GiReceiveMoney,
    title: "Money-back Promise",
    copy: "A smoother buy with buyer-first resolution if something goes sideways.",
  },
  {
    icon: RiSecurePaymentLine,
    title: "Secure Payments",
    copy: "Protected checkout flow for cards, UPI, and the usual quick-pay options.",
  },
];

const Services = () => {
  return (
    <Wrapper>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Why Poster Town</span>
          <h2>Buying your next poster should feel easy.</h2>
        </div>

        <div className="services-grid">
          {serviceItems.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="service-card">
                <div className="icon-shell">
                  <Icon className="icon" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 8rem 0;
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);

  .container {
    max-width: 132rem;
  }

  .section-head {
    text-align: center;
    margin-bottom: 3.2rem;
  }

  .eyebrow {
    display: inline-block;
    background: #f8ebdc;
    color: #8a5c43;
    border-radius: 999px;
    padding: 0.55rem 0.95rem;
    font-size: 1.15rem;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: clamp(3rem, 4vw, 4.6rem);
    color: #231f20;
    font-weight: 700;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.8rem;
  }

  .service-card {
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 2rem 1.8rem;
    text-align: left;
    box-shadow: 0 14px 28px rgba(61, 41, 22, 0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 34px rgba(61, 41, 22, 0.1);
  }

  .icon-shell {
    width: 6.2rem;
    height: 6.2rem;
    border-radius: 1.6rem;
    background: linear-gradient(135deg, #231f20 0%, #4a372d 100%);
    display: grid;
    place-items: center;
    margin-bottom: 1.4rem;
  }

  .icon {
    color: #ff8e5b;
    width: 3rem;
    height: 3rem;
  }

  h3 {
    font-size: 2rem;
    color: #231f20;
    margin-bottom: 0.8rem;
    font-weight: 700;
  }

  p {
    color: #685d54;
    font-size: 1.45rem;
    line-height: 1.7;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .services-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 6rem 0;

    .section-head {
      margin-bottom: 2.4rem;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.4rem;
    }

    .service-card {
      padding: 1.8rem 1.6rem;
    }
  }
`;

export default Services;
