import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  FolderOpen,
  Send,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Building2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "لوحة التحكم", path: "/", icon: LayoutDashboard },
  { label: "طلب خدمة", path: "/request-service", icon: Send },
  { label: "حاسبة التسعير", path: "/pricing-calculator", icon: Calculator },
  { label: "الدليل الإجرائي", path: "/procedural-guide", icon: FolderOpen },
  { label: "طلباتي", path: "/my-requests", icon: FileText },
  { label: "التكامل الآلي", path: "/automation", icon: Zap },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    base44.auth.logout("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="font-bold text-sm text-foreground truncate">الإدارة الرشيدة</h1>
            <p className="text-[11px] text-muted-foreground truncate">شركة فلك للموارد البشرية</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/50">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-card rounded-xl shadow-lg flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-card shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col bg-card border-l border-border/50 transition-all duration-300 relative ${collapsed ? "w-[72px]" : "w-60"}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -left-3 top-6 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm z-10 hover:bg-muted transition-colors"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
        <NavContent />
      </div>
    </>
  );
}