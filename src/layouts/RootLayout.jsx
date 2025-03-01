import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function RootLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  /* useEffect(() => {
    if (token) {
      navigate("/admin/staff");
    }
  }, [token, navigate]); */
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default RootLayout;
