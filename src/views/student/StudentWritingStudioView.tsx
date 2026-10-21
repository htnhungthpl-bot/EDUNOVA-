import React, { useState, useEffect, useRef } from "react";
import { User, Assignment, Submission, Version, RubricScore, WritingLevel } from "../../types";
import { defaultRubricDefinitions } from "../../data/demoData";
import { RubricScale } from "../../components/common/RubricScale";
import confetti from "canvas-confetti";
import {
  Sparkles,
  BookOpen,
  Send,
  Save,
  Clock,
  Eye,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Layers,
  History,
  RotateCcw,
  MessageSquare,
  AlertCircle,
  X,
  Sliders,
  ChevronDown,
  Info,
} from "lucide-react";

interface StudentWritingStudioViewProps {
  currentUser: User;
  initialAssignment?: Assignment | null;
  initialLevel?: WritingLevel;
  onSaveSubmission: (sub: Submission) => void;
  onShowToast: (msg: string, type: "success" | "warning" | "error" | "info") => void;
}

export const StudentWritingStudioView: React.FC<StudentWritingStudioViewProps> = ({
  currentUser,
  initialAssignment,
  initialLevel = "doan",
  onSaveSubmission,
  onShowToast,
}) => {
  // Level & Prompt
  const [level, setLevel] = useState<WritingLevel>(initialAssignment?.level || initialLevel);
  const [title, setTitle] = useState(
    initialAssignment?.title || "Tả cây phượng vĩ nở hoa trên sân trường em"
  );
  const [promptText, setPromptText] = useState(
    initialAssignment?.prompt ||
      "Em hãy quan sát và viết đoạn văn hoặc bài văn miêu tả vẻ đẹp của cây phượng vĩ nơi góc sân trường vào một buổi sáng mùa hè."
  );

  // Content & Versions
  const [content, setContent] = useState(
    "Mỗi ngày cắp sách tới trường, hình ảnh đầu tiên đón chào em chính là bác phượng già đứng sừng sững bên cạnh cột cờ. Nhìn từ xa, cây phượng như một chiếc ô khổng lồ màu xanh thẫm che mát cả một góc sân trường."
  );
  const [versions, setVersions] = useState<Version[]>([
    {
      versionNumber: 1,
      content:
        "Trường em có cây phượng rất to ở góc sân trường. Cây nở hoa đỏ vào mùa hè. Chúng em rất thích chơi dưới gốc cây.",
      savedAt: "10/10/2026 09:15",
      wordCount: 26,
      sentenceCount: 3,
      notes: "Bản sơ thảo các ý ban đầu",
    },
    {
      versionNumber: 2,
      content:
        "Mỗi ngày cắp sách tới trường, hình ảnh đầu tiên đón chào em chính là bác phượng già đứng sừng sững bên cạnh cột cờ. Nhìn từ xa, cây phượng như một chiếc ô khổng lồ màu xanh thẫm che mát cả một góc sân trường.",
      savedAt: "11/10/2026 10:30",
      wordCount: 42,
      sentenceCount: 2,
      notes: "Thêm nhân hóa 'bác phượng già' và so sánh 'như chiếc ô khổng lồ'",
    },
  ]);

  // Draft saving status
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState("10:30");

  // Mobile layout active tab: 'prompt' | 'editor' | 'assistant'
  const [mobileTab, setMobileTab] = useState<"prompt" | "editor" | "assistant">("editor");

  // Preview Full Article Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Compare Versions Modal
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [compareV1, setCompareV1] = useState(1);
  const [compareV2, setCompareV2] = useState(2);

  // Rubric self-evaluation scores
  const [rubricScores, setRubricScores] = useState<RubricScore[]>([
    {
      criterionId: "c1",
      name: "Đáp ứng yêu cầu đề bài",
      level: 4,
      score: 5.0,
      comment: "Bám sát đề bài tả cây phượng vĩ ở sân trường",
      evidence: "bác phượng già đứng sừng sững bên cột cờ",
      suggestion: "Tiếp tục phát huy",
    },
    {
      criterionId: "c2",
      name: "Nội dung & phát triển ý",
      level: 3,
      score: 4.2,
      comment: "Có ý tả bao quát tốt, cần thêm chi tiết về hoa và lá",
      evidence: "chiếc ô khổng lồ màu xanh thẫm",
      suggestion: "Tả thêm sắc đỏ rực của hoa phượng",
    },
    {
      criterionId: "c3",
      name: "Diễn đạt câu",
      level: 4,
      score: 4.8,
      comment: "Câu văn gãy gọn, có cấu trúc nhịp nhàng",
      evidence: "Mỗi ngày cắp sách tới trường, ...",
      suggestion: "Giữ vững phong độ",
    },
    {
      criterionId: "c4",
      name: "Sử dụng từ ngữ & hình ảnh",
      level: 4,
      score: 4.7,
      comment: "Sử dụng thành công phép so sánh chiếc ô khổng lồ và nhân hóa bác phượng",
      evidence: "bác phượng già, như chiếc ô khổng lồ",
      suggestion: "Rất tốt",
    },
    {
      criterionId: "c5",
      name: "Mạch lạc, liên kết",
      level: 3,
      score: 4.0,
      comment: "Các câu liên kết tự nhiên",
      evidence: "Liên kết câu mở đoạn và thân đoạn tốt",
      suggestion: "Dùng thêm từ nối ở câu tiếp theo",
    },
    {
      criterionId: "c6",
      name: "Chính tả & trình bày",
      level: 4,
      score: 5.0,
      comment: "Không mắc lỗi chính tả, chấm phẩy đúng chỗ",
      evidence: "Chính tả sạch đẹp",
      suggestion: "Tiếp tục cẩn thận",
    },
  ]);

  // Socratic conversation mock state
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "coach" | "student"; text: string; time: string }>
  >([
    {
      sender: "coach",
      text: "Chào em! Thầy/Cô Trợ lý EduNova khen câu mở đầu của em: cách gọi 'bác phượng già' và ví von 'như một chiếc ô khổng lồ' rất tự nhiên và gần gũi!",
      time: "10:20",
    },
    {
      sender: "coach",
      text: "❓ Thử thách gợi mở cho em: Khi đứng dưới gốc cây phượng vào mùa hè, em hãy nhắm mắt lại và cảm nhận: Em nghe thấy tiếng ve kêu râm ran thế nào? Và những chùm hoa đỏ trên cao trông giống như thứ gì?",
      time: "10:21",
    },
  ]);
  const [studentInputQuery, setStudentInputQuery] = useState("");

  // Auto-save debouncer
  const autoSaveTimerRef = useRef<any>(null);
  useEffect(() => {
    setSaveStatus("unsaved");
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      handleSaveDraft(false);
    }, 15000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [content]);

  // Statistics
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceCount = content.split(/[.?!]+/).filter((s) => s.trim().length > 0).length;

  const handleSaveDraft = (isNewVersion = false) => {
    setSaveStatus("saving");
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setLastSavedTime(now);

    let updatedVersions = [...versions];
    if (isNewVersion) {
      const nextVer = versions.length + 1;
      const newV: Version = {
        versionNumber: nextVer,
        content,
        savedAt: `${new Date().toLocaleDateString("vi-VN")} ${now}`,
        wordCount,
        sentenceCount,
        notes: `Phiên bản chỉnh sửa ${nextVer}`,
      };
      updatedVersions.push(newV);
      setVersions(updatedVersions);
      onShowToast(`Đã lưu phiên bản mới (Bản ${nextVer})!`, "success");
    } else {
      setSaveStatus("saved");
    }

    const sub: Submission = {
      id: "sub-draft-" + currentUser.id,
      assignmentId: initialAssignment?.id,
      assignmentTitle: title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      classId: currentUser.classId || "class-4a1",
      level,
      currentContent: content,
      versions: updatedVersions,
      wordCount,
      sentenceCount,
      status: "Đang làm",
    };
    onSaveSubmission(sub);
  };

  const handleSendStudentQuestion = (customQ?: string) => {
    const q = customQ || studentInputQuery.trim();
    if (!q) return;

    // Check anti-cheat
    const cheatKeywords = ["viết hộ em", "viết cả bài", "làm hộ em", "cho em bài mẫu để chép"];
    const isAskingToCheat = cheatKeywords.some((k) => q.toLowerCase().includes(k));

    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    const newMsgs = [...chatMessages, { sender: "student" as const, text: q, time: now }];

    if (isAskingToCheat) {
      newMsgs.push({
        sender: "coach" as const,
        text: "Thầy/Cô EduNova luôn đồng hành cùng em! Theo quy tắc học tập của lớp chúng mình, em chính là tác giả nhí tài năng. Thầy/Cô sẽ không viết thay bài cho em, mà sẽ cùng em khám phá từng câu gợi ý nhé. Em muốn miêu tả đặc điểm gì trước tiên nào?",
        time: now,
      });
    } else {
      // Pedagogical Socratic response demo
      newMsgs.push({
        sender: "coach" as const,
        text: `Gợi ý minh họa sư phạm: Ý tưởng "${q}" rất hay! Em hãy thử dùng từ láy gợi cảm (như 'rực rỡ', 'xanh mướt', 'xào xạc') kết hợp với một hình ảnh so sánh thân thuộc (như 'dải lụa', 'chiếc ô', 'đốm lửa') xem câu văn sẽ biến hóa thế nào nhé!`,
        time: now,
      });
    }

    setChatMessages(newMsgs);
    setStudentInputQuery("");
  };

  const handleRubricScoreChange = (criterionId: string, newLevel: 1 | 2 | 3 | 4) => {
    const scores = { 1: 2.0, 2: 3.2, 3: 4.2, 4: 4.9 };
    const updated = rubricScores.map((s) =>
      s.criterionId === criterionId
        ? {
            ...s,
            level: newLevel,
            score: scores[newLevel],
            comment: `Em tự đánh giá ở Mức ${newLevel}`,
          }
        : s
    );
    setRubricScores(updated);
    onShowToast("Đã cập nhật mức tự đánh giá!", "info");
  };

  const handleFinishAndSubmit = () => {
    handleSaveDraft(true);
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
    });
    onShowToast("Chúc mừng em đã hoàn thành và gửi bài thành công!", "success");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {level === "cau" ? "Cấp 1: Luyện câu" : level === "doan" ? "Cấp 2: Luyện đoạn" : "Cấp 3: Luyện bài"}
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {saveStatus === "saving" ? (
                <span className="text-amber-600 font-bold">Đang lưu nháp...</span>
              ) : saveStatus === "saved" ? (
                <span className="text-emerald-700">Đã lưu lúc {lastSavedTime}</span>
              ) : (
                <span className="text-slate-400">Có thay đổi chưa lưu</span>
              )}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{title}</h2>
        </div>

        {/* Level Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setLevel("cau")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                level === "cau" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Luyện câu
            </button>
            <button
              onClick={() => setLevel("doan")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                level === "doan" ? "bg-white text-orange-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Luyện đoạn
            </button>
            <button
              onClick={() => setLevel("bai")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                level === "bai" ? "bg-white text-blue-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Luyện bài
            </button>
          </div>

          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Xem trước bài viết hoàn chỉnh"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Xem trước</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Segmented Switcher */}
      <div className="lg:hidden flex bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setMobileTab("prompt")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mobileTab === "prompt" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          1. Đề bài & Ý tưởng
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mobileTab === "editor" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          2. Vùng viết bài
        </button>
        <button
          onClick={() => setMobileTab("assistant")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mobileTab === "assistant" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          3. Trợ lý & Rubric
        </button>
      </div>

      {/* 3-COLUMN DESKTOP WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: ĐỀ BÀI, MỤC TIÊU & GỢI Ý QUAN SÁT (3 COLS) */}
        <div
          className={`lg:col-span-3 space-y-5 ${
            mobileTab !== "prompt" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Yêu cầu đề bài */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Yêu cầu & Mục tiêu
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
              {promptText}
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              <p className="font-bold text-slate-800">Mục tiêu đạt được:</p>
              <p className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Dung lượng: {level === "cau" ? "1–2 câu" : level === "doan" ? "5–7 câu" : "150–250 từ"}
              </p>
              <p className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Có ít nhất 1 hình ảnh so sánh
              </p>
              <p className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Vận dụng phép nhân hóa sinh động
              </p>
            </div>
          </div>

          {/* Gợi ý quan sát theo giác quan */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Gợi ý quan sát giác quan
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="font-bold text-amber-900 block text-[11px]">👀 Mắt thấy:</span>
                <span className="text-amber-800 text-[11px]">
                  Màu sắc (đỏ rực, xanh mướt, nâu xám), dáng vẻ (sừng sững, xòe rộng, uốn lượn).
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100">
                <span className="font-bold text-teal-900 block text-[11px]">👂 Tai nghe:</span>
                <span className="text-teal-800 text-[11px]">
                  Tiếng ve kêu râm ran, tiếng lá xào xạc trong làn gió mát rượi.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="font-bold text-rose-900 block text-[11px]">❤️ Cảm xúc:</span>
                <span className="text-rose-800 text-[11px]">
                  Kỷ niệm vui vẻ cùng bạn bè dưới bóng mát thân thương.
                </span>
              </div>
            </div>
          </div>

          {/* Túi từ vựng nhanh */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Túi từ ngữ gợi cảm
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "đỏ rực",
                "xanh mướt",
                "xù xì",
                "râm ran",
                "tha thướt",
                "như chiếc ô",
                "bác phượng già",
                "lung linh",
              ].map((token) => (
                <button
                  key={token}
                  onClick={() => setContent((prev) => prev + " " + token)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 text-[11px] font-bold transition-colors"
                  title="Bấm để chèn từ vào bài viết"
                >
                  + {token}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: VÙNG HỌC SINH TỰ VIẾT (6 COLS) */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            mobileTab !== "editor" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 focus-within:border-emerald-500 shadow-xs space-y-4 transition-all">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase">Bài làm của em</span>
                <span className="text-[11px] font-semibold text-slate-500">
                  ({wordCount} từ · {sentenceCount} câu)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveDraft(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" /> Lưu nháp
                </button>
                <button
                  onClick={() => handleSaveDraft(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-600" /> Lưu bản mới
                </button>
              </div>
            </div>

            {/* Title field */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Đặt tiêu đề cho bài viết của em..."
                className="w-full text-base sm:text-lg font-black text-slate-900 placeholder:text-slate-400 focus:outline-none border-b border-transparent focus:border-emerald-300 pb-1"
              />
            </div>

            {/* Vietnamese Writing Textarea */}
            <div className="relative">
              <textarea
                rows={level === "cau" ? 5 : level === "doan" ? 9 : 15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Em hãy bắt đầu viết bằng chính suy nghĩ của mình tại đây (hãy dùng từ ngữ gợi cảm xúc và so sánh nhé)..."
                className="w-full p-2 text-sm sm:text-base leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium resize-y"
              />
            </div>

            {/* Bottom Editor Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {versions.length > 1 && (
                  <button
                    onClick={() => setShowDiffModal(true)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-slate-500" /> So sánh ({versions.length} bản)
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileTab("assistant")}
                  className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Xem gợi ý
                </button>
                <button
                  onClick={handleFinishAndSubmit}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" /> Hoàn thành & Nộp bài
                </button>
              </div>
            </div>
          </div>

          {/* Version History Mini List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-600" />
                Lịch sử phiên bản viết ({versions.length})
              </h4>
            </div>
            <div className="space-y-2">
              {versions.map((v) => (
                <div
                  key={v.versionNumber}
                  onClick={() => {
                    setContent(v.content);
                    onShowToast(`Đã tải lại nội dung Bản ${v.versionNumber}!`, "info");
                  }}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/70 hover:border-emerald-200 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">Bản {v.versionNumber}</span>
                    <span className="text-slate-400 mx-1.5">·</span>
                    <span className="text-slate-500">{v.wordCount} từ</span>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">{v.notes}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Khôi phục</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 3: TRỢ LÝ GỢI MỞ SOCRATIC & RUBRIC TỰ ĐÁNH GIÁ (3 COLS) */}
        <div
          className={`lg:col-span-3 space-y-5 ${
            mobileTab !== "assistant" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Socratic Assistant Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🦉
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900">Trợ Lý Gợi Mở EduNova</h3>
                  <span className="text-[10px] text-amber-700 font-bold">Gợi ý minh họa – Chưa kết nối AI</span>
                </div>
              </div>
            </div>

            {/* Chat conversation area */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl leading-relaxed ${
                    msg.sender === "coach"
                      ? "bg-emerald-50 text-emerald-950 border border-emerald-100"
                      : "bg-slate-100 text-slate-800 ml-4 font-medium"
                  }`}
                >
                  <p className="text-[11px]">{msg.text}</p>
                  <span className="block text-[9px] text-slate-400 text-right mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Socratic prompt chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-extrabold uppercase text-slate-400">Câu hỏi gợi ý có sẵn:</p>
              <div className="flex flex-col gap-1.5">
                {[
                  "Em muốn thêm một câu so sánh về tán cây thì làm sao ạ?",
                  "Làm thế nào để hai câu này nối với nhau tự nhiên hơn?",
                  "Từ ngữ nào gợi tả âm thanh tiếng ve kêu hay nhất?",
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendStudentQuestion(chip)}
                    className="p-2 rounded-xl text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-[11px] font-semibold text-slate-700 transition-colors"
                  >
                    💡 {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Ask the coach custom input */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={studentInputQuery}
                onChange={(e) => setStudentInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendStudentQuestion()}
                placeholder="Nhập câu hỏi nhờ thầy/cô gợi mở..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 font-medium"
              />
              <button
                onClick={() => handleSendStudentQuestion()}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Gửi
              </button>
            </div>
          </div>

          {/* Rubric Self-assessment overview & expand button */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Tự đánh giá Rubric (6 tiêu chí)
              </h4>
              <span className="text-xs font-black text-emerald-800">
                {(
                  rubricScores.reduce((acc, s) => acc + s.score, 0) / rubricScores.length
                ).toFixed(1)}
                /5.0
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {rubricScores.slice(0, 3).map((sc) => (
                <div key={sc.criterionId} className="flex items-center justify-between py-1">
                  <span className="text-slate-600 truncate max-w-[140px] text-[11px]">{sc.name}</span>
                  <span className="font-extrabold text-[11px] text-emerald-800">Mức {sc.level}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <RubricScale
                definitions={defaultRubricDefinitions.slice(0, 2)}
                currentScores={rubricScores}
                onChangeScore={handleRubricScoreChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FULL ESSAY PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[85vh] p-6 sm:p-8 space-y-5 overflow-y-auto relative">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800">
                Xem trước bài viết hoàn chỉnh
              </span>
              <h3 className="text-xl font-black text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                Tác giả: <span className="font-bold text-slate-700">{currentUser.name}</span> · {wordCount} từ
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100 text-sm sm:text-base leading-relaxed text-slate-800 font-serif whitespace-pre-wrap">
              {content || "(Bài viết chưa có nội dung)"}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Tiếp tục chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIFF COMPARE VERSIONS MODAL */}
      {showDiffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] p-6 sm:p-8 space-y-5 overflow-y-auto relative">
            <button
              onClick={() => setShowDiffModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                So Sánh 2 Phiên Bản Viết
              </h3>
              <p className="text-xs text-slate-500">
                Quan sát các câu chữ được mở rộng và trau chuốt theo thời gian
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phiên bản ban đầu:</label>
                <select
                  value={compareV1}
                  onChange={(e) => setCompareV1(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      Bản {v.versionNumber} ({v.wordCount} từ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phiên bản sau chỉnh sửa:</label>
                <select
                  value={compareV2}
                  onChange={(e) => setCompareV2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  {versions.map((v) => (
                    <option key={v.versionNumber} value={v.versionNumber}>
                      Bản {v.versionNumber} ({v.wordCount} từ)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-700 block border-b border-slate-200 pb-1">
                  Bản {compareV1} ({versions.find((v) => v.versionNumber === compareV1)?.savedAt})
                </span>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                  {versions.find((v) => v.versionNumber === compareV1)?.content || "(Rỗng)"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                <span className="font-bold text-emerald-950 block border-b border-emerald-200 pb-1">
                  Bản {compareV2} ({versions.find((v) => v.versionNumber === compareV2)?.savedAt})
                </span>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-800">
                  {versions.find((v) => v.versionNumber === compareV2)?.content || "(Rỗng)"}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDiffModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Đóng so sánh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
