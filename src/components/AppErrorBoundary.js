import { Component } from "react";
import styled from "styled-components";

// Without this, any error while showing a page wipes the whole screen white.
// The usual cause is a deploy: a tab opened before it asks for a page file that no
// longer exists. That case reloads once to pick up the new version; anything else
// shows a message with a way out instead of a blank page.
const RELOAD_KEY = "postertown:chunk-reload";

const isChunkError = (error) =>
  /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Failed to fetch dynamically/i.test(
    `${error?.name} ${error?.message}`
  );

class AppErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    if (!isChunkError(error)) {
      console.error("Page crashed", error);
      return;
    }
    // Reload at most once a minute, so a real outage can't loop forever.
    let lastReload = 0;
    try {
      lastReload = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      // Storage blocked: still reload once; the next failure shows the message.
    }
    if (Date.now() - lastReload > 60000) window.location.reload();
  }

  componentDidUpdate(previousProps) {
    // Moving to another page clears the error.
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    const updating = isChunkError(this.state.error);

    return (
      <Wrapper role="alert">
        <h1>{updating ? "Poster Town just got an update" : "Something went wrong"}</h1>
        <p>
          {updating
            ? "Reload the page to get the latest version."
            : "This page hit a problem. Reloading usually fixes it; your cart is saved."}
        </p>
        <div className="actions">
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
          <a href="/">Go to home</a>
        </div>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  min-height: 70vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1.4rem;
  padding: 4rem 2rem;
  text-align: center;

  h1 {
    font-size: clamp(2.6rem, 4vw, 3.6rem);
  }

  p {
    color: #6a5e54;
    max-width: 44rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  button,
  a {
    min-height: 4.6rem;
    padding: 0 2.2rem;
    border-radius: 1.4rem;
    font-size: 1.5rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
  }

  button {
    border: none;
    background: #231f20;
    color: #fff;
  }

  a {
    border: 1px solid #dfd1c2;
    background: #fff;
    color: #231f20;
  }
`;

export default AppErrorBoundary;
