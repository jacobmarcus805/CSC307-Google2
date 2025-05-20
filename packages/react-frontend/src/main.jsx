import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react"; // Import ChakraProvider

createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ChakraProvider>,
);
