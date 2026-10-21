import React, { useState } from "react";
import { User, Submission, Assignment, ClassRoom, RubricScore, ScreenId } from "../../types";
import { defaultRubricDefinitions } from "../../data/demoData";
import { RubricScale } from "../../components/common/RubricScale";
import { EmptyState } from "../../components/common/EmptyState";
import {
  CheckSquare,
  Search,
  Check,
  Eye,
  Sparkles,
  Clock,
  BookOpen,
  ArrowRight,
  Filter,
} from "lucide-react";

interface TeacherGradingViewProps {
  currentUser: User;
  submissions: Submission[];
  classes: ClassRoom[];
  assignments: Assignment[];
  onConfirmGrading: (submissionId: string, updatedSub: Submission) => void;
  onShowToast: (msg: string, type: "success" | "warning" | "error" | "info") => void;
  initialSelectedSubmission?: Submission | null;
}

export const TeacherGradingView: React.FC<TeacherGradingViewProps> = ({
  currentUser,
  submissions,
  classes,
  assignments,
  onConfirmGrading,
  onShowToast,
  initialSelectedSubmission,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    initialSelectedSubmission || submissions[0] || null
  );

  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Editable scores
  const [editableScores, setEditableScores] = useState<RubricScore[]>(
    selectedSubmission?.rubricEvaluation?.scores || [
      { criterionId: "c1", name: "Đáp ứng yêu cầu đề bài", level: 4, score: 5.0, comment: "Đúng thể loại văn miêu tả", evidence: "", suggestion: "" },
      { criterionId: "c2", name: "Nội dung & phát triển ý", level: 3, score: 4.2, comment: "Tả tương đối đều ý", evidence: "", suggestion: "" },
      { criterionId: "c3", name: "Diễn đạt câu", level: 4, score: 4.8, comment: "Câu văn gãy gọn", evidence: "", suggestion: "" },
      { criterionId: "c4", name: "Sử dụng từ ngữ & hình ảnh", level: 4, score: 4.7, comment: "Có so sánh sinh động", evidence: "", suggestion: "" },
      { criterionId: "c5", name: "Mạch lạc, liên kết", level: 3, score: 4.0, comment: "Liên kết câu tự nhiên", evidence: "", suggestion: "" },
      { criterionId: "c6", name: "Chính tả & trình bày", level: 4, score: 5.0, comment: "Chính tả sạch sẽ", evidence: "", suggestion: "" },
    ]
  );

  const [teacherNotes, setTeacherNotes] = useState(
    selectedSubmission?.rubricEvaluation?.teacherNotes ||
      "Cô rất khen ngợi bài viết của em! Em đã biết cách dùng biện pháp so sánh và từ láy rất tự nhiên."
  );

  const handleSelectSubmission = (sub: Submission) => {
    setSelectedSubmission(sub);
    if (sub.rubricEvaluation) {
      setEditableScores(sub.rubricEvaluation.scores);
      setTeacherNotes(sub.rubricEvaluation.teacherNotes || "");
    }
  };

  const handleRubricScoreChange = (criterionId: string, newLevel: 1 | 2 | 3 | 4) => {
    const scores = { 1: 2.0, 2: 3.2, 3: 4.2, 4: 4.9 };
    const updated = editableScores.map((s) =>
      s.criterionId === criterionId
        ? {
            ...s,
            level: newLevel,
            score: scores[newLevel],
            comment: `Giáo viên đánh giá Mức ${newLevel}`,
          }
        : s
    );
    setEditableScores(updated);
  };

  const handleSaveEvaluation = () => {
    if (!selectedSubmission) return;

    const avgScore = Number(
      (editableScores.reduce((acc, s) => acc + s.score, 0) / editableScores.length).toFixed(1)
    );
    const avgLevel: 1 | 2 | 3 | 4 = avgScore >= 4.6 ? 4 : avgScore >= 3.6 ? 3 : avgScore >= 2.6 ? 2 : 1;

    const updatedSub: Submission = {
      ...selectedSubmission,
      status: "Đã phản hồi",
      rubricEvaluation: {
        scores: editableScores,
        overallLevel: avgLevel,
        overallScore: avgScore,
        overallComment: teacherNotes,
        evaluatedAt: new Date().toLocaleDateString("vi-VN"),
        confirmedByTeacher: true,
        teacherNotes,
      },
    };

    onConfirmGrading(selectedSubmission.id, updatedSub);
    setSelectedSubmission(updatedSub);
    onShowToast(`Đã xác nhận đánh giá chính thức cho em ${selectedSubmission.studentName}!`, "success");
  };

  const filteredSubs = submissions.filter((s) => {
    if (filterClass !== "all" && s.classId !== filterClass) return false;
    if (filterStatus === "pending" && s.rubricEvaluation?.confirmedByTeacher) return false;
    if (filterStatus === "confirmed" && !s.rubricEvaluation?.confirmedByTeacher) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Chấm Bài & Duyệt Rubric Chính Thức
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Xem xét bài làm của học sinh, tham khảo gợi ý sư phạm của AI và xác nhận kết quả đánh giá 4 mức
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Submissions List Column (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-900">Danh sách bài nộp ({filteredSubs.length})</h3>
            <div className="flex gap-2">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-1/2 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">Tất cả lớp</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-1/2 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chưa duyệt</option>
                <option value="confirmed">Đã duyệt</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredSubs.map((sub) => {
              const isSelected = selectedSubmission?.id === sub.id;
              const isConfirmed = sub.rubricEvaluation?.confirmedByTeacher;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">{sub.studentName}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        isConfirmed ? "text-emerald-800" : "text-amber-800"
                      }`}
                    >
                      {isConfirmed ? "✓ Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 font-medium">{sub.assignmentTitle}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{sub.wordCount} từ</span>
                    <span aria-hidden="true">·</span>
                    <span>{sub.submittedAt || "Mới nộp"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Submission & Rubric Review Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!selectedSubmission ? (
            <EmptyState
              title="Chưa chọn bài nộp"
              description="Vui lòng bấm chọn một bài viết từ danh sách bên trái để chấm điểm."
              icon={CheckSquare}
            />
          ) : (
            <>
              {/* Student Essay Content Display */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {selectedSubmission.assignmentTitle}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Học sinh: <span className="font-bold text-slate-800">{selectedSubmission.studentName}</span> · Lớp {selectedSubmission.classId.replace("class-", "").toUpperCase()} · {selectedSubmission.wordCount} từ
                    </p>
                  </div>

                  <span className="text-xs font-black px-3 py-1 rounded-xl bg-slate-100 text-slate-800">
                    {selectedSubmission.level === "cau"
                      ? "Luyện câu"
                      : selectedSubmission.level === "doan"
                      ? "Luyện đoạn"
                      : "Luyện bài"}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs sm:text-sm leading-relaxed text-slate-800 font-serif whitespace-pre-wrap">
                  {selectedSubmission.currentContent}
                </div>

                {/* AI suggestion notice card */}
                {selectedSubmission.aiFeedback && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5 text-xs text-amber-950">
                    <div className="flex items-center gap-1.5 font-black uppercase text-amber-900 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Gợi ý tham khảo từ AI Trợ lý Sư phạm:
                    </div>
                    <p className="leading-relaxed">
                      {selectedSubmission.aiFeedback.pedagogicalNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Rubric Evaluation Tools */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-slate-900">
                      Bảng Chấm Điểm Rubric 4 Mức Của Giáo Viên
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Bấm chọn mức điểm cho từng tiêu chí để xác nhận kết quả chính thức
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500">Điểm trung bình:</span>
                    <p className="text-xl font-black text-emerald-800">
                      {(
                        editableScores.reduce((acc, s) => acc + s.score, 0) / editableScores.length
                      ).toFixed(1)}
                      /5.0
                    </p>
                  </div>
                </div>

                {/* Rubric Scale for 6 Criteria */}
                <RubricScale
                  definitions={defaultRubricDefinitions}
                  currentScores={editableScores}
                  onChangeScore={handleRubricScoreChange}
                />

                {/* Official Teacher Notes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800">
                    Nhận xét & Lời khuyên chính thức của Giáo viên gửi học sinh:
                  </label>
                  <textarea
                    rows={3}
                    value={teacherNotes}
                    onChange={(e) => setTeacherNotes(e.target.value)}
                    placeholder="Ghi nhận xét động viên và chỉ ra điểm cần rèn luyện thêm..."
                    className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
                  />
                </div>

                {/* Save evaluation button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveEvaluation}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Xác nhận đánh giá chính thức
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
