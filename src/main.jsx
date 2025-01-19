import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./components/Login/Login.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import { Page } from "./components/AdminDashboard/page.jsx";
import { AdminContextProvider } from "./contexts/AdminContext.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "admin",
        element: (
          <AdminContextProvider>
            <AdminLayout />
          </AdminContextProvider>
        ),
        children: [
          {
            path: "admin-dashboard",
            element: (
              <AdminContextProvider>
                <Page />
              </AdminContextProvider>
            ),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
