import React from "react";
import { User, Assignment, Submission, GameResult, ScreenId } from "../../types";
import { StatCard } from "../../components/common/StatCard";
import { ProgressBar } from "../../components/common/ProgressBar";
import {
  Sparkles,
  PenTool,
  Award,
  Gamepad2,
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  Heart,
  Flame,
  Lightbulb,
} from "lucide-react";

interface StudentHomeViewProps {
  currentUser: User;
  assignments: Assignment[];
  submissions: Submission[];
  gameResults: GameResult[];
  onNavigate: (screenId: ScreenId, extra?: any) => void;
}

export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  currentUser,
  assignments,
  submissions,
  gameResults,
  onNavigate,
}) => {
  const pendingAssignments = assignments.filter((a) => a.status === "Đã giao" || a.status === "Đang thực hiện");
  const completedSubmissions = submissions.filter((s) => s.status === "Hoàn thành" || s.status === "Đã phản hồi");

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-6 sm:p-8 lg:p-10 shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Slogan: “Mỗi ngày chăm chỉ – Mỗi bài viết tiến bộ!”</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Chào mừng {currentUser.name} đến với EduNova!
            </h1>

            <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed max-w-xl">
              Hôm nay em hãy cùng Trợ lý Cú Vàng rèn luyện một câu văn thật sinh động có so sánh và nhân hóa nhé!
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("student-writing", { level: "cau" })}
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md shadow-amber-400/20 transition-all flex items-center gap-2"
              >
                <PenTool className="w-4 h-4 text-emerald-950" />
                Vào Luyện Viết Hôm Nay
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate("student-games")}
                className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                Trò Chơi Ngôn Ngữ
              </button>
            </div>
          </div>

          {/* Daily Streak & Mascot Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-center space-y-3 w-full max-w-xs shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100 pb-2 border-b border-white/15">
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-300" /> Chuỗi học tập
                </span>
                <span className="font-extrabold text-amber-300">5 ngày liên tiếp</span>
              </div>

              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/90 p-1 ring-3 ring-rose-500 overflow-hidden relative shadow-md">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-white">{currentUser.name}</h4>
                <p className="text-[11px] text-emerald-200 font-semibold">
                  Đồng phục Áo Polo Đỏ · Lớp 4A1
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 text-[11px] text-emerald-100 font-medium leading-tight">
                🦉 "Chỉ cần viết 1 câu hay mỗi ngày, em sẽ trở thành Cây Bút Vàng!"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Bài hoàn thành"
          value={`${completedSubmissions.length} bài`}
          subtext="Đã được chấm điểm"
          trend="+1 tuần này"
        />
        <StatCard
          label="Nhiệm vụ đang chờ"
          value={`${pendingAssignments.length} bài`}
          subtext="Cô giáo đã giao"
          onClick={() => onNavigate("student-assignments")}
        />
        <StatCard
          label="Ngôi sao tích lũy"
          value="12 ⭐"
          subtext="Từ bài viết & trò chơi"
        />
        <StatCard
          label="Cấp độ hiện tại"
          value="Bút Nhí 4A"
          subtext="Tiến độ xuất sắc"
        />
      </div>

      {/* Main 2-Column: Pending Assignments & Recent Writing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Nhiệm vụ cần làm (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Bài Tập Cần Hoàn Thành ({pendingAssignments.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate("student-assignments")}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingAssignments.map((asg) => (
              <div
                key={asg.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="font-bold text-emerald-800">
                      {asg.level === "cau" ? "Luyện câu" : asg.level === "doan" ? "Luyện đoạn" : "Luyện bài"}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Hạn nộp: {asg.dueDate}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{asg.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1">{asg.prompt}</p>
                </div>

                <button
                  onClick={() => onNavigate("student-writing", { assignment: asg })}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
                >
                  Làm bài
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Bài viết gần đây & Mẹo hay (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Bài Viết Gần Đây</h3>
              <button
                onClick={() => onNavigate("student-submissions")}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Chi tiết →
              </button>
            </div>

            <div className="space-y-3">
              {completedSubmissions.slice(0, 2).map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">
                      {sub.assignmentTitle}
                    </span>
                    {sub.rubricEvaluation && (
                      <span className="font-extrabold text-emerald-800 text-[11px]">
                        Mức {sub.rubricEvaluation.overallLevel} ({sub.rubricEvaluation.overallScore}đ)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 italic font-serif">
                    "{sub.currentContent}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mẹo nhỏ hôm nay */}
          <div className="p-5 rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-extrabold uppercase text-amber-900">
                Bí quyết viết văn hôm nay
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-amber-900 font-medium">
              "Trước khi viết câu văn, em hãy tự hỏi: Cảnh vật này có màu sắc gì? Có âm thanh nào không? Và em yêu quý sự vật này ở điểm gì nhất?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
