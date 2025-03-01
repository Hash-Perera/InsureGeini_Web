import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./components/Login/Login.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Staff from "./components/AdminDashboard/Pages/Staff.jsx";
import Clients from "./components/AdminDashboard/Pages/Clients.jsx";
import { Feedback } from "./components/AdminDashboard/Pages/Feedback.jsx";
import Reports from "./components/AdminDashboard/Pages/Reports.jsx";
import { AdminContextProvider } from "./contexts/AdminContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
            path: "staff",
            element: <Staff />,
          },
          {
            path: "clients",
            element: <Clients />,
          },
          {
            path: "feedback",
            element: <Feedback />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
