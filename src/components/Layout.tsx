
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";

const Layout = () => {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
