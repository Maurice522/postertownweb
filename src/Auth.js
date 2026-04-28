import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useUserContext } from "./context/user_context";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useUserContext();
  const [mode, setMode] = useState(location.state?.mode === "signup" ? "signup" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const redirectTo = useMemo(() => location.state?.redirectTo || "/", [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "login") {
      await login(form.email, form.password);
    } else {
      await register(form.name, form.email, form.password);
    }

    navigate(redirectTo);
  };

  return (
    <Wrapper>
      <div className="auth-shell">
        <Link to="/" className="back-link">
          <FiArrowLeft />
          Back to home
        </Link>

        <div className="auth-layout">
          <section className="auth-copy">
            <span className="eyebrow">Poster Town account</span>
            <h1>{mode === "login" ? "Welcome back." : "Create your account."}</h1>
            <p>
              {mode === "login"
                ? "Log in to keep your cart, shipping details, and checkout flow connected."
                : "Sign up so you can save your details and move through checkout with less friction."}
            </p>

            <div className="benefit-list">
              <span>Saved cart</span>
              <span>Faster checkout</span>
              <span>Shipping details ready</span>
            </div>
          </section>

          <section className="auth-card">
            <div className="mode-switch">
              <button
                type="button"
                className={mode === "login" ? "mode-btn active" : "mode-btn"}
                onClick={() => setMode("login")}>
                Log in
              </button>
              <button
                type="button"
                className={mode === "signup" ? "mode-btn active" : "mode-btn"}
                onClick={() => setMode("signup")}>
                Sign up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <label>
                  <span>Name</span>
                  <div className="field-shell">
                    <FiUser />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                </label>
              ) : null}

              <label>
                <span>Email</span>
                <div className="field-shell">
                  <FiMail />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </label>

              <label>
                <span>Password</span>
                <div className="field-shell">
                  <FiLock />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
              </label>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);
  min-height: calc(100vh - 16rem);
  padding: 4.4rem 0 5.2rem;
  overflow: hidden;

  .auth-shell {
    width: min(100%, 132rem);
    margin: 0 auto;
    padding: 0 2.4rem;
    min-height: calc(100vh - 24rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    align-self: flex-start;
    min-height: 4.6rem;
    padding: 0 1.5rem;
    border-radius: 999px;
    background: rgba(255, 250, 243, 0.94);
    border: 1px solid #e1d2c2;
    color: #2a241f;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 2.2rem;
    transition: transform 180ms ease, box-shadow 180ms ease;
    animation: riseIn 420ms ease-out;
    width: fit-content;
  }

  .back-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(61, 41, 22, 0.08);
  }

  .auth-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(38rem, 46rem);
    gap: 2.8rem;
    align-items: start;
  }

  .auth-copy,
  .auth-card {
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 3rem;
    box-shadow: 0 20px 42px rgba(61, 41, 22, 0.07);
  }

  .auth-copy {
    padding: 3.8rem 3.6rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100%;
    animation: riseIn 520ms ease-out;
  }

  .eyebrow {
    color: #8a5c43;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: clamp(3.4rem, 5vw, 5.4rem);
    line-height: 1.04;
    margin-bottom: 1rem;
  }

  .auth-copy p {
    color: #6b5f56;
    line-height: 1.72;
    max-width: 56rem;
  }

  .benefit-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    margin-top: 2.1rem;
  }

  .benefit-list span {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 999px;
    padding: 0.8rem 1.2rem;
    color: #5f554d;
    font-size: 1.2rem;
    animation: softFloat 5.4s ease-in-out infinite;
  }

  .benefit-list span:nth-child(2) {
    animation-delay: 0.45s;
  }

  .benefit-list span:nth-child(3) {
    animation-delay: 0.9s;
  }

  .auth-card {
    padding: 2.6rem;
    animation: riseIn 620ms ease-out;
  }

  .mode-switch {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
    padding: 0.6rem;
    background: #f4e9dd;
    border-radius: 1.8rem;
    margin-bottom: 2rem;
  }

  .mode-btn {
    min-height: 4.8rem;
    border: none;
    border-radius: 1.4rem;
    background: transparent;
    color: #6b5f56;
    font-size: 1.35rem;
    font-weight: 700;
    cursor: pointer;
  }

  .mode-btn.active {
    background: #231f20;
    color: #fff8f1;
    box-shadow: 0 10px 24px rgba(35, 31, 32, 0.16);
  }

  .auth-form {
    display: grid;
    gap: 1.4rem;
  }

  .auth-form label {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    color: #5f554d;
    font-size: 1.28rem;
    font-weight: 600;
  }

  .field-shell {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    background: #fff;
    border: 1px solid #e1d3c3;
    border-radius: 1.5rem;
    padding: 0 1.3rem;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .field-shell svg {
    color: #8a7b6e;
    font-size: 1.55rem;
    flex-shrink: 0;
  }

  .field-shell input {
    width: 100%;
    max-width: none;
    border: none;
    box-shadow: none;
    background: transparent;
    text-transform: none;
    padding: 1.35rem 0;
  }

  .password-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    flex-shrink: 0;
    border: none;
    background: transparent;
    color: #6f6156;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  .password-toggle svg {
    font-size: 1.5rem;
  }

  .field-shell input:focus {
    outline: none;
  }

  .field-shell:focus-within {
    border-color: #c79671;
    box-shadow: 0 0 0 0.35rem rgba(199, 150, 113, 0.14);
    transform: translateY(-1px);
  }

  .submit-btn {
    min-height: 5.2rem;
    border: none;
    border-radius: 1.6rem;
    background: linear-gradient(135deg, #231f20 0%, #4a372f 100%);
    color: #fff8f1;
    font-size: 1.42rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 0.4rem;
    transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
    position: relative;
    overflow: hidden;
  }

  .submit-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.26) 45%, transparent 70%);
    transform: translateX(-130%);
    animation: sheen 3.8s ease-in-out infinite;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(61, 41, 22, 0.18);
    filter: brightness(1.02);
  }

  .submit-btn:disabled {
    cursor: wait;
    transform: none;
    box-shadow: none;
  }

  @keyframes riseIn {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes softFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  @keyframes sheen {
    0%,
    100% {
      transform: translateX(-130%);
    }
    45%,
    55% {
      transform: translateX(130%);
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    min-height: auto;
    padding: 3rem 0 3.4rem;

    .auth-shell {
      padding: 0 1.4rem;
      min-height: auto;
      justify-content: flex-start;
    }

    .auth-layout {
      grid-template-columns: 1fr;
      gap: 1.8rem;
    }

    .auth-copy,
    .auth-card {
      padding: 2rem;
      border-radius: 2.4rem;
    }
  }
`;

export default Auth;
