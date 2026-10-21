import React, { useState } from "react";
import { User, ScreenId, AppNotification } from "../../types";
import { RolePreviewSwitcher } from "./RolePreviewSwitcher";
import { Breadcrumbs, BreadcrumbItem } from "../common/Breadcrumbs";
import {
  Menu,
  Bell,
  Search,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface TopbarProps {
  currentUser: User;
  availableUsers: User[];
  onSelectUser: (user: User) => void;
  currentScreen: ScreenId;
  onNavigate: (screenId: ScreenId) => void;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  notifications: AppNotification[];
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentUser,
  availableUsers,
  onSelectUser,
  currentScreen,
  onNavigate,
  onOpenMobileMenu,
  onOpenNotifications,
  onOpenSettings,
  onOpenHelp,
  notifications,
  breadcrumbs,
  searchQuery,
  onSearchChange,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-emerald-600"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs
            items={breadcrumbs}
            onNavigate={onNavigate}
            rootLabel={
              currentUser.role === "student"
                ? "Trang chủ"
                : currentUser.role === "teacher"
                ? "Bảng điều khiển"
                : "Tổng quan"
            }
            rootScreenId={
              currentUser.role === "student"
                ? "student-home"
                : currentUser.role === "teacher"
                ? "teacher-dashboard"
                : "admin-dashboard"
            }
          />
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm bài tập, từ ngữ, học liệu..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
        </div>
      </div>

      {/* Right Area: Utility Actions & Role Preview Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus-visible:outline-emerald-600"
          title="Hướng dẫn sử dụng & Quy trình 5 bước"
          aria-label="Hướng dẫn sử dụng"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus-visible:outline-emerald-600"
          title="Thông báo"
          aria-label={`Thông báo (${unreadCount} chưa đọc)`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus-visible:outline-emerald-600"
          title="Cài đặt giao diện & cỡ chữ"
          aria-label="Cài đặt giao diện"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block" />

        {/* Role Preview Switcher */}
        <RolePreviewSwitcher
          currentUser={currentUser}
          availableUsers={availableUsers}
          onSelectUser={onSelectUser}
        />
      </div>
    </header>
  );
};
