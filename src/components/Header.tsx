import React, { useState } from "react";
import { User } from "../types";
import { BookOpen, Sparkles, Award, UserCheck, Shield, LogIn, ChevronDown, CheckCircle2, Gamepad2, GraduationCap, FileSearch, Compass } from "lucide-react";

interface HeaderProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  availableUsers: User[];
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuthModal: () => void;
  aiConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  availableUsers,
  currentTab,
  onSelectTab,
  onOpenAuthModal,
  aiConnected,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const navItems = [
    { id: "home", label: "Trang chủ", icon: Sparkles },
    { id: "prompts", label: "Kho đề văn", icon: Compass },
    { id: "writing", label: "Luyện viết", icon: BookOpen },
    { id: "scan", label: "Scan & Rubric", icon: FileSearch },
    { id: "materials", label: "Học liệu", icon: GraduationCap },
    { id: "assignments", label: "Bài tập", icon: Award },
    { id: "games", label: "Trò chơi", icon: Gamepad2 },
    { id: "teacher", label: "Góc Giáo Viên", icon: UserCheck },
  ];

  if (currentUser.role === "admin") {
    navItems.push({ id: "admin", label: "Quản trị", icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-amber-500 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">Lớp 4</span>
          <span>🌟 Slogan: “Mỗi ngày chăm chỉ – Mỗi bài viết tiến bộ!”</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${aiConnected ? "bg-emerald-300 animate-pulse" : "bg-amber-300"}`} />
            {aiConnected ? "Trợ lý AI Gemini 3.8 Flash đã sẵn sàng" : "Động cơ Sư phạm EduNova đang hoạt động"}
          </span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab("home")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">🦉</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-800">
                  EduNova
                </span>
                <span className="text-xs sm:text-sm font-extrabold uppercase bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg border border-orange-200">
                  Writing Coach
                </span>
              </div>
              <p className="text-xs text-emerald-600 font-semibold hidden sm:block">
                Viết hay hơn mỗi ngày • Tiếng Việt Lớp 4
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 scale-102"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Account / Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick 1-Click Role Switcher */}
            {currentUser.role === "student" ? (
              <button
                type="button"
                onClick={() => {
                  const teacher = availableUsers.find((u) => u.role === "teacher");
                  if (teacher) {
                    onSelectUser(teacher);
                    onSelectTab("teacher");
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs transition-all cursor-pointer hover:scale-102"
                title="Chuyển ngay sang vai trò Giáo viên để mở bài học sinh chấm & nhận xét"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Chấm bài (Giáo viên)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const student = availableUsers.find((u) => u.role === "student");
                  if (student) {
                    onSelectUser(student);
                    onSelectTab("home");
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all cursor-pointer hover:scale-102"
                title="Chuyển về vai trò Học sinh để làm bài"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Xem vai Học sinh</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left shadow-2xs"
                title="Chuyển đổi nhanh vai trò tài khoản để thử nghiệm"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-emerald-500/20"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                        currentUser.role === "student"
                          ? "bg-emerald-100 text-emerald-800"
                          : currentUser.role === "teacher"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {currentUser.role === "student"
                        ? "Học sinh 4A1"
                        : currentUser.role === "teacher"
                        ? "Giáo viên"
                        : "Quản trị viên"}
                    </span>
                  </div>
                </div>
              </button>

              {/* Fast Role Switcher Dropdown */}
              {showUserDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Đổi tài khoản thử nghiệm
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Trải nghiệm đầy đủ 3 vai trò Học sinh - Giáo viên - Quản trị
                      </p>
                    </div>

                    <div className="py-1 space-y-1">
                      {availableUsers.map((u) => {
                        const isCurrent = u.id === currentUser.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSelectUser(u);
                              setShowUserDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                              isCurrent ? "bg-emerald-50 text-emerald-900 font-bold" : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                              <div>
                                <p className="text-xs font-bold leading-tight">{u.name}</p>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {u.role === "student"
                                    ? "Học sinh Lớp 4A1"
                                    : u.role === "teacher"
                                    ? "Giáo viên chủ nhiệm"
                                    : "Quản trị viên hệ thống"}
                                </span>
                              </div>
                            </div>
                            {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex gap-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenAuthModal();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                        Đăng nhập bằng tài khoản khác
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
