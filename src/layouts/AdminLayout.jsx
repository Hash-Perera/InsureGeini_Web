import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  /*   const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]); */

  return (
    <main className="container">
      <Outlet />
    </main>
  );
}

export default AdminLayout;
