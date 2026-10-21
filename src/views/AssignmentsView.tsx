import React, { useState, useEffect } from "react";
import { User, Assignment, Submission, ClassRoom, EssayPrompt } from "../types";
import { api } from "../services/api";
import { Award, Plus, Calendar, Clock, CheckCircle2, Send, Edit3, Trash2, Eye, Filter, UserCheck, Check, Sparkles, Compass } from "lucide-react";

interface AssignmentsViewProps {
  currentUser: User;
  onDoAssignment: (assignment: Assignment) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({ currentUser, onDoAssignment }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Modal Create / Edit Assignment
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewModalAsg, setPreviewModalAsg] = useState<Assignment | null>(null);

  // Form State
  const [repositoryPrompts, setRepositoryPrompts] = useState<EssayPrompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string>("");
  const [formTitle, setFormTitle] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [formLevel, setFormLevel] = useState<"cau" | "doan" | "bai">("doan");
  const [formTopic, setFormTopic] = useState("Cây cối");
  const [formClassId, setFormClassId] = useState("class-4a1");
  const [formDueDate, setFormDueDate] = useState("2026-10-30");
  const [formTargetWords, setFormTargetWords] = useState(120);
  const [formStatus, setFormStatus] = useState<any>("Đã giao");
  const [formGuidelines, setFormGuidelines] = useState(
    "1. Bám sát yêu cầu đề bài\n2. Dùng ít nhất 1 câu so sánh\n3. Tránh lỗi chính tả l/n"
  );

