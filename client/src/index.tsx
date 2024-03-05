import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={`${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}`}>
      <App />
    </GoogleOAuthProvider>
    ;
  </React.StrictMode>
);
