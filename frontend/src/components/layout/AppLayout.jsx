import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Toast } from "../ui/Toast";
import { MemberModal } from "../modals/MemberModal";
import { FeeModal } from "../modals/FeeModal";
import { ChatBubble } from "../ui/ChatBubble";
import { useGymData } from "../../context/GymDataContext";

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    modal,
    toast,
    closeModal,
    handleSaveMember,
    handleAddFee,
    handleToggleFee
  } = useGymData();

  return (
    <div className="min-h-screen bg-app-bg text-text-main font-dm-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileMenuOpen}
        onToggleMobile={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      <div
        className={`p-4 md:p-8 min-h-screen transition-[margin-left] duration-300 ${
          isSidebarCollapsed ? "md:ml-[60px]" : "md:ml-[250px]"
        } ml-0`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <div className="text-xl font-extrabold text-primary-orange">GymPro</div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-card-bg border border-border-main rounded-lg"
          >
            <span className="text-xl">≡</span>
          </button>
        </div>

        <Outlet />
      </div>

      {modal?.type === "add" && (
        <MemberModal onClose={closeModal} onSave={handleSaveMember} />
      )}
      {modal?.type === "edit" && (
        <MemberModal
          member={modal.member}
          onClose={closeModal}
          onSave={handleSaveMember}
        />
      )}
      {modal?.type === "fee" && (
        <FeeModal
          member={modal.member}
          onClose={closeModal}
          onAddFee={handleAddFee}
          onToggleFee={handleToggleFee}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <ChatBubble />
    </div>
  );
}
