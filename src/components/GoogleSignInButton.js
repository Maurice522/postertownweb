import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let scriptPromise;

// Loads Google Identity Services once, however many buttons are on the page.
const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Could not load Google sign-in"));
      };
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
};

// Google's own "Continue with Google" button. onCredential receives the ID token.
const GoogleSignInButton = ({ onCredential, text = "continue_with" }) => {
  const buttonRef = useRef(null);
  const callbackRef = useRef(onCredential);
  const [loadError, setLoadError] = useState("");

  callbackRef.current = onCredential;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return undefined;
    }

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => callbackRef.current?.(response.credential),
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text,
          logo_alignment: "center",
          width: Math.min(buttonRef.current.offsetWidth || 360, 400),
        });
      })
      .catch((error) => setLoadError(error.message));

    return () => {
      cancelled = true;
    };
  }, [text]);

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <Wrapper>
      <div ref={buttonRef} className="google-button" />
      {loadError ? <p className="google-error">{loadError}</p> : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;

  .google-button {
    display: flex;
    justify-content: center;
    min-height: 4.4rem;
  }

  .google-error {
    margin-top: 0.8rem;
    color: #c0392b;
    font-size: 1.3rem;
    text-align: center;
  }
`;

export default GoogleSignInButton;
