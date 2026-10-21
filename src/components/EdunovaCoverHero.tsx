import React, { useState } from "react";
import { User } from "../types";
import {
  Sparkles,
  PenTool,
  BookOpen,
  CheckCircle2,
  Award,
  ArrowRight,
  Shield,
  GraduationCap,
  UserCheck,
  Eye,
  Layers,
  FileSearch,
  Maximize2,
  Lock,
  Mail,
  HelpCircle,
  Gamepad2,
} from "lucide-react";

interface EdunovaCoverHeroProps {
  currentUser: User;
  availableUsers: User[];
  onSelectUser: (user: User) => void;
  onLoginCustom: (email: string) => Promise<void>;
  onOpenAuthModal: () => void;
  onNavigate: (tab: string, extraData?: any) => void;
  onOpenFullscreenCover?: () => void;
}

export const EdunovaCoverHero: React.FC<EdunovaCoverHeroProps> = ({
  currentUser,
  availableUsers,
  onSelectUser,
  onLoginCustom,
  onOpenAuthModal,
  onNavigate,
  onOpenFullscreenCover,
}) => {
  // Login card state
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | "admin">(
    currentUser.role || "student"
  );
  const [emailInput, setEmailInput] = useState<string>(currentUser.email || "hocsinh@edunova.edu.vn");
  const [passwordInput, setPasswordInput] = useState<string>("••••••••");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);
  const [showForgotTip, setShowForgotTip] = useState<boolean>(false);

  // Handle role switch in the login card
  const handleRoleTabClick = (role: "student" | "teacher" | "admin") => {
    setSelectedRole(role);
    setLoginFeedback(null);
    const matchedUser = availableUsers.find((u) => u.role === role);
    if (matchedUser) {
      setEmailInput(matchedUser.email);
    } else {
      if (role === "student") setEmailInput("hocsinh@edunova.edu.vn");
      else if (role === "teacher") setEmailInput("giaovien@edunova.edu.vn");
      else setEmailInput("admin@edunova.edu.vn");
    }
  };

  const handleCardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginFeedback(null);
    try {
      // Find matching user or use custom
      const user = availableUsers.find(
        (u) => u.email.toLowerCase() === emailInput.toLowerCase() && u.role === selectedRole
      ) || availableUsers.find((u) => u.email.toLowerCase() === emailInput.toLowerCase());

      if (user) {
        onSelectUser(user);
        setLoginFeedback(`Chào mừng ${user.name}! Bạn đã đăng nhập thành công.`);
      } else {
        await onLoginCustom(emailInput);
        setLoginFeedback(`Đã đăng nhập thành công với email ${emailInput}!`);
      }
    } catch (err: any) {
      setLoginFeedback(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoggingIn(false);
      setTimeout(() => setLoginFeedback(null), 4000);
    }
  };

  const skillCards = [
    {
      id: 1,
      title: "VIẾT CÂU ĐÚNG",
      desc: "Ngữ pháp chuẩn, đủ chủ vị, dấu câu chính xác",
      color: "from-emerald-500 to-teal-600",
      border: "border-emerald-200",
      bg: "bg-emerald-50 text-emerald-900",
      badgeBg: "bg-emerald-500 text-white",
      icon: CheckCircle2,
      level: "cau",
    },
    {
      id: 2,
      title: "VIẾT CÂU HAY",
      desc: "Từ ngữ gợi cảm, mở rộng trạng ngữ sinh động",
      color: "from-teal-500 to-cyan-600",
      border: "border-teal-200",
      bg: "bg-teal-50 text-teal-900",
      badgeBg: "bg-teal-500 text-white",
      icon: Sparkles,
      level: "cau",
    },
    {
      id: 3,
      title: "VIẾT CÂU CÓ HÌNH ẢNH",
      desc: "So sánh, nhân hóa, âm thanh và màu sắc",
      color: "from-amber-500 to-orange-500",
      border: "border-amber-200",
      bg: "bg-amber-50 text-amber-900",
      badgeBg: "bg-amber-500 text-white",
      icon: Eye,
      level: "cau",
    },
    {
      id: 4,
      title: "VIẾT ĐOẠN MẠCH LẠC",
      desc: "Câu chủ đề rõ ràng, ý liền mạch, liên kết tự nhiên",
      color: "from-orange-500 to-rose-500",
      border: "border-orange-200",
      bg: "bg-orange-50 text-orange-900",
      badgeBg: "bg-orange-500 text-white",
      icon: Layers,
      level: "doan",
    },
    {
      id: 5,
      title: "VIẾT BÀI HOÀN CHỈNH",
      desc: "Đủ Mở - Thân - Kết, miêu tả cảm xúc, sáng tạo cá nhân",
      color: "from-rose-500 to-red-600",
      border: "border-rose-200",
      bg: "bg-rose-50 text-rose-900",
      badgeBg: "bg-rose-500 text-white",
      icon: Award,
      level: "bai",
    },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/20 bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 text-white">
      {/* Decorative ambient background mesh & glowing orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[550px] h-[550px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-24 w-[450px] h-[450px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 -ml-20 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Top Banner Toolbar: Badge + 16:9 Fullscreen Trigger */}
      <div className="relative z-20 px-6 sm:px-10 pt-6 pb-2 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CHUẨN CHƯƠNG TRÌNH GDPT 2018 • TIỂU HỌC LỚP 4</span>
          </div>
          <span className="hidden md:inline-block text-xs text-emerald-200/80 font-medium">
            Tỷ lệ thiết kế chuẩn 16:9 (1920 × 1080 px)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFullscreenCover && (
            <button
              onClick={onOpenFullscreenCover}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all shadow-xs hover:scale-102 cursor-pointer"
              title="Mở toàn màn hình tỷ lệ 16:9 để trình chiếu hoặc xuất ảnh"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Xem Ảnh Bìa Toàn Màn Hình</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 16:9 Layout Grid: Left (55-60%) + Right (40-45%) */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* ============================================================ */}
        {/* KHU VỰC BÊN TRÁI — NHẬN DIỆN THƯƠNG HIỆU VÀ HÀNH TRÌNH VIẾT (58%) */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Header Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Logo EduNova Official Badge */}
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-400 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <span className="text-2xl select-none" role="img" aria-label="owl-mascot">
                    🦉
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                    EDUNOVA
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                    WRITING COACH
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-200 tracking-wider uppercase">
                  Nền Tảng Luyện Viết Sư Phạm & AI Trợ Lý Lớp 4
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="pt-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
                VIẾT HAY HƠN <br />
                <span className="bg-linear-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                  MỖI NGÀY
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed max-w-xl">
              “Cùng AI khám phá ý tưởng, luyện viết và hoàn thiện bài văn bằng chính suy nghĩ của em.”
            </p>
          </div>

          {/* Central 3D Illustration Scene: Vietnamese 4th Graders + AI Robot */}
          <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 shadow-inner overflow-hidden">
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] font-bold text-amber-300 bg-slate-900/40 px-2.5 py-1 rounded-full border border-amber-300/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Đôi Bạn Học Tập Lớp 4 • Áo Polo Đỏ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Illustrated Desk & Students Avatar Visual */}
              <div className="sm:col-span-8 flex items-center gap-3">
                {/* Bé Minh An */}
                <div className="flex-1 bg-white/95 rounded-2xl p-3 text-slate-800 shadow-lg text-center transform hover:-translate-y-1 transition-all">
                  <div className="relative w-16 h-16 mx-auto mb-2 rounded-2xl overflow-hidden ring-3 ring-rose-500 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
                      alt="Bé Minh An học sinh nam áo polo đỏ"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[9px] font-black uppercase py-0.5">
                      Polo Đỏ
                    </div>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900">Bé Minh An</h4>
                  <p className="text-[10px] text-emerald-700 font-bold">Chăm chỉ viết vào vở ô ly</p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-slate-500 font-medium">
                    <span>✏️ Bút chì</span> • <span>📖 Tiếng Việt 4</span>
                  </div>
                </div>

                {/* Bé Phương Thảo */}
                <div className="flex-1 bg-white/95 rounded-2xl p-3 text-slate-800 shadow-lg text-center transform hover:-translate-y-1 transition-all">
                  <div className="relative w-16 h-16 mx-auto mb-2 rounded-2xl overflow-hidden ring-3 ring-rose-500 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80"
                      alt="Bé Phương Thảo học sinh nữ áo polo đỏ"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[9px] font-black uppercase py-0.5">
                      Polo Đỏ
                    </div>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900">Bé Phương Thảo</h4>
                  <p className="text-[10px] text-orange-700 font-bold">Đọc & trao đổi ý tưởng hay</p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-slate-500 font-medium">
                    <span>💡 Bóng ý tưởng</span> • <span>📑 Giấy note</span>
                  </div>
                </div>
              </div>

              {/* Friendly AI Companion Robot */}
              <div className="sm:col-span-4 bg-linear-to-b from-teal-500/30 to-emerald-600/30 border border-teal-300/40 rounded-2xl p-3 text-center backdrop-blur-md">
                <div className="relative inline-block mb-1">
                  <div className="w-12 h-12 rounded-2xl bg-white text-emerald-900 flex items-center justify-center text-2xl shadow-md mx-auto animate-bounce">
                    🤖
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow-xs">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-950" />
                  </div>
                </div>
                <h5 className="text-xs font-black text-amber-300">Robot AI EduNova</h5>
                <p className="text-[10px] text-emerald-100 font-medium leading-tight mt-0.5">
                  Gợi ý từ khóa & hướng dẫn tư duy — <span className="font-bold underline">Không viết bài thay</span>
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 text-[9px] font-extrabold text-white">
                  <span>✨ Gợi mở 1–3 điểm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onNavigate("writing", { level: "cau" })}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/30 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PenTool className="w-4 h-4 text-emerald-950" />
              <span>Vào Luyện Viết Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("scan")}
              className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/20 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileSearch className="w-4 h-4 text-amber-200" />
              <span>AI Scan & Rubric</span>
            </button>

            <button
              onClick={() => onNavigate("games")}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Trò Chơi Ngôn Ngữ</span>
            </button>
          </div>

          {/* HỆ THỐNG 5 THẺ KỸ NĂNG CHUẨN */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                Hệ thống 5 Thẻ Kỹ Năng Viết Toàn Diện
              </span>
              <span className="text-[10px] text-emerald-200">Bấm để luyện ngay</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {skillCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => onNavigate("writing", { level: card.level })}
                    className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 shadow-md hover:shadow-lg transition-all text-left flex flex-col justify-between group cursor-pointer border border-white/40 hover:scale-102"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black text-slate-400">#{card.id}</span>
                        <div className={`w-5 h-5 rounded-md ${card.badgeBg} flex items-center justify-center shadow-xs`}>
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <h6 className="font-black text-[11px] text-slate-900 group-hover:text-emerald-700 leading-tight">
                        {card.title}
                      </h6>
                      <p className="text-[9px] text-slate-500 font-medium leading-snug line-clamp-2 mt-1">
                        {card.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Thông điệp truyền cảm hứng */}
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/70 border border-amber-400/30 flex items-center gap-3">
              <span className="text-xl">🌟</span>
              <p className="text-xs sm:text-sm font-bold text-amber-200 italic">
                “Mỗi bài viết là một bước tiến đến phiên bản tốt hơn của chính mình!”
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* KHU VỰC BÊN PHẢI — KHU VỰC ĐĂNG NHẬP MINH HỌA & THỰC TẾ (42%) */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-white/40 text-slate-900 relative transform transition-all duration-300 hover:shadow-3xl">
            {/* Header Login Card */}
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-600 text-white shadow-md mb-2">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Chào mừng bạn đến với EDUNOVA
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Đăng nhập để bắt đầu hành trình viết hay hơn.
              </p>
            </div>

            {/* Role Selector Tabs (3 options: Học sinh, Giáo viên, Quản trị viên) */}
            <div className="my-4">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                Chọn vai trò của bạn
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                {/* Học sinh */}
                <button
                  type="button"
                  onClick={() => handleRoleTabClick("student")}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === "student"
                      ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="text-sm">🎒</span>
                  <span>Học sinh</span>
                </button>

                {/* Giáo viên */}
                <button
                  type="button"
                  onClick={() => handleRoleTabClick("teacher")}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === "teacher"
                      ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="text-sm">👩‍🏫</span>
                  <span>Giáo viên</span>
                </button>

                {/* Quản trị viên */}
                <button
                  type="button"
                  onClick={() => handleRoleTabClick("admin")}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === "admin"
                      ? "bg-white text-emerald-800 shadow-sm border border-emerald-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="text-sm">🛡️</span>
                  <span>Quản trị viên</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleCardLogin} className="space-y-3.5">
              {/* Email / Username field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập hoặc email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    placeholder="tenhocsinh@edunova.edu.vn"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs text-slate-900 font-semibold transition-all outline-hidden bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotTip(!showForgotTip)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs text-slate-900 font-semibold transition-all outline-hidden bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Forgot password tooltip alert if toggled */}
              {showForgotTip && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Hỗ trợ khôi phục tài khoản:</p>
                    <p>Học sinh vui lòng liên hệ Thầy/Cô chủ nhiệm hoặc Giáo viên Tin học để được cấp lại mật khẩu lớp học.</p>
                  </div>
                </div>
              )}

              {/* Feedback Alert */}
              {loginFeedback && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{loginFeedback}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoggingIn ? "Đang xử lý..." : "Đăng nhập"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick switch account tester */}
              <div className="pt-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mb-1.5">
                  Tài khoản mẫu có sẵn (1 chạm)
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  {availableUsers.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSelectUser(u);
                        setSelectedRole(u.role);
                        setEmailInput(u.email);
                        setLoginFeedback(`Đã chuyển sang tài khoản ${u.name} (${u.role === "student" ? "Học sinh" : u.role === "teacher" ? "Giáo viên" : "Quản trị"})`);
                      }}
                      className={`text-[10px] px-2 py-1 rounded-lg border font-bold transition-all ${
                        currentUser.id === u.id
                          ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {u.name.split(" ").slice(-1)[0]} ({u.role === "student" ? "HS" : u.role === "teacher" ? "GV" : "Admin"})
                    </button>
                  ))}
                </div>
              </div>

              {/* Register Callout */}
              <div className="pt-2 text-center border-t border-slate-100 text-xs text-slate-600">
                <span>Chưa có tài khoản? </span>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="font-extrabold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
