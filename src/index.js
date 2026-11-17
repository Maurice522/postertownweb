import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AppErrorBoundary from "./components/AppErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));

// App sets up the catalog, filter, cart and user providers itself. (Sign-in is the
// site's own email + Google login in context/user_context.js; Auth0 was never used.)
root.render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
