import React, { useState } from "react";
import { User, ScreenId, AppNotification, AppSettings } from "../../types";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { Footer } from "../Footer";
import { NotificationCenter } from "../common/NotificationCenter";
import { SettingsModal } from "../modals/SettingsModal";
import { HelpModal } from "../modals/HelpModal";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { ToastContainer, ToastMessage } from "../common/Toast";
import { BreadcrumbItem } from "../common/Breadcrumbs";

interface AppShellProps {
  currentUser: User;
  availableUsers: User[];
  onSelectUser: (user: User) => void;
  currentScreen: ScreenId;
  onNavigate: (screenId: ScreenId) => void;
  breadcrumbs: BreadcrumbItem[];
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentUser,
  availableUsers,
  onSelectUser,
  currentScreen,
  onNavigate,
  breadcrumbs,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  settings,
  onSaveSettings,
  onResetData,
  toasts,
  onDismissToast,
  searchQuery,
  onSearchChange,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Apply font size style from settings
  const fontSizeClasses = {
    normal: "text-sm",
    large: "text-base",
    huge: "text-lg",
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 flex ${
        settings.reducedMotion ? "motion-reduce" : ""
      } ${fontSizeClasses[settings.fontSize] || "text-sm"} selection:bg-emerald-100 selection:text-emerald-900`}
    >
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        currentUser={currentUser}
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onResetData={() => setIsResetConfirmOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentUser={currentUser}
          availableUsers={availableUsers}
          onSelectUser={onSelectUser}
          currentScreen={currentScreen}
          onNavigate={onNavigate}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          notifications={notifications}
          breadcrumbs={breadcrumbs}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <Footer />
      </div>

      {/* Mobile Drawer Menu */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Notification Center Modal */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={onMarkNotificationRead}
        onMarkAllRead={onMarkAllNotificationsRead}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={onSaveSettings}
      />

      {/* Help & User Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Reset Seed Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Khôi phục dữ liệu mẫu gốc ban đầu?"
        message="Thao tác này sẽ đặt lại toàn bộ bài viết, học sinh, bài tập và cài đặt về trạng thái mẫu ban đầu của EduNova Writing Coach. Dữ liệu đã chỉnh sửa trong phiên này sẽ được làm mới."
        confirmLabel="Đặt lại dữ liệu"
        cancelLabel="Hủy"
        isDestructive={true}
        onConfirm={() => {
          onResetData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Toast Notification Stack */}
      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
};
