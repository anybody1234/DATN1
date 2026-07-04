import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { BookOpen, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";

const ADMIN_NAV = [
  { label: "Khoá học", to: "/admin/khoa-hoc", icon: BookOpen },
];

export function AdminLayout() {
  const { user } = useAuthStore();
  const location = useLocation();
  const handleLogout = useLogout("/dang-nhap");

  const isActive = (to: string) => location.pathname.startsWith(to);

  return (
    <div className="min-h-dvh flex" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col border-r h-dvh sticky top-0"
        style={{
          background: "var(--s1)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="h-14 shrink-0 flex items-center px-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <LayoutDashboard size={16} className="text-acc mr-2 shrink-0" />
          <span className="text-t1 font-bold text-sm heading-tight">
            Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
          {ADMIN_NAV.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive(to)
                  ? "bg-acc-muted text-acc font-medium"
                  : "text-t3 hover:text-t2 hover:bg-s2",
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div
          className="shrink-0 px-3 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="text-t3 text-[11px] truncate px-3 mb-1">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-t3 hover:text-t2 hover:bg-s2 transition-colors"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
