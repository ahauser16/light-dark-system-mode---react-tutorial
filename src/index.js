import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import "./App.css";
import { ThemeProvider } from "./theme";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
  rootElement
);
