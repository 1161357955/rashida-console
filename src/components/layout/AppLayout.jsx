import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden" dir="rtl">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <Sidebar />
    </div>
  );
}