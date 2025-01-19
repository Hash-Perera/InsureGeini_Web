import React, { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [activeChildPage, setActiveChildPage] = useState("History");

  return (
    <AdminContext.Provider
      value={{ activePage, setActivePage, activeChildPage, setActiveChildPage }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error(
      "useAdminContext must be used within an AdminContextProvider"
    );
  }
  return context;
};