  // Modal View Submissions / Grading for Teacher
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [teacherScoreInput, setTeacherScoreInput] = useState<number>(4.5);
  const [teacherCommentInput, setTeacherCommentInput] = useState<string>("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [asgRes, clsRes, subRes, promptsRes] = await Promise.all([
        api.getAssignments({ classId: selectedClass || undefined, level: selectedLevel || undefined }),
        api.getClasses(),
        api.getSubmissions({
          studentId: currentUser.role === "student" ? currentUser.id : undefined,
          classId: selectedClass || undefined,
        }),
        api.getPrompts(),
      ]);
      setAssignments(asgRes.assignments || []);
      setClasses(clsRes.classes || []);
      setSubmissions(subRes.submissions || []);
      setRepositoryPrompts(promptsRes.prompts || []);
    } catch (err) {
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedClass, selectedLevel]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrompt.trim()) {
      alert("Vui lòng nhập tên bài và yêu cầu đề bài.");
      return;
    }
    try {
      await api.createAssignment({
        title: formTitle,
        prompt: formPrompt,
        level: formLevel,
        topic: formTopic,
        classId: formClassId,
        dueDate: formDueDate,
        targetWords: formTargetWords,
        status: formStatus,
        guidelines: formGuidelines.split("\n").filter((l) => l.trim().length > 0),
      });
      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      alert("Lỗi tạo bài tập: " + err.message);
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormPrompt("");
    setFormLevel("doan");
    setFormTopic("Cây cối");
    setFormDueDate("2026-10-30");
    setFormTargetWords(120);
    setFormGuidelines("1. Bám sát đề bài\n2. Dùng từ ngữ gợi tả sinh động");
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm("Thầy/Cô có chắc chắn muốn xóa bài tập này không?")) return;
    try {
      await api.deleteAssignment(id);
      loadData();
    } catch (err: any) {
      alert("Lỗi khi xóa bài tập: " + err.message);
    }
  };

  const handleConfirmTeacherEvaluation = async () => {
    if (!gradingSubmission) return;
    try {
      await api.teacherEvaluateSubmission({
        submissionId: gradingSubmission.id,
        teacherName: currentUser.name,
        overallScore: Number(teacherScoreInput),
        overallLevel: Number(teacherScoreInput) >= 4.5 ? 4 : Number(teacherScoreInput) >= 3.5 ? 3 : 2,
        teacherNotes: teacherCommentInput.trim() || "Cô đã duyệt bài, em làm rất tốt!",
      });
      alert("Đã lưu và xác nhận đánh giá chính thức của giáo viên!");
      setGradingSubmission(null);
      loadData();
    } catch (err: any) {
      alert("Lỗi khi duyệt điểm: " + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-200">
            Nhiệm Vụ Rèn Luyện
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Danh Sách Bài Tập & Bài Nộp
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Theo dõi tiến độ làm bài, trạng thái đánh giá Rubric và phản hồi chi tiết từ cô giáo chủ nhiệm.
          </p>
        </div>

        {(currentUser.role === "teacher" || currentUser.role === "admin") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-emerald-600" /> Tạo & Giao Bài Tập Mới
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-extrabold text-slate-400 uppercase text-[10px]">Lọc theo:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="">Tất cả các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="">Tất cả cấp độ</option>
            <option value="cau">Cấp 1: Luyện câu</option>
            <option value="doan">Cấp 2: Luyện đoạn</option>
            <option value="bai">Cấp 3: Luyện bài</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Tổng cộng: <span className="text-emerald-700 font-black">{assignments.length}</span> bài tập
        </div>
      </div>

      {/* Assignments List Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold">
            Đang tải danh sách bài tập...
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">Chưa có bài tập nào</h4>
            <p className="text-xs">Hiện tại không có bài tập nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          assignments.map((asg) => {
            // Find student's submission for this assignment
            const studentSub = submissions.find((s) => s.assignmentId === asg.id && s.studentId === currentUser.id);
            const classSubs = submissions.filter((s) => s.assignmentId === asg.id);

            return (
              <div
                key={asg.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          asg.level === "cau"
                            ? "bg-emerald-100 text-emerald-800"
                            : asg.level === "doan"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {asg.level === "cau" ? "Luyện câu" : asg.level === "doan" ? "Luyện đoạn" : "Luyện bài"}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        Chủ đề: {asg.topic}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        Trạng thái: {asg.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">{asg.title}</h3>
                  </div>

                  {/* Top Right Status or Action */}
                  <div className="flex items-center gap-2">
                    {currentUser.role === "student" ? (
                      studentSub ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {studentSub.status === "Hoàn thành"
                              ? "Đã hoàn thành"
                              : studentSub.status === "Đã phản hồi"
                              ? "Cô đã chấm điểm"
                              : "Đã nộp bài"}
                          </span>
                          <button
                            onClick={() => onDoAssignment(asg)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                          >
                            Xem lại bài
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onDoAssignment(asg)}
                          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" /> Làm bài ngay
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewModalAsg(asg)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem trước
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(asg.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                          title="Xóa bài tập"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {asg.prompt}
                </p>

                {/* Guidelines */}
                {asg.guidelines && asg.guidelines.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Hướng dẫn của cô:</p>
                    <div className="flex flex-wrap gap-2">
                      {asg.guidelines.map((g, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
                        >
                          ✓ {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Hạn nộp: {asg.dueDate}
                    </span>
                    <span>Mục tiêu: {asg.targetWords || 120} từ</span>
                  </div>

                  {currentUser.role !== "student" && (
                    <div className="text-xs font-semibold text-emerald-700">
                      Đã có {classSubs.length} học sinh nộp bài
                    </div>
                  )}
                </div>

                {/* For Teachers: List of submissions for this assignment */}
                {currentUser.role !== "student" && classSubs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      Danh sách bài nộp cần duyệt / chấm ({classSubs.length}):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {classSubs.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">{sub.studentName}</p>
                            <p className="text-[10px] text-slate-500">
                              {sub.wordCount} từ • Điểm: {sub.rubricEvaluation?.overallScore ? `${sub.rubricEvaluation.overallScore}đ` : "Chờ chấm"}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setGradingSubmission(sub);
                              setTeacherScoreInput(sub.rubricEvaluation?.overallScore || 4.5);
                              setTeacherCommentInput(sub.rubricEvaluation?.teacherNotes || "");
                            }}
                            className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Chấm & Duyệt
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Preview Assignment Before Release */}
      {previewModalAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Xem trước bài tập giao cho học sinh</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <p><span className="font-bold">Tiêu đề:</span> {previewModalAsg.title}</p>
              <p><span className="font-bold">Chủ đề:</span> {previewModalAsg.topic}</p>
              <p><span className="font-bold">Cấp độ:</span> {previewModalAsg.level}</p>
              <p><span className="font-bold">Đề bài:</span> {previewModalAsg.prompt}</p>
              <p><span className="font-bold">Hạn nộp:</span> {previewModalAsg.dueDate}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewModalAsg(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Teacher Grading & Rubric Confirmation */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 relative">
            <h3 className="text-xl font-black text-slate-900">
              Chấm & Duyệt Điểm Rubric: {gradingSubmission.studentName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Bài viết: <span className="font-bold text-slate-800">{gradingSubmission.assignmentTitle}</span> ({gradingSubmission.wordCount} từ)
            </p>

            {/* Student Essay Content */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800 max-h-56 overflow-y-auto whitespace-pre-wrap font-mono">
              {gradingSubmission.currentContent}
            </div>

            {/* AI Rubric Suggestion */}
            {gradingSubmission.rubricEvaluation && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Gợi ý đánh giá của AI Trợ lý: Mức {gradingSubmission.rubricEvaluation.overallLevel} ({gradingSubmission.rubricEvaluation.overallScore}đ/5.0)
                </div>
                <p className="text-amber-800">{gradingSubmission.rubricEvaluation.overallComment}</p>
              </div>
            )}

            {/* Teacher Adjustment */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Điểm số chính thức của Giáo viên (thang điểm 5.0):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={teacherScoreInput}
                  onChange={(e) => setTeacherScoreInput(Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhận xét và lời khích lệ của Giáo viên:
                </label>
                <textarea
                  rows={3}
                  value={teacherCommentInput}
                  onChange={(e) => setTeacherCommentInput(e.target.value)}
                  placeholder="Cô khen bài viết của em dùng từ so sánh rất hay, chú ý rèn thêm chữ viết và dấu câu nhé..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setGradingSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmTeacherEvaluation}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Xác nhận đánh giá chính thức
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Assignment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 relative">
            <h3 className="text-xl font-black text-slate-900">Tạo & Giao Bài Tập Mới Cho Lớp</h3>

            {/* Quick Pick From Prompt Repository */}
            {repositoryPrompts.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>Chọn mẫu nhanh từ Kho Đề Văn Lớp 4 (KNTT):</span>
                </div>
                <select
                  value={selectedPromptId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setSelectedPromptId(pid);
                    const found = repositoryPrompts.find((p) => p.id === pid);
                    if (found) {
                      setFormTitle(found.title);
                      setFormPrompt(found.prompt);
                      setFormLevel(found.level);
                      setFormTopic(found.topic);
                      setFormTargetWords(found.targetWords);
                      const guides = [
                        ...found.stepByStepGuide.step1Understanding.keyElements,
                        ...(found.stepByStepGuide.step4VocabularyAndFigurative?.comparisons?.slice(0, 1) || []),
                      ];
                      setFormGuidelines(guides.join("\n"));
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn đề từ Kho đề (Tự động điền hướng dẫn & từ vựng) --</option>
                  {repositoryPrompts.map((rp) => (
                    <option key={rp.id} value={rp.id}>
                      [{rp.bookVolume === "tap1" ? "Tập 1" : "Tập 2"}] {rp.title} ({rp.genreLabel})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên bài tập</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Tả cây bóng mát trên sân trường em"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cấp độ rèn luyện</label>
                  <select
                    value={formLevel}
                    onChange={(e: any) => setFormLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="cau">Cấp 1: Luyện câu</option>
                    <option value="doan">Cấp 2: Luyện đoạn</option>
                    <option value="bai">Cấp 3: Luyện bài văn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề bài viết</label>
                  <select
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Cây cối">Cây cối</option>
                    <option value="Con vật">Con vật</option>
                    <option value="Đồ vật">Đồ vật</option>
                    <option value="Cảnh đẹp">Cảnh đẹp</option>
                    <option value="Gia đình">Gia đình</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp nhận bài</label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn nộp</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yêu cầu đề bài chi tiết</label>
                <textarea
                  rows={3}
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  placeholder="Em hãy quan sát một cây bóng mát trên sân trường và miêu tả theo trình tự..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hướng dẫn dàn ý / Tiêu chí nhắc nhở (mỗi dòng một ý)
                </label>
                <textarea
                  rows={3}
                  value={formGuidelines}
                  onChange={(e) => setFormGuidelines(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                >
                  Phát hành & Giao bài ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
