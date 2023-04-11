import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>404: Page not found</h1>
      <p>You will be redirected to the homepage in 5 seconds.</p>
    </div>
  );
}
