import styled from "styled-components";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerService2Line, RiRefund2Fill, RiSecurePaymentLine, RiShieldCheckLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";

// Same support number used on the Orders page and in the footer.
const SUPPORT_WHATSAPP = "919953749307";

// Each promise leads with a concrete fact the store already commits to elsewhere
// (dispatch time, return window, sheet thickness, UPI checkout).
const serviceItems = [
  {
    icon: TbTruckDelivery,
    stat: "24–48 hrs",
    title: "Fast dispatch",
    copy: "Orders leave our studio within two days and reach most of India in 3–7 days.",
  },
  {
    icon: RiRefund2Fill,
    stat: "7 days",
    title: "Easy returns",
    copy: "Arrived damaged or not quite right? Tell us within 7 days and we will sort it out.",
  },
  {
    icon: RiShieldCheckLine,
    stat: "1 mm metal",
    title: "Built to last",
    copy: "Printed on galvanised steel that won't tear, curl, fade or rust like a paper poster.",
  },
  {
    icon: RiSecurePaymentLine,
    stat: "UPI",
    title: "Checked payments",
    copy: "Pay with any UPI app. We confirm every payment before your order ships.",
  },
];

const Services = () => {
  return (
    <Wrapper>
      <div className="services-shell">
        <div className="section-head">
          <span className="eyebrow">Why Poster Town</span>
          <h2>Buying your next poster should feel easy.</h2>
          <p>Metal prints made to order, packed carefully and backed by real people.</p>
        </div>

        <div className="services-grid">
          {serviceItems.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="service-card">
                <div className="card-top">
                  <span className="icon-shell" aria-hidden="true">
                    <Icon className="icon" />
                  </span>
                  <strong className="stat">{item.stat}</strong>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            );
          })}
        </div>

        <div className="assistant-strip">
          <span className="assistant-icon" aria-hidden="true">
            <RiCustomerService2Line />
          </span>
          <div className="assistant-copy">
            <strong>A personal assistant for every order</strong>
            <p>
              Once you order, a real person from our team is assigned to you and stays with you until your poster is on
              your wall. Questions, changes or delivery updates: you always know who to ask.
            </p>
          </div>
          <a
            className="assistant-link"
            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer">
            <FaWhatsapp /> Chat with us
          </a>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  /* Less padding below: the next section starts with its own heading space. */
  padding: 7rem 0 3rem;
  background: linear-gradient(180deg, #f8f5ef 0%, #f1e7da 100%);

  .services-shell {
    width: min(100%, 132rem);
    margin: 0 auto;
    padding: 0 2.4rem;
  }

  .section-head {
    text-align: center;
    max-width: 68rem;
    margin: 0 auto 3.6rem;
  }

  .eyebrow {
    display: inline-block;
    color: #8a5c43;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.2rem;
  }

  h2 {
    font-size: clamp(3rem, 3.6vw, 4.2rem);
    line-height: 1.12;
    color: #231f20;
    font-weight: 800;
    text-transform: none;
    margin-bottom: 1.2rem;
  }

  .section-head p {
    color: #6a5e54;
    font-size: 1.6rem;
    line-height: 1.7;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.6rem;
  }

  .service-card {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 2.2rem;
    box-shadow: 0 12px 24px rgba(61, 41, 22, 0.05);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .service-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 34px rgba(61, 41, 22, 0.1);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.8rem;
  }

  .icon-shell {
    width: 4.8rem;
    height: 4.8rem;
    flex-shrink: 0;
    border-radius: 1.4rem;
    background: #f6e6d6;
    display: grid;
    place-items: center;
  }

  .icon {
    color: #cf6d3f;
    width: 2.4rem;
    height: 2.4rem;
  }

  .stat {
    color: #231f20;
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  h3 {
    font-size: 1.8rem;
    color: #231f20;
    font-weight: 700;
  }

  .service-card p {
    color: #5f554d;
    font-size: 1.45rem;
    line-height: 1.65;
  }

  .assistant-strip {
    margin-top: 1.6rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2.2rem 2.6rem;
    border-radius: 2rem;
    color: #fff8f1;
    background:
      radial-gradient(circle at 12% 50%, rgba(207, 109, 63, 0.35) 0%, transparent 45%),
      linear-gradient(135deg, #231f20 0%, #3d2e27 100%);
    box-shadow: 0 18px 34px rgba(40, 24, 14, 0.16);
  }

  .assistant-icon {
    width: 5.6rem;
    height: 5.6rem;
    flex-shrink: 0;
    border-radius: 1.6rem;
    display: grid;
    place-items: center;
    background: rgba(255, 248, 241, 0.1);
    border: 1px solid rgba(255, 248, 241, 0.16);
    color: #ffb48d;
    font-size: 2.8rem;
  }

  .assistant-copy {
    flex: 1;
    min-width: 0;
  }

  .assistant-copy strong {
    display: block;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.4rem;
    color: #fff8f1;
  }

  .assistant-copy p {
    color: rgba(255, 248, 241, 0.78);
    font-size: 1.5rem;
    line-height: 1.65;
    max-width: 78rem;
  }

  .assistant-link {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    flex-shrink: 0;
    background: #fff8f1;
    color: #231f20;
    border-radius: 999px;
    padding: 1.2rem 2rem;
    font-size: 1.45rem;
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.2s ease;
  }

  .assistant-link svg {
    color: #1f9d55;
    font-size: 1.8rem;
  }

  .assistant-link:hover {
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .services-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .assistant-strip {
      flex-wrap: wrap;
    }

    .assistant-copy {
      flex-basis: calc(100% - 7.6rem);
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 5rem 0;

    .services-shell {
      padding: 0 1.6rem;
    }

    .section-head {
      margin-bottom: 2.4rem;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }

    .service-card {
      padding: 1.8rem;
    }

    .assistant-strip {
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
      gap: 1.4rem;
    }

    .assistant-link {
      width: 100%;
      justify-content: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .service-card {
      transition: none;
    }
  }
`;

export default Services;
