import React, { useState } from "react";
import { User, Submission, ScreenId } from "../../types";
import { EmptyState } from "../../components/common/EmptyState";
import {
  FileCheck,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  X,
  History,
  Star,
  MessageSquare,
} from "lucide-react";

interface StudentSubmissionsViewProps {
  currentUser: User;
  submissions: Submission[];
  onNavigate: (screenId: ScreenId, extra?: any) => void;
}

export const StudentSubmissionsView: React.FC<StudentSubmissionsViewProps> = ({
  currentUser,
  submissions,
  onNavigate,
}) => {
  // Only student's own submissions
  const studentSubs = submissions.filter((s) => s.studentId === currentUser.id);

  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Kết Quả Bài Viết & Đánh Giá Của Giáo Viên
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Hồ sơ bài làm của riêng em: Xem lại các bài đã nộp, nhận xét của cô giáo và điểm tự đánh giá Rubric
        </p>
      </div>

      {studentSubs.length === 0 ? (
        <EmptyState
          title="Em chưa có bài viết nào được nộp"
          description="Hãy vào mục Bài tập hoặc Không gian luyện viết để sáng tác bài đầu tiên nhé!"
          icon={FileCheck}
          actionLabel="Vào luyện viết ngay"
          onAction={() => onNavigate("student-writing")}
        />
      ) : (
        <div className="space-y-4">
          {studentSubs.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="font-extrabold text-emerald-800">
                      {sub.level === "cau" ? "Luyện câu" : sub.level === "doan" ? "Luyện đoạn" : "Luyện bài"}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{sub.wordCount} từ</span>
                    <span aria-hidden="true">·</span>
                    <span>{sub.submittedAt || "Bản nháp"}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {sub.assignmentTitle}
                  </h3>
                </div>

                {/* Score badge / status */}
                <div className="flex items-center gap-3">
                  {sub.rubricEvaluation ? (
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-800">
                        {sub.rubricEvaluation.overallScore}/5.0 điểm
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        Mức {sub.rubricEvaluation.overallLevel}
                        {sub.rubricEvaluation.confirmedByTeacher && " · Cô đã duyệt"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                      Đang chờ cô chấm
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedSub(sub)}
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                  </button>
                </div>
              </div>

              {/* Excerpt of student text */}
              <p className="text-xs text-slate-700 leading-relaxed font-serif bg-slate-50/70 p-4 rounded-2xl border border-slate-100 italic line-clamp-2">
                "{sub.currentContent}"
              </p>

              {/* Teacher comments if confirmed */}
              {sub.rubricEvaluation?.teacherNotes && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="text-base shrink-0">👩‍🏫</span>
                  <div>
                    <span className="font-bold">Lời nhận xét của cô giáo: </span>
                    <span className="font-medium">{sub.rubricEvaluation.teacherNotes}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Submission Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] p-6 sm:p-8 space-y-6 overflow-y-auto relative">
            <button
              onClick={() => setSelectedSub(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">
                Chi tiết bài viết & Đánh giá
              </span>
              <h3 className="text-xl font-black text-slate-900">{selectedSub.assignmentTitle}</h3>
              <p className="text-xs text-slate-500 font-medium">
                Tác giả: <span className="font-bold text-slate-700">{selectedSub.studentName}</span> · {selectedSub.wordCount} từ
              </p>
            </div>

            {/* Full text */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase text-slate-700">Nội dung bài viết:</h4>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-800 font-serif whitespace-pre-wrap">
                {selectedSub.currentContent}
              </div>
            </div>

            {/* Rubric evaluation criteria */}
            {selectedSub.rubricEvaluation && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-extrabold uppercase text-slate-800">
                    Bảng Rubric 4 mức chi tiết:
                  </h4>
                  <span className="text-xs font-black text-emerald-800">
                    {selectedSub.rubricEvaluation.overallScore}/5.0 điểm
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedSub.rubricEvaluation.scores.map((sc) => (
                    <div
                      key={sc.criterionId}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{sc.name}</span>
                        <span className="text-emerald-800 font-black">
                          Mức {sc.level} ({sc.score}đ)
                        </span>
                      </div>
                      <p className="text-slate-600">{sc.comment}</p>
                      {sc.evidence && (
                        <p className="text-[11px] text-slate-500 italic">
                          🔍 Minh chứng trong bài: "{sc.evidence}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
