import React from "react";  // <-- Add this import
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import 'react-quill/dist/quill.snow.css'; // or 'quill.bubble.css'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />

  </BrowserRouter>
);
