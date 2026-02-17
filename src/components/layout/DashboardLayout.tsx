import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/invoices", label: "Invoices", icon: FileText },
  { path: "/expenses", label: "Expenses", icon: Wallet },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);
  const businessProfile = useAppStore((s) => s.businessProfile);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-all duration-200",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-5 h-16 border-b border-[hsl(220,50%,20%)] shrink-0", collapsed && "justify-center px-0")}>
          <div className="size-9 rounded-lg bg-[hsl(38,92%,50%)] flex items-center justify-center shrink-0">
            <Receipt className="size-5 text-[hsl(220,60%,10%)]" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold text-white tracking-tight">BillKaro</span>
          )}
        </div>

        {/* Quick Action */}
        <div className={cn("px-4 mt-4 mb-2", collapsed && "px-3")}>
          <Button
            onClick={() => navigate("/invoices/new")}
            className={cn(
              "w-full bg-[hsl(38,92%,50%)] hover:bg-[hsl(38,92%,45%)] text-[hsl(220,60%,10%)] font-semibold gap-2",
              collapsed && "px-0"
            )}
          >
            <Plus className="size-4" />
            {!collapsed && "New Invoice"}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(var(--sidebar-accent))] text-white"
                    : "text-[hsl(220,14%,65%)] hover:bg-[hsl(220,50%,18%)] hover:text-white",
                  collapsed && "justify-center px-0"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[hsl(220,50%,20%)] p-3 space-y-2">
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-white truncate">{businessProfile.name}</p>
              <p className="text-xs text-[hsl(220,14%,50%)] truncate">{businessProfile.gstin}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={cn(
                "text-[hsl(220,14%,65%)] hover:text-white hover:bg-[hsl(220,50%,18%)] gap-2",
                collapsed ? "w-full justify-center" : "flex-1"
              )}
            >
              <LogOut className="size-4" />
              {!collapsed && "Sign Out"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-[hsl(220,14%,65%)] hover:text-white hover:bg-[hsl(220,50%,18%)] shrink-0"
            >
              {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
