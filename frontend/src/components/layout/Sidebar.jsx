import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icons } from "../ui/Icons";

export function Sidebar({
  isCollapsed,
  onToggleSidebar,
  isMobileOpen,
  onToggleMobile
}) {
  const location = useLocation();
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", to: "/" },
    { id: "members", label: "Members", icon: "👥", to: "/members" },
    { id: "fees", label: "Fee Overview", icon: "💳", to: "/fees" }
  ];

  const currentPath = location.pathname;

  const sidebarClasses = `
    fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-card-bg border-r border-border-main py-6 transition-all duration-300
    ${isCollapsed ? "md:w-[60px]" : "md:w-[250px]"}
    ${isMobileOpen ? "translate-x-0 w-[250px]" : "-translate-x-full md:translate-x-0"}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={onToggleMobile}
        />
      )}

      <div className={sidebarClasses}>
        {/* Logo Section */}
        <div
          className={`flex items-center border-b border-border-main mb-3 px-6 pb-7 ${
            isCollapsed ? "md:justify-center md:px-2" : "justify-start"
          }`}
        >
          <button
            onClick={onToggleSidebar}
            className={`hidden md:flex items-center justify-center p-2 cursor-pointer transition-colors hover:bg-white/5 rounded-lg ${
              isCollapsed ? "" : "mr-4"
            }`}
          >
            {isCollapsed ? <span className="text-xl">≡</span> : <Icons.gym />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onToggleMobile}
            className="md:hidden flex items-center justify-center p-2 mr-4 cursor-pointer hover:bg-white/5 rounded-lg"
          >
            <Icons.close />
          </button>

          {(!isCollapsed || isMobileOpen) && (
            <div>
              <div className="text-[18px] font-extrabold bg-gradient-to-br from-orange-500 to-orange-400 bg-clip-text text-transparent">
                GymPro
              </div>
              <div className="text-[11px] text-[#333348] mt-[1px]">
                Management System
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div className="flex-1">
          {nav.map((n) => {
            const isActive = currentPath === n.to;
            const showLabels = !isCollapsed || isMobileOpen;

            return (
              <Link
                key={n.id}
                to={n.to}
                onClick={() => {
                  // Close mobile menu when navigating
                  if (isMobileOpen) {
                    onToggleMobile();
                  }
                }}
                className={`flex items-center gap-3 text-sm font-medium cursor-pointer px-6 py-[11px] transition-all
          ${isActive
            ? "text-orange-500 bg-primary-orange/8 border-l-[3px] border-orange-500"
            : "text-[#7a7a9a] border-l-[3px] border-transparent hover:text-text-main hover:bg-white/2"}
          `}
              >
                <span className="text-base shrink-0">{n.icon}</span>
                {showLabels && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className={`mt-auto px-6 py-5 border-t border-border-sub ${
            isCollapsed && !isMobileOpen ? "md:px-2 text-center" : ""
          }`}
        >
          {(!isCollapsed || isMobileOpen) ? (
            <>
              <div className="text-[11px] text-[#333348] truncate">Learn With Askari</div>
              <div className="text-[10px] text-[#2a2a3e] mt-1 truncate">Demo Version</div>
            </>
          ) : (
            <div className="text-[10px] text-primary-orange font-bold">LWA</div>
          )}
        </div>
      </div>
    </>
  );
}