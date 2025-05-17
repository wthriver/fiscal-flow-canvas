
import React from "react";
import { Navigation } from "./Navigation";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-56 border-r">
        <Navigation />
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
