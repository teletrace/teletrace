import React from "react";
import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <h1>OSS Tracing</h1>
      <nav>
        <Link to="/">Homepage</Link> | <Link to="traces">Traces</Link>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
