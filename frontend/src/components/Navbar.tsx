import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";

const STUDENT_NAV = [
  { label: "Tổng quan", to: "/dashboard" },
  { label: "Khoá học", to: "/khoa-hoc" },
];

export function Navbar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const handleLogout = useLogout("/");

  const navLinks = user?.role === "STUDENT" ? STUDENT_NAV : [];
  const isActive = (to: string) =>
    location.pathname === to ||
    location.pathname.startsWith(to.split("#")[0] + "/");

  return (
    <header className="nav-header sticky top-0 z-50">
      {/* Full-width: logo lệch trái, nav centered tuyệt đối theo viewport */}
      <div className="w-full px-7 h-[56px] grid grid-cols-3 items-center">
        {/* Col 1 — Logo (left-aligned, ngoài vùng content) */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center select-none gap-0 justify-self-start"
        >
          <span className="text-acc font-bold text-base font-jp leading-none">
            日本語
          </span>
          <span className="heading-tight text-t1 font-bold text-sm leading-none ml-1">
            Flow
          </span>
        </Link>

        {/* Col 2 — Nav links (centered tuyệt đối theo viewport) */}
        <nav className="hidden md:flex items-center gap-[108px] justify-center">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "px-3.5 py-1.5 rounded-md text-[13px] transition-colors",
                isActive(to) && !to.includes("#")
                  ? "text-t2"
                  : "text-t3 hover:text-t2",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Col 3 — Auth actions (right-aligned) */}
        <div className="hidden md:flex items-center gap-2.5 justify-self-end">
          {user ? (
            <>
              <span className="text-[11px] text-t3 max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] text-t3 hover:text-t2 transition-colors"
              >
                <LogOut size={13} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/dang-nhap"
                className="px-3.5 py-1.5 rounded-md text-[13px] text-t3 hover:text-t2 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/dang-ky"
                className="nav-register-btn px-3.5 py-1.5 rounded-md text-[13px] font-medium text-t1 transition-all hover:bg-s1"
              >
                Bắt đầu miễn phí
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle — col 3, right-aligned */}
        <button
          className="md:hidden text-t3 hover:text-t2 transition-colors justify-self-end"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="nav-mobile-drawer md:hidden px-8 py-4 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md text-sm text-t2 hover:text-t1 hover:bg-s2 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="nav-mobile-divider pt-3 mt-1 flex flex-col gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-t3 text-sm text-left hover:text-t2"
              >
                <LogOut size={13} /> Đăng xuất
              </button>
            ) : (
              <>
                <Link
                  to="/dang-nhap"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-t3 text-sm hover:text-t2"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  onClick={() => setOpen(false)}
                  className="nav-register-btn px-3 py-2 text-sm text-t1 rounded-md hover:bg-s2 transition-colors"
                >
                  Bắt đầu miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
