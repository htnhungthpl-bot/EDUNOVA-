import React from "react";
import { User, ScreenId } from "../../types";
import {
  X,
  Sparkles,
  PenTool,
  Award,
  FileCheck,
  GraduationCap,
  Gamepad2,
  TrendingUp,
  LayoutDashboard,
  School,
  Users,
  CheckSquare,
  BarChart3,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Database,
  History,
  Sliders,
  BookOpen,
} from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  currentScreen: ScreenId;
  onNavigate: (screenId: ScreenId) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentScreen,
  onNavigate,
  onOpenSettings,
  onOpenHelp,
}) => {
  if (!isOpen) return null;

  const studentNav = [
    { id: "student-home" as ScreenId, label: "Trang chủ", icon: Sparkles },
    { id: "student-writing" as ScreenId, label: "Luyện viết", icon: PenTool },
    { id: "student-assignments" as ScreenId, label: "Bài tập được giao", icon: Award },
    { id: "student-submissions" as ScreenId, label: "Kết quả bài viết", icon: FileCheck },
    { id: "student-materials" as ScreenId, label: "Kho học liệu", icon: GraduationCap },
    { id: "student-games" as ScreenId, label: "Trò chơi", icon: Gamepad2 },
    { id: "student-progress" as ScreenId, label: "Tiến độ học", icon: TrendingUp },
  ];

  const teacherNav = [
    { id: "teacher-dashboard" as ScreenId, label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "teacher-classes" as ScreenId, label: "Quản lý lớp", icon: School },
    { id: "teacher-students" as ScreenId, label: "Quản lý học sinh", icon: Users },
    { id: "teacher-assignments" as ScreenId, label: "Bài tập", icon: Award },
    { id: "teacher-grading" as ScreenId, label: "Chấm bài", icon: CheckSquare },
    { id: "teacher-materials" as ScreenId, label: "Học liệu & Đề", icon: BookOpen },
    { id: "teacher-reports" as ScreenId, label: "Báo cáo", icon: BarChart3 },
    { id: "teacher-data" as ScreenId, label: "Nhập / Xuất Excel", icon: FileSpreadsheet },
  ];

  const adminNav = [
    { id: "admin-dashboard" as ScreenId, label: "Tổng quan", icon: LayoutDashboard },
    { id: "admin-users" as ScreenId, label: "Người dùng", icon: Users },
    { id: "admin-schools" as ScreenId, label: "Trường & Lớp", icon: School },
    { id: "admin-rubrics" as ScreenId, label: "Rubric chuẩn", icon: Sliders },
    { id: "admin-settings" as ScreenId, label: "Cấu hình", icon: Settings },
    { id: "admin-audit" as ScreenId, label: "Nhật ký", icon: History },
    { id: "admin-backup" as ScreenId, label: "Sao lưu", icon: Database },
  ];

  const currentNav =
    currentUser.role === "student"
      ? studentNav
      : currentUser.role === "teacher"
      ? teacherNav
      : adminNav;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🦉</span>
            <div>
              <span className="text-sm font-black text-emerald-800">EduNova</span>
              <p className="text-[10px] text-orange-600 font-extrabold uppercase">Writing Coach</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-emerald-800 font-semibold uppercase">
              {currentUser.role === "student"
                ? "Học sinh Lớp 4"
                : currentUser.role === "teacher"
                ? "Giáo viên"
                : "Quản trị viên"}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-xs font-bold transition-colors text-left ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 flex gap-2">
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" /> Cài đặt
          </button>
          <button
            onClick={() => {
              onOpenHelp();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Trợ giúp
          </button>
        </div>
      </div>

      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
