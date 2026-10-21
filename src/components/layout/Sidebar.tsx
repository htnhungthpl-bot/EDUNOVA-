import React from "react";
import { User, ScreenId } from "../../types";
import {
  Sparkles,
  BookOpen,
  Award,
  FileCheck,
  GraduationCap,
  Gamepad2,
  TrendingUp,
  LayoutDashboard,
  School,
  Users,
  PenTool,
  CheckSquare,
  BarChart3,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Database,
  History,
  Sliders,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface SidebarProps {
  currentUser: User;
  currentScreen: ScreenId;
  onNavigate: (screenId: ScreenId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentScreen,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onResetData,
}) => {
  // Navigation menus grouped by role
  const studentNav = [
    { id: "student-home" as ScreenId, label: "Trang chủ", icon: Sparkles },
    { id: "student-writing" as ScreenId, label: "Không gian luyện viết", icon: PenTool },
    { id: "student-assignments" as ScreenId, label: "Bài tập được giao", icon: Award },
    { id: "student-submissions" as ScreenId, label: "Kết quả & Nhận xét", icon: FileCheck },
    { id: "student-materials" as ScreenId, label: "Kho học liệu", icon: GraduationCap },
    { id: "student-games" as ScreenId, label: "Trò chơi ngôn ngữ", icon: Gamepad2 },
    { id: "student-progress" as ScreenId, label: "Hồ sơ & Hành trình", icon: TrendingUp },
  ];

  const teacherNav = [
    { id: "teacher-dashboard" as ScreenId, label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "teacher-classes" as ScreenId, label: "Quản lý lớp học", icon: School },
    { id: "teacher-students" as ScreenId, label: "Quản lý học sinh", icon: Users },
    { id: "teacher-assignments" as ScreenId, label: "Quản lý bài tập", icon: Award },
    { id: "teacher-grading" as ScreenId, label: "Chấm bài & Rubric", icon: CheckSquare },
    { id: "teacher-materials" as ScreenId, label: "Kho học liệu & Đề", icon: BookOpen },
    { id: "teacher-reports" as ScreenId, label: "Báo cáo kết quả", icon: BarChart3 },
    { id: "teacher-data" as ScreenId, label: "Nhập / Xuất dữ liệu", icon: FileSpreadsheet },
  ];

  const adminNav = [
    { id: "admin-dashboard" as ScreenId, label: "Tổng quan hệ thống", icon: LayoutDashboard },
    { id: "admin-users" as ScreenId, label: "Quản lý người dùng", icon: Users },
    { id: "admin-schools" as ScreenId, label: "Quản lý trường & lớp", icon: School },
    { id: "admin-rubrics" as ScreenId, label: "Quản lý Rubric chuẩn", icon: Sliders },
    { id: "admin-settings" as ScreenId, label: "Cấu hình an toàn", icon: Settings },
    { id: "admin-audit" as ScreenId, label: "Nhật ký thao tác", icon: History },
    { id: "admin-backup" as ScreenId, label: "Sao lưu & Khôi phục", icon: Database },
  ];

  const currentNav =
    currentUser.role === "student"
      ? studentNav
      : currentUser.role === "teacher"
      ? teacherNav
      : adminNav;

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 z-30 select-none ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-4">
        <button
          onClick={() =>
            onNavigate(
              currentUser.role === "student"
                ? "student-home"
                : currentUser.role === "teacher"
                ? "teacher-dashboard"
                : "admin-dashboard"
            )
          }
          className="flex items-center gap-3 text-left focus-visible:outline-emerald-600 rounded-xl"
        >
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <span className="text-2xl" role="img" aria-label="Cú EduNova">
              🦉
            </span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="text-base font-black text-emerald-800 tracking-tight block truncate">
                EduNova
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 block truncate">
                Writing Coach
              </span>
            </div>
          )}
        </button>

        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors focus-visible:outline-emerald-600 shrink-0"
          title={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
          aria-label={isCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Navigation Menu */}
      <nav aria-label="Menu chính" className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            {currentUser.role === "student"
              ? "Góc Học Sinh Lớp 4"
              : currentUser.role === "teacher"
              ? "Bàn Làm Việc Giáo Viên"
              : "Trung Tâm Quản Trị"}
          </div>
        )}

        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all text-left focus-visible:outline-emerald-600 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-emerald-700"}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Common Utilities Section */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Tiện Ích & Trợ Giúp
            </div>
          )}

          <button
            onClick={() => onNavigate("common-settings")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-left transition-colors focus-visible:outline-emerald-600 ${
              currentScreen === "common-settings"
                ? "bg-slate-100 text-slate-900 font-extrabold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Cài đặt giao diện & trợ năng"
          >
            <Settings className="w-4 h-4 text-slate-500 shrink-0" />
            {!isCollapsed && <span>Cài đặt giao diện</span>}
          </button>

          <button
            onClick={() => onNavigate("common-help")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold text-left transition-colors focus-visible:outline-emerald-600 ${
              currentScreen === "common-help"
                ? "bg-slate-100 text-slate-900 font-extrabold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Hướng dẫn sử dụng"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            {!isCollapsed && <span>Hướng dẫn & Sổ tay</span>}
          </button>
        </div>
      </nav>

      {/* Bottom Footer Widget: Slogan & Demo Reset Data */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
            <p className="text-[10px] font-extrabold uppercase text-emerald-800">
              Slogan EduNova
            </p>
            <p className="text-[11px] text-slate-600 font-medium leading-snug">
              “Mỗi ngày chăm chỉ – Mỗi bài viết tiến bộ!”
            </p>
          </div>
        )}

        <button
          onClick={onResetData}
          className={`w-full py-2 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-50 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-rose-600 ${
            isCollapsed ? "px-2" : "px-3"
          }`}
          title="Khôi phục lại dữ liệu mẫu gốc ban đầu"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Đặt lại dữ liệu mẫu</span>}
        </button>
      </div>
    </aside>
  );
};
