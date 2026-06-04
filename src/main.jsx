import React from "react";
import ReactDOM from "react-dom/client";

import SearchProvider from "./context/SearchContext";
import EmployeeProvider from "./context/EmployeeContext";
import ThemeProvider from "./context/ThemeContext";

import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <ThemeProvider>

      <SearchProvider>

        <EmployeeProvider>

          <App />

        </EmployeeProvider>

      </SearchProvider>

    </ThemeProvider>

  </React.StrictMode>

);