import React, { useEffect } from "react";
import "../styles/Layout.css";
import { Outlet, useNavigate } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <main style={{ width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
