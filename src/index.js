import React from 'react';
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Quiz from "./routes/quiz";
import Complete from "./routes/complete";
import Practice from "./routes/practice";


const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="quiz" element={<Quiz />} />
      <Route path="practice" element={<Practice />} />
      <Route path="complete" element={<Complete />} />
    </Routes>
  </BrowserRouter>
);
