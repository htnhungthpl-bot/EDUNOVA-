import React from "react";
import { User, ClassRoom, Assignment, Submission, ScreenId } from "../../types";
import { StatCard } from "../../components/common/StatCard";
import { ProgressBar } from "../../components/common/ProgressBar";
import {
  LayoutDashboard,
  Users,
  Award,
  CheckSquare,
  BarChart3,
  ArrowRight,
  Clock,
  Sparkles,
  School,
  FileCheck,
} from "lucide-react";

interface TeacherDashboardViewProps {
  currentUser: User;
  classes: ClassRoom[];
  assignments: Assignment[];
  submissions: Submission[];
  students: User[];
  onNavigate: (screenId: ScreenId, extra?: any) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  currentUser,
  classes,
  assignments,
  submissions,
  students,
  onNavigate,
}) => {
  const pendingGradingSubs = submissions.filter(
    (s) => s.status === "Đã nộp" && (!s.rubricEvaluation || !s.rubricEvaluation.confirmedByTeacher)
  );

  // Rubric Level counts across submissions
  const level4 = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 4).length;
  const level3 = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 3).length;
  const level2 = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 2).length;
  const level1 = submissions.filter((s) => s.rubricEvaluation?.overallLevel === 1).length;
  const totalGraded = submissions.filter((s) => s.rubricEvaluation).length || 1;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-700 via-teal-700 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            Bàn Làm Việc Giáo Viên
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Chào mừng {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Giáo viên chủ nhiệm Khối 4 · Trường Tiểu học Chu Văn An · Theo dõi tiến độ viết văn và đánh giá Rubric
          </p>
        </div>

        <button
          onClick={() => onNavigate("teacher-assignments")}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Award className="w-4 h-4 text-emerald-950" /> Tạo & Giao Bài Tập Mới
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Tổng số học sinh"
          value={`${students.length} em`}
          subtext={`Qua ${classes.length} lớp học`}
          onClick={() => onNavigate("teacher-students")}
        />
        <StatCard
          label="Bài chờ duyệt điểm"
          value={`${pendingGradingSubs.length} bài`}
          subtext="Cần giáo viên xác nhận"
          trend={pendingGradingSubs.length > 0 ? "Ưu tiên xử lý" : "Đã xong hết"}
          onClick={() => onNavigate("teacher-grading")}
        />
        <StatCard
          label="Bài tập đang mở"
          value={`${assignments.length} bài`}
          subtext="Đầy đủ 3 cấp độ"
          onClick={() => onNavigate("teacher-assignments")}
        />
        <StatCard
          label="Tỉ lệ đạt Mức 3 & 4"
          value={`${Math.round(((level3 + level4) / totalGraded) * 100)}%`}
          subtext="Chất lượng viết tốt"
          trend="Đạt chuẩn GDPT"
        />
      </div>

      {/* 2-Column: Pending Grading & Rubric Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Bài nộp cần chấm / duyệt (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Bài Viết Cần Duyệt & Chấm Điểm ({pendingGradingSubs.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate("teacher-grading")}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingGradingSubs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                Hiện tại không có bài nào đang chờ chấm. Tất cả bài nộp đã được duyệt hoàn tất!
              </div>
            ) : (
              pendingGradingSubs.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-bold text-slate-900">{sub.studentName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Lớp {sub.classId.replace("class-", "").toUpperCase()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sub.wordCount} từ</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">
                      {sub.assignmentTitle}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-1 italic font-serif">
                      "{sub.currentContent}"
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate("teacher-grading", { submission: sub })}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
                  >
                    Chấm bài
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Phân bố 4 mức Rubric toàn khối (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Phân Bố 4 Mức Rubric Của Lớp
              </h3>
            </div>
            <button
              onClick={() => onNavigate("teacher-reports")}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Chi tiết →
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Mức 4: Vận dụng tốt (4.6 – 5.0đ)</span>
                <span className="text-emerald-800">{level4} bài ({Math.round((level4 / totalGraded) * 100)}%)</span>
              </div>
              <ProgressBar value={(level4 / totalGraded) * 100} showPercent={false} color="bg-emerald-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Mức 3: Đạt yêu cầu (3.6 – 4.5đ)</span>
                <span className="text-blue-800">{level3} bài ({Math.round((level3 / totalGraded) * 100)}%)</span>
              </div>
              <ProgressBar value={(level3 / totalGraded) * 100} showPercent={false} color="bg-blue-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Mức 2: Đang hình thành (2.6 – 3.5đ)</span>
                <span className="text-amber-800">{level2} bài ({Math.round((level2 / totalGraded) * 100)}%)</span>
              </div>
              <ProgressBar value={(level2 / totalGraded) * 100} showPercent={false} color="bg-amber-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Mức 1: Cần hỗ trợ (1.0 – 2.5đ)</span>
                <span className="text-rose-800">{level1} bài ({Math.round((level1 / totalGraded) * 100)}%)</span>
              </div>
              <ProgressBar value={(level1 / totalGraded) * 100} showPercent={false} color="bg-rose-500" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            💡 Gợi ý sư phạm: Lớp 4A1 tiến bộ rõ rệt ở kỹ năng đặt câu so sánh. Tuần này cô nên tập trung rèn luyện cách dùng từ nối giữa các đoạn văn để bài viết thêm mạch lạc.
          </div>
        </div>
      </div>
    </div>
  );
};
