import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--bg)" }}
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
