import React, { useState, useEffect, useRef } from "react";
import { User, Assignment, Submission, Version, RubricScore } from "../types";
import { api } from "../services/api";
import confetti from "canvas-confetti";
import {
  Sparkles,
  BookOpen,
  Send,
  Save,
  CheckCircle2,
  Clock,
  HelpCircle,
  Award,
  Layers,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  Sliders,
  ChevronRight,
  FileCheck,
  History,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Compass,
  PenTool,
  ListChecks,
  Plus,
  Check,
  FileText,
  Download,
} from "lucide-react";
import {
  autoRepairVietnameseText,
  normalizeVietnameseNFC,
  exportToWordDoc,
  exportToTextFile,
} from "../utils/vietnameseFontUtils";

interface WritingCoachViewProps {
  currentUser: User;
  initialAssignment?: Assignment | null;
  initialLevel?: "cau" | "doan" | "bai";
  initialContent?: string;
  onBackToHome?: () => void;
  onOpenScan?: () => void;
  onOpenPrompts?: () => void;
}

export const WritingCoachView: React.FC<WritingCoachViewProps> = ({
  currentUser,
  initialAssignment,
  initialLevel = "doan",
  initialContent = "",
  onBackToHome,
  onOpenScan,
  onOpenPrompts,
}) => {
  // Step workflow: 1: Chọn đề, 2: Ý tưởng, 3: Viết & Nháp, 4: Gợi ý AI, 5: Rubric, 6: So sánh phiên bản, 7: Hoàn thành
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [level, setLevel] = useState<"cau" | "doan" | "bai">(initialAssignment?.level || initialLevel);
  const [title, setTitle] = useState(initialAssignment?.title || "Tả một cây bóng mát trên sân trường");
  const [prompt, setPrompt] = useState(
    initialAssignment?.prompt ||
      "Em hãy quan sát và viết đoạn văn/bài văn miêu tả vẻ đẹp của một cây bóng mát (cây bàng, cây phượng, cây đa...) trên sân trường em."
  );

  const [content, setContent] = useState(initialContent || "");
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);

  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [rubricResult, setRubricResult] = useState<any>(null);
  const [rubricLoading, setRubricLoading] = useState(false);

  const [studentQuestion, setStudentQuestion] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("");

  // Compare versions
  const [compareV1, setCompareV1] = useState<number>(1);
  const [compareV2, setCompareV2] = useState<number>(2);

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<any>(null);

  // AI Active Tool in Editor (brainstorm | sentence | outline | none)
  const [activeAiTool, setActiveAiTool] = useState<"brainstorm" | "sentence" | "outline" | "none">("none");

  // Step 2 Exploration Sub-tab (brainstorm | sentence | outline)
  const [step2Tab, setStep2Tab] = useState<"brainstorm" | "sentence" | "outline">("brainstorm");
  const [sentenceDraft, setSentenceDraft] = useState("");

  // AI Brainstorming state
  const [brainstormData, setBrainstormData] = useState<any>(null);
  const [brainstormLoading, setBrainstormLoading] = useState(false);
  const [brainstormError, setBrainstormError] = useState<string | null>(null);

  // AI Sentence Expansion state
  const [sentenceInput, setSentenceInput] = useState("");
  const [sentenceData, setSentenceData] = useState<any>(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [sentenceError, setSentenceError] = useState<string | null>(null);

  // AI Outline state
  const [outlineData, setOutlineData] = useState<any>(null);
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  // Load existing draft or submission for this student and assignment
  useEffect(() => {
    async function loadExisting() {
      try {
        const { submissions } = await api.getSubmissions({
          studentId: currentUser.id,
          assignmentId: initialAssignment?.id,
        });
        if (submissions && submissions.length > 0) {
          const latest = submissions[0];
          setCurrentSubmissionId(latest.id);
          setContent(latest.currentContent || "");
          setVersions(latest.versions || []);
          setLevel(latest.level);
          setTitle(latest.assignmentTitle);
          if (latest.aiFeedback) setAiFeedback(latest.aiFeedback);
          if (latest.rubricEvaluation) setRubricResult(latest.rubricEvaluation);
        } else if (initialAssignment) {
          setTitle(initialAssignment.title);
          setPrompt(initialAssignment.prompt);
          setLevel(initialAssignment.level);
        }
      } catch (err) {
        console.error("Error loading submission:", err);
      }
    }
    loadExisting();
  }, [currentUser.id, initialAssignment]);

  // Word count & sentence count helper
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceCount = content.split(/[.?!]+/).filter((s) => s.trim().length > 0).length;

  // Auto-save logic every 25 seconds when content changes
  useEffect(() => {
    if (!content.trim()) return;
    setSaveStatus("unsaved");

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      handleSaveDraft(false);
    }, 25000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [content]);

  const handleSaveDraft = async (isNewVersion: boolean = false, notes?: string) => {
    if (!content.trim()) return;
    setSaveStatus("saving");
    try {
      const res = await api.saveDraft({
        submissionId: currentSubmissionId || undefined,
        assignmentId: initialAssignment?.id,
        assignmentTitle: title,
        studentId: currentUser.id,
        studentName: currentUser.name,
        classId: currentUser.classId,
        level,
        content,
        notes: notes || (isNewVersion ? `Phiên bản trau chuốt ${versions.length + 1}` : undefined),
        isNewVersion,
      });

      if (res.submission) {
        setCurrentSubmissionId(res.submission.id);
        setVersions(res.submission.versions || []);
        setSaveStatus("saved");
        setLastSavedTime(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("unsaved");
    }
  };

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showNotice = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Trigger AI Feedback (Socratic, Grade 4 rules)
  const handleGetAiFeedback = async () => {
    if (!content.trim()) {
      showNotice("Em hãy viết một vài câu trước khi nhận phản hồi từ Thầy/Cô Trợ lý nhé!", "info");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.getAiCoachFeedback({
        level,
        promptTopic: `${title}: ${prompt}`,
        currentContent: content,
        studentQuestion: studentQuestion.trim() || undefined,
      });
      setAiFeedback(res.feedback);
      setCurrentStep(4);
      setStudentQuestion("");
      showNotice("Trợ lý EduNova đã gửi phản hồi và câu hỏi gợi mở cho em!", "success");
    } catch (err: any) {
      showNotice("Lỗi khi kết nối với Trợ lý AI: " + (err.message || "Vui lòng thử lại"), "error");
    } finally {
      setAiLoading(false);
    }
  };

  // Trigger AI Rubric Evaluation
  const handleGetRubric = async () => {
    if (!content.trim()) {
      showNotice("Em hãy viết bài trước khi xem bảng tự đánh giá Rubric nhé!", "info");
      return;
    }
    setRubricLoading(true);
    try {
      const res = await api.getAiRubricEvaluation({
        content,
        level,
        title,
        topic: prompt,
      });
      setRubricResult(res.rubric);
      setCurrentStep(5);
      showNotice("Bảng đánh giá Rubric 4 mức đã sẵn sàng!", "success");
    } catch (err: any) {
      showNotice("Lỗi khi đánh giá Rubric: " + (err.message || "Vui lòng thử lại"), "error");
    } finally {
      setRubricLoading(false);
    }
  };

  // AI Brainstorming
  const handleGetBrainstorm = async () => {
    setBrainstormLoading(true);
    setBrainstormError(null);
    try {
      const res = await api.getAiBrainstorm({
        topic: title || prompt || "Bài văn miêu tả",
        level,
        userId: currentUser.id,
      });
      if (res.brainstorm) {
        setBrainstormData(res.brainstorm);
        showNotice("🦉 Cú Vàng đã tìm xong các từ ngữ và ý tưởng gợi mở cho em!", "success");
      }
    } catch (err: any) {
      console.error("Brainstorm error:", err);
      setBrainstormError(err.message || "Chưa thể kết nối với Cú Vàng lúc này. Em có thể thử lại hoặc tự do viết bài nhé!");
    } finally {
      setBrainstormLoading(false);
    }
  };

  // AI Sentence Expansion
  const handleGetSentenceExpansion = async () => {
    if (!sentenceInput.trim()) {
      showNotice("Em hãy gõ một câu văn đơn giản để Cú Vàng hướng dẫn trau chuốt nhé!", "info");
      return;
    }
    setSentenceLoading(true);
    setSentenceError(null);
    try {
      const res = await api.getAiSentenceExpansion({
        originalSentence: sentenceInput.trim(),
        technique: "all",
        userId: currentUser.id,
      });
      if (res.expansion) {
        setSentenceData(res.expansion);
        showNotice("✨ Cú Vàng đã gợi ý các hướng nâng cấp câu văn cho em!", "success");
      }
    } catch (err: any) {
      console.error("Sentence expansion error:", err);
      setSentenceError(err.message || "Chưa thể gợi ý câu lúc này. Em có thể thử lại hoặc tự sáng tạo theo ý mình!");
    } finally {
      setSentenceLoading(false);
    }
  };

  // AI Outline
  const handleGetOutline = async () => {
    setOutlineLoading(true);
    setOutlineError(null);
    try {
      const res = await api.getAiOutline({
        topic: title || prompt || "Bài văn miêu tả",
        level,
        userId: currentUser.id,
      });
      if (res.outline) {
        setOutlineData(res.outline);
        showNotice("📋 Đã có khung dàn ý 3 phần chuẩn lớp 4 cho em tham khảo!", "success");
      }
    } catch (err: any) {
      console.error("Outline error:", err);
      setOutlineError(err.message || "Chưa thể tạo dàn ý lúc này. Em hãy tự chia 3 phần: Mở bài, Thân bài, Kết bài nhé!");
    } finally {
      setOutlineLoading(false);
    }
  };

  // Chèn từ hoặc gợi ý vào bài viết
  const insertWordPill = (word: string) => {
    setContent((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return word;
      return trimmed + " " + word;
    });
    showNotice(`✨ Đã thêm từ: "${word}" vào bài viết!`, "success");
  };

  // Đưa câu đã rèn giũa vào bài viết
  const insertSentenceDraft = (sent: string) => {
    if (!sent.trim()) return;
    setContent((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return sent.trim();
      return trimmed + " " + sent.trim();
    });
    setSentenceDraft("");
    showNotice(`✨ Đã đưa câu văn của em vào bài viết!`, "success");
  };

  // Chèn khung dàn ý 3 phần chuẩn vào bài viết (học sinh tự điền nội dung)
  const insertOutlineScaffold = () => {
    const scaffold =
      level === "cau"
        ? `[Câu văn có hình ảnh]: (Em hãy tự viết câu văn của mình, vận dụng từ gợi cảm hoặc hình ảnh so sánh...)`
        : level === "doan"
        ? `[Mở đoạn]: (Giới thiệu sự vật em định miêu tả...)
[Thân đoạn]:
- Tả nét nổi bật nhất: (...)
- Vận dụng 1 hình ảnh so sánh hoặc nhân hóa: (...)
[Kết đoạn]: (Bày tỏ cảm xúc hoặc tình cảm của em...)`
        : `[Mở bài]:
(Giới thiệu sự vật định miêu tả - em có thể mở bài trực tiếp hoặc gián tiếp)

[Thân bài]:
- Tả bao quát: (Hình dáng, kích thước, màu sắc khi nhìn từ xa...)
- Tả chi tiết: (2-3 nét đặc sắc nhất: lá, hoa, thân hoặc mắt, tai, lông...)
- Kỷ niệm / Hoạt động gắn bó: (Những lần cùng vui chơi, ngắm nhìn...)

[Kết bài]:
(Tình cảm yêu quý và ước mong hoặc lời hứa chăm sóc, giữ gìn sự vật)`;

    setContent((prev) => {
      if (!prev.trim()) return scaffold;
      return prev + "\n\n" + scaffold;
    });
    showNotice(`📋 Đã chèn khung dàn ý 3 phần vào bài viết! Em hãy tự điền ý vào từng phần nhé.`, "success");
  };

  // Submit Final to Teacher
  const handleSubmitAssignment = async () => {
    if (!currentSubmissionId) {
      await handleSaveDraft(true, "Bản hoàn chỉnh nộp bài");
    }
    try {
      if (currentSubmissionId) {
        await api.submitAssignment(currentSubmissionId, currentUser.id);
      }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setCurrentStep(7);
      showNotice("Chúc mừng em đã nộp bài thành công!", "success");
    } catch (err: any) {
      showNotice("Lỗi nộp bài: " + (err.message || "Vui lòng thử lại"), "error");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-sm animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : notification.type === "error"
              ? "bg-rose-50 text-rose-900 border-rose-200"
              : "bg-blue-50 text-blue-900 border-blue-200"
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Top Workflow Stepper (7 Bước Sư phạm) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Studio Luyện Viết EduNova
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Quy trình sư phạm 7 bước • Học sinh tự viết & AI gợi mở
              </p>
            </div>
          </div>

          {/* Quick Level Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setLevel("cau")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === "cau" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌱 Cấp 1: Luyện câu
            </button>
            <button
              onClick={() => setLevel("doan")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === "doan" ? "bg-white text-orange-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌿 Cấp 2: Luyện đoạn
            </button>
            <button
              onClick={() => setLevel("bai")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                level === "bai" ? "bg-white text-blue-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌳 Cấp 3: Luyện bài
            </button>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4">
          {[
            { step: 1, label: "1. Chọn đề bài" },
            { step: 2, label: "2. Khám phá ý" },
            { step: 3, label: "3. Tự viết bài" },
            { step: 4, label: "4. Nhận phản hồi" },
            { step: 5, label: "5. Xem Rubric" },
            { step: 6, label: "6. So sánh bản" },
            { step: 7, label: "7. Hoàn thành" },
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isPassed = currentStep > item.step;
            return (
              <button
                key={item.step}
                onClick={() => setCurrentStep(item.step)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : isPassed
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor & Main Task (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Đề bài & Hướng dẫn */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                Nhiệm vụ {level === "cau" ? "Luyện câu" : level === "doan" ? "Luyện đoạn văn" : "Luyện bài văn"}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {saveStatus === "saving" ? (
                    <span className="text-amber-600 font-bold">Đang lưu...</span>
                  ) : saveStatus === "saved" ? (
                    <span className="text-emerald-600">Đã lưu nháp {lastSavedTime}</span>
                  ) : (
                    <span>Chưa lưu</span>
                  )}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              💡 <span className="font-bold">Yêu cầu:</span> {prompt}
            </p>
          </div>

          {/* STEP 1: Chọn đề & Chủ đề */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-slate-900">Bước 1: Chọn hoặc chỉnh sửa đề bài</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên đề bài:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gợi ý / Yêu cầu chi tiết:</label>
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-500">Đề bài gợi ý chuẩn Lớp 4:</p>
                  {onOpenPrompts && (
                    <button
                      onClick={onOpenPrompts}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Xem toàn bộ Kho đề lớp 4 (KNTT)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { t: "Tả cây bàng thân thương trên sân trường em", l: "bai" },
                    { t: "Tả cây phượng vĩ nở hoa trên sân trường", l: "bai" },
                    { t: "Viết đoạn văn mở đầu giới thiệu chú cún con", l: "doan" },
                    { t: "Nêu tình cảm, cảm xúc đối với người mẹ kính yêu", l: "doan" },
                    { t: "Mở rộng câu văn có hình ảnh so sánh dòng sông quê", l: "cau" },
                    { t: "Hướng dẫn các bước gấp một món đồ chơi bằng giấy", l: "doan" },
                  ].map((rec, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setTitle(rec.t);
                        setLevel(rec.l as any);
                        setPrompt(`Em hãy viết bài văn/đoạn văn miêu tả sinh động về ${rec.t.toLowerCase()}.`);
                      }}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left text-xs font-bold text-slate-700 transition-colors"
                    >
                      {rec.t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                {onOpenPrompts ? (
                  <button
                    onClick={onOpenPrompts}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>Mở Kho đề đầy đủ</span>
                  </button>
                ) : <div />}
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
                >
                  Tiếp theo: Khám phá ý tưởng <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Khám phá ý tưởng (Brainstorming, Luyện câu & Lập dàn ý) */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
              {/* Header & Sub-tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-black">Bước 2: Khám phá ý tưởng & Rèn luyện kỹ năng</h3>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setStep2Tab("brainstorm")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      step2Tab === "brainstorm" ? "bg-white text-amber-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    💡 5 Giác quan
                  </button>
                  <button
                    onClick={() => setStep2Tab("sentence")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      step2Tab === "sentence" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ✍️ Luyện câu có hình ảnh
                  </button>
                  <button
                    onClick={() => {
                      setStep2Tab("outline");
                      if (!outlineData) handleGetOutline();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      step2Tab === "outline" ? "bg-white text-blue-800 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    📋 Dàn ý 3 phần
                  </button>
                </div>
              </div>

              {/* TAB 1: 5 GIÁC QUAN (BRAINSTORMING) */}
              {step2Tab === "brainstorm" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-600 font-semibold max-w-xl">
                      Cùng Cú Vàng thu thập từ ngữ gợi tả màu sắc, âm thanh, xúc giác và tình cảm để bài viết của em thêm sống động nhé!
                    </p>
                    <button
                      onClick={handleGetBrainstorm}
                      disabled={brainstormLoading}
                      className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {brainstormLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {brainstormLoading ? "Cú Vàng đang tìm ý..." : "🦉 Nhờ Cú Vàng Tìm Ý"}
                    </button>
                  </div>

                  {/* Loading State */}
                  {brainstormLoading && (
                    <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-2xl animate-bounce">
                        🦉
                      </div>
                      <p className="text-xs font-bold text-amber-900">
                        Thầy/Cô Cú Vàng đang ngắm nhìn và lắng nghe để tìm các từ ngữ hay cho đề bài "{title}"...
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {brainstormError && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                      <span>⚠️ {brainstormError}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGetBrainstorm}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                        >
                          Thử lại
                        </button>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs"
                        >
                          Em tự viết tiếp
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Sensory Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Mắt thấy */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                      <h4 className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
                        👀 {brainstormData?.senses?.sight?.title || "Mắt thấy (Hình dáng & Màu sắc)"}
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        {brainstormData?.senses?.sight?.question || "Sự vật có màu gì? To lớn như thế nào? (xanh mướt, đỏ rực, nâu xám, cao vút, xù xì, tròn xoe...)"}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(brainstormData?.senses?.sight?.wordPills || ["xanh mướt", "đỏ rực", "xòe rộng", "cao vút", "nâu xù xì"]).map((pill: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => insertWordPill(pill)}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold border border-amber-300 flex items-center gap-1 transition-all"
                            title="Bấm để thêm vào bài viết"
                          >
                            <Plus className="w-3 h-3 text-amber-700" /> {pill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Tai nghe */}
                    <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                      <h4 className="text-xs font-black text-teal-900 uppercase flex items-center gap-1.5">
                        👂 {brainstormData?.senses?.sound?.title || "Tai nghe & Âm thanh"}
                      </h4>
                      <p className="text-xs text-teal-800 leading-relaxed">
                        {brainstormData?.senses?.sound?.question || "Có âm thanh gì xung quanh sự vật? (lá xào xạc, tiếng ve râm ran, tiếng thở nhè nhẹ, róc rách...)"}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(brainstormData?.senses?.sound?.wordPills || ["xào xạc trong gió", "thì thầm", "râm ran", "róc rách"]).map((pill: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => insertWordPill(pill)}
                            className="px-2.5 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-900 text-[11px] font-bold border border-teal-300 flex items-center gap-1 transition-all"
                            title="Bấm để thêm vào bài viết"
                          >
                            <Plus className="w-3 h-3 text-teal-700" /> {pill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Chạm & Mùi hương */}
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                      <h4 className="text-xs font-black text-purple-900 uppercase flex items-center gap-1.5">
                        🌸 {brainstormData?.senses?.touchSmell?.title || "Chạm & Mùi hương (Xúc giác & Khứu giác)"}
                      </h4>
                      <p className="text-xs text-purple-800 leading-relaxed">
                        {brainstormData?.senses?.touchSmell?.question || "Khi chạm tay vào có cảm giác gì? Mùi hương thoang thoảng ra sao?"}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(brainstormData?.senses?.touchSmell?.wordPills || ["mềm mại như nhung", "thô ráp", "mát rượi", "thoang thoảng dịu nhẹ"]).map((pill: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => insertWordPill(pill)}
                            className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-bold border border-purple-300 flex items-center gap-1 transition-all"
                            title="Bấm để thêm vào bài viết"
                          >
                            <Plus className="w-3 h-3 text-purple-700" /> {pill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Trái tim cảm nhận */}
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                      <h4 className="text-xs font-black text-rose-900 uppercase flex items-center gap-1.5">
                        ❤️ {brainstormData?.senses?.heart?.title || "Trái tim cảm nhận & Kỷ niệm"}
                      </h4>
                      <p className="text-xs text-rose-800 leading-relaxed">
                        {brainstormData?.senses?.heart?.question || "Em cảm thấy thế nào khi gắn bó với sự vật đó? (yêu quý như bạn thân, nâng niu, tự hào...)"}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(brainstormData?.senses?.heart?.wordPills || ["yêu quý như bạn thân", "gắn bó thân thiết", "nâng niu", "kỷ niệm tuổi thơ"]).map((pill: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => insertWordPill(pill)}
                            className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 text-[11px] font-bold border border-rose-300 flex items-center gap-1 transition-all"
                            title="Bấm để thêm vào bài viết"
                          >
                            <Plus className="w-3 h-3 text-rose-700" /> {pill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comparison Starters */}
                  {brainstormData?.comparisonStarters && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                        ✨ Gợi ý hình ảnh so sánh độc đáo của Cú Vàng:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {brainstormData.comparisonStarters.map((starter: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => insertWordPill(starter)}
                            className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100 flex items-center gap-1"
                          >
                            + "{starter}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LUYỆN VIẾT CÂU CÓ HÌNH ẢNH */}
              {step2Tab === "sentence" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✍️</span>
                      <div>
                        <h4 className="text-sm font-black text-emerald-950 uppercase">
                          Thợ Rèn Câu Văn (Nâng cấp câu đơn thành câu có hình ảnh)
                        </h4>
                        <p className="text-xs text-emerald-800 font-medium">
                          Nhập 1 câu mộc mạc của em hoặc chọn câu mẫu dưới đây để Cú Vàng hướng dẫn trau chuốt nhé:
                        </p>
                      </div>
                    </div>

                    {/* Preset sample sentences */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 self-center">Câu mẫu thử nghiệm:</span>
                      {[
                        "Dòng sông chảy qua làng.",
                        "Cây phượng nở hoa đỏ rực.",
                        "Chú mèo nằm sưởi nắng trên sân.",
                        "Mặt trời mọc vào buổi sớm.",
                      ].map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSentenceInput(preset);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-900 text-xs font-semibold hover:bg-emerald-100"
                        >
                          "{preset}"
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={sentenceInput}
                        onChange={(e) => setSentenceInput(e.target.value)}
                        placeholder="Nhập 1 câu văn của em (ví dụ: Cây bàng đứng sừng sững ở góc sân trường.)"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-semibold focus:outline-emerald-600"
                      />
                      <button
                        onClick={handleGetSentenceExpansion}
                        disabled={sentenceLoading || !sentenceInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                      >
                        {sentenceLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                        {sentenceLoading ? "Đang gợi mở..." : "Gợi Mở Hướng Viết"}
                      </button>
                    </div>

                    {sentenceError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                        <span>⚠️ {sentenceError}</span>
                        <button
                          onClick={handleGetSentenceExpansion}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px]"
                        >
                          Thử lại
                        </button>
                      </div>
                    )}

                    {sentenceLoading && (
                      <p className="text-xs text-emerald-800 font-bold py-1 flex items-center gap-2">
                        <span className="animate-spin text-base">🦉</span>
                        <span>Cú Vàng đang tìm hình ảnh tương đồng và từ láy gợi cảm cho câu của em...</span>
                      </p>
                    )}

                    {sentenceData && (
                      <div className="space-y-3 pt-3 border-t border-emerald-200">
                        <p className="text-xs font-bold text-emerald-950 bg-white p-3 rounded-xl border border-emerald-200">
                          💡 {sentenceData.coachQuestion}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {sentenceData.options?.map((opt: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-2xl bg-white border border-emerald-200 space-y-2 text-xs">
                              <span className="font-black text-emerald-900 block">{opt.label}</span>
                              <p className="text-[11px] text-slate-600 leading-normal">{opt.hint}</p>
                              <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                                Mẫu: {opt.samplePattern}
                              </p>
                              <button
                                onClick={() => insertWordPill(opt.samplePattern)}
                                className="w-full py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] text-center"
                              >
                                Đưa mẫu vào bài để tự sửa
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Sentence Sandbox */}
                        <div className="p-3.5 bg-emerald-100/70 rounded-2xl border border-emerald-300 space-y-2">
                          <label className="block text-xs font-black text-emerald-950 uppercase">
                            ✍️ Gõ thử câu văn mới của em sau khi trau chuốt:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={sentenceDraft}
                              onChange={(e) => setSentenceDraft(e.target.value)}
                              placeholder="Em hãy viết lại câu hoàn chỉnh của mình tại đây..."
                              className="flex-1 px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-semibold focus:outline-emerald-600"
                            />
                            <button
                              onClick={() => insertSentenceDraft(sentenceDraft)}
                              disabled={!sentenceDraft.trim()}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Chèn vào bài
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DÀN Ý 3 PHẦN DẪN ĐƯỜNG */}
              {step2Tab === "outline" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <div>
                      <h4 className="text-sm font-black text-blue-950 uppercase">
                        Khung Dàn Ý 3 Phần Gợi Mở (Chuẩn GDPT Tiếng Việt 4)
                      </h4>
                      <p className="text-xs text-blue-800">
                        Chiếc la bàn dẫn đường giúp bài viết của em mạch lạc, đủ ý từ mở đầu đến kết thúc.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGetOutline}
                        disabled={outlineLoading}
                        className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${outlineLoading ? "animate-spin" : ""}`} /> Tải lại
                      </button>
                      <button
                        onClick={insertOutlineScaffold}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                      >
                        📋 Chèn khung vào bài viết
                      </button>
                    </div>
                  </div>

                  {outlineLoading ? (
                    <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-blue-400 text-blue-950 flex items-center justify-center text-2xl animate-bounce">
                        🦉
                      </div>
                      <p className="text-xs font-bold text-blue-900">
                        Thầy/Cô Cú Vàng đang sắp xếp dàn ý 3 phần chuẩn Tiếng Việt 4 cho em...
                      </p>
                    </div>
                  ) : outlineError ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                      <span>⚠️ {outlineError}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGetOutline}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                        >
                          Thử lại
                        </button>
                        <button
                          onClick={insertOutlineScaffold}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                        >
                          Dùng khung mẫu chuẩn
                        </button>
                      </div>
                    </div>
                  ) : outlineData ? (
                    <div className="space-y-4">
                      <p className="text-xs text-blue-900 font-semibold italic bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                        🧭 Lời khuyên: {outlineData.pedagogicalTip}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {outlineData.sections?.map((sec: any, i: number) => (
                          <div key={i} className="p-4 rounded-2xl bg-white border border-blue-200 space-y-3 text-xs shadow-2xs">
                            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                              <span className="font-black text-blue-950 text-sm">{sec.name}</span>
                              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md">{sec.target}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 leading-snug">
                              ❓ {sec.guidingQuestion}
                            </p>
                            <div className="space-y-1.5 text-xs text-slate-600">
                              {sec.checkpoints?.map((chk: string, cIdx: number) => (
                                <div key={cIdx} className="flex items-start gap-1.5">
                                  <span className="text-blue-500 font-bold">•</span>
                                  <span>{chk}</span>
                                </div>
                              ))}
                            </div>
                            {sec.suggestedConnectors && (
                              <div className="pt-2 border-t border-slate-100">
                                <span className="text-[10px] font-bold text-slate-500 block mb-1">Từ nối gợi ý:</span>
                                <div className="flex flex-wrap gap-1">
                                  {sec.suggestedConnectors.map((conn: string, connIdx: number) => (
                                    <button
                                      key={connIdx}
                                      onClick={() => insertWordPill(conn)}
                                      className="px-2 py-1 rounded bg-blue-50 text-[10px] font-bold text-blue-800 hover:bg-blue-100 border border-blue-100"
                                    >
                                      + {conn}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại chọn đề
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  Bắt đầu viết bài ngay (Bước 3) <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Tự Viết & Lưu Phiên Bản */}
          {(currentStep === 3 || currentStep === 4 || currentStep === 5 || currentStep === 6) && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
              {/* Header Editor */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">Khung Viết Bài Của Em</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {wordCount} từ • {sentenceCount} câu
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      if (!content.trim()) {
                        showNotice("Em hãy viết bài trước khi tải về máy nhé!", "info");
                        return;
                      }
                      exportToWordDoc({
                        title: title || "Bài làm Tiếng Việt 4",
                        author: currentUser.name,
                        content,
                        genreLabel: level === "cau" ? "Luyện câu" : level === "doan" ? "Luyện đoạn văn" : "Bài văn hoàn chỉnh",
                        rubricEvaluation: rubricResult ? {
                          overallScore: rubricResult.overallScore,
                          overallLevel: rubricResult.overallLevel,
                          overallComment: rubricResult.overallComment,
                        } : undefined,
                      });
                      showNotice("Đã tải bài viết về máy định dạng Word (.doc chuẩn UTF-8)!", "success");
                    }}
                    className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Tải bài viết về máy tệp Word chuẩn font tiếng Việt"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" /> Tải Word (.doc)
                  </button>

                  <button
                    onClick={() => handleSaveDraft(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" /> Lưu nháp
                  </button>
                  <button
                    onClick={() => {
                      handleSaveDraft(true, `Phiên bản trau chuốt ${versions.length + 1}`);
                      showNotice(`Đã lưu Phiên bản ${versions.length + 1} thành công!`, "success");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-600" /> Lưu thành Bản mới
                  </button>
                </div>
              </div>

              {/* AI Helper Tools Toolbar (Giai đoạn 4 - Lượt 3) */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (activeAiTool !== "brainstorm" && !brainstormData) handleGetBrainstorm();
                        setActiveAiTool(activeAiTool === "brainstorm" ? "none" : "brainstorm");
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeAiTool === "brainstorm"
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      💡 AI Tìm Ý (5 Giác quan)
                    </button>

                    <button
                      onClick={() => setActiveAiTool(activeAiTool === "sentence" ? "none" : "sentence")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeAiTool === "sentence"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                      ✨ AI Luyện Câu Có Hình Ảnh
                    </button>

                    <button
                      onClick={() => {
                        if (activeAiTool !== "outline" && !outlineData) handleGetOutline();
                        setActiveAiTool(activeAiTool === "outline" ? "none" : "outline");
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeAiTool === "outline"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <ListChecks className="w-3.5 h-3.5 text-blue-600" />
                      📋 AI Lập Dàn Ý 3 Phần
                    </button>

                    {onOpenScan && (
                      <button
                        onClick={onOpenScan}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200"
                        title="Tải bài viết từ tệp Word (.docx) hoặc ảnh chụp để trích xuất và chấm Rubric"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-600" />
                        📥 Tải DOCX / Ảnh
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (!content.trim()) return;
                        const repaired = autoRepairVietnameseText(content);
                        setContent(repaired);
                        showNotice("✅ Đã kiểm tra và chuẩn hóa font tiếng Việt Unicode NFC!", "success");
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300"
                      title="Sửa lỗi font tiếng Việt khi dán từ tệp Word cũ hoặc bộ gõ bị lỗi dấu"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Sửa lỗi font
                    </button>

                    <button
                      onClick={() => {
                        if (!content.trim()) {
                          showNotice("Em hãy viết bài trước khi tải về nhé!", "info");
                          return;
                        }
                        exportToWordDoc({
                          title: title || "Bài làm học sinh",
                          author: currentUser.name,
                          grade: "Lớp 4",
                          school: currentUser.schoolName || "Trường Tiểu học Chu Văn An",
                          content: content,
                          genreLabel: "Tập làm văn lớp 4",
                          rubricEvaluation: rubricResult
                            ? {
                                overallScore: rubricResult.overallScore,
                                overallLevel: rubricResult.overallLevel,
                                overallComment: rubricResult.overallComment,
                                teacherApprovedBy: rubricResult.confirmedByTeacher ? "Giáo viên" : undefined,
                                teacherOfficialComment: rubricResult.teacherNotes,
                              }
                            : undefined,
                          fileName: `Bai_Viet_${currentUser.name}_${title || "Lop4"}`,
                        });
                        showNotice("Đã tải bài viết dạng tệp Word (.doc chuẩn font tiếng Việt)!", "success");
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                      title="Tải bài viết về máy dạng tệp Word (.doc) chuẩn tiếng Việt không bao giờ lỗi font"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      Tải Word (.doc)
                    </button>

                    <button
                      onClick={() => {
                        if (!content.trim()) {
                          showNotice("Em hãy viết bài trước khi tải về nhé!", "info");
                          return;
                        }
                        exportToTextFile({
                          title: title || "Bài làm học sinh",
                          author: currentUser.name,
                          content: content,
                          notes: rubricResult?.overallComment || aiFeedback?.pedagogicalNote,
                          fileName: `Bai_Viet_${currentUser.name}_${title || "Lop4"}`,
                        });
                        showNotice("Đã tải bài viết dạng tệp Text (.txt chuẩn UTF-8)!", "success");
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                      title="Tải bài viết dạng văn bản Text UTF-8"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      Tải Text (.txt)
                    </button>
                  </div>

                  {activeAiTool !== "none" && (
                    <button
                      onClick={() => setActiveAiTool("none")}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-700 px-2 py-1"
                    >
                      Đóng công cụ ✕
                    </button>
                  )}
                </div>

                {/* TOOL 1: AI Tìm Ý Panel */}
                {activeAiTool === "brainstorm" && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🦉</span>
                        <h4 className="text-xs font-black text-amber-950 uppercase">
                          Ngân hàng từ ngữ giác quan cho đề bài "{title}"
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGetBrainstorm}
                          disabled={brainstormLoading}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${brainstormLoading ? "animate-spin" : ""}`} /> Thử lại
                        </button>
                        <button
                          onClick={() => setActiveAiTool("none")}
                          className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-amber-900"
                        >
                          Em tự viết tiếp
                        </button>
                      </div>
                    </div>

                    {brainstormLoading ? (
                      <p className="text-xs text-amber-800 font-bold py-2">🦉 Cú Vàng đang tìm thêm từ ngữ hay...</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-amber-800">
                          Nhấp vào từ gợi ý bất kỳ để thêm vào vị trí của bài viết:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(brainstormData?.senses?.sight?.wordPills || ["xanh mướt", "đỏ rực", "mềm mại", "xào xạc", "thoang thoảng", "như chiếc ô"]).concat(
                            brainstormData?.senses?.sound?.wordPills || []
                          ).concat(brainstormData?.senses?.touchSmell?.wordPills || []).map((w: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => insertWordPill(w)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-300 shadow-2xs flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3 text-amber-600" /> {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL 2: AI Luyện Câu Có Hình Ảnh Panel */}
                {activeAiTool === "sentence" && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✍️</span>
                        <h4 className="text-xs font-black text-emerald-950 uppercase">
                          Thợ Rèn Câu Văn (Luyện viết câu có hình ảnh so sánh & nhân hóa)
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveAiTool("none")}
                        className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-[11px] font-bold text-emerald-800"
                      >
                        Đóng
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sentenceInput}
                        onChange={(e) => setSentenceInput(e.target.value)}
                        placeholder="Nhập 1 câu đơn giản của em (Ví dụ: Dòng sông chảy qua làng.)"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-medium focus:outline-emerald-600"
                      />
                      <button
                        onClick={handleGetSentenceExpansion}
                        disabled={sentenceLoading || !sentenceInput.trim()}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {sentenceLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                        Gợi mở
                      </button>
                    </div>

                    {sentenceError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>⚠️ {sentenceError}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={handleGetSentenceExpansion}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700"
                            >
                              Thử lại
                            </button>
                            <button
                              onClick={() => setActiveAiTool("none")}
                              className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-[11px] font-bold text-rose-800"
                            >
                              Em tự viết tiếp
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 font-semibold">
                          💡 Mẹo nhanh: Em hãy dùng từ "như" hoặc "tựa như" để so sánh sự vật với một hình ảnh thân quen, hoặc gọi sự vật là "bác", "chú" nhé!
                        </p>
                      </div>
                    )}

                    {sentenceLoading && (
                      <p className="text-xs text-emerald-800 font-bold py-1 flex items-center gap-2">
                        <span className="animate-spin text-base">🦉</span>
                        <span>Cú Vàng đang tìm hình ảnh tương đồng và từ láy gợi cảm cho câu của em...</span>
                      </p>
                    )}

                    {sentenceData && (
                      <div className="space-y-3 pt-2 border-t border-emerald-200">
                        <p className="text-xs font-bold text-emerald-950">
                          💡 {sentenceData.coachQuestion}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {sentenceData.options?.map((opt: any, i: number) => (
                            <div key={i} className="p-3 rounded-xl bg-white border border-emerald-200 space-y-1.5 text-xs">
                              <span className="font-black text-emerald-900 block">{opt.label}</span>
                              <p className="text-[11px] text-slate-600 leading-normal">{opt.hint}</p>
                              <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                                Mẫu: {opt.samplePattern}
                              </p>
                              <button
                                onClick={() => {
                                  insertWordPill(opt.samplePattern);
                                }}
                                className="w-full mt-1 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] text-center"
                              >
                                Đưa mẫu vào bài để tự sửa
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Sentence Sandbox / Scratchpad */}
                        <div className="p-3 bg-emerald-100/60 rounded-2xl border border-emerald-300 space-y-2">
                          <label className="block text-[11px] font-black text-emerald-950 uppercase">
                            ✍️ Gõ thử câu của em sau khi trau chuốt:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={sentenceDraft}
                              onChange={(e) => setSentenceDraft(e.target.value)}
                              placeholder="Ví dụ: Mỗi sáng đến trường, bác phượng già như chiếc ô khổng lồ xòe bóng mát đón chào em."
                              className="flex-1 px-3 py-1.5 rounded-xl border border-emerald-300 bg-white text-xs focus:outline-emerald-600"
                            />
                            <button
                              onClick={() => insertSentenceDraft(sentenceDraft)}
                              disabled={!sentenceDraft.trim()}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Chèn vào bài
                            </button>
                          </div>
                        </div>

                        {sentenceData.vocabularyPills && sentenceData.vocabularyPills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] font-bold text-emerald-900 self-center">Từ gợi ý:</span>
                            {sentenceData.vocabularyPills.map((pill: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => insertWordPill(pill)}
                                className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold border border-emerald-200"
                              >
                                + {pill}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TOOL 3: AI Lập Dàn Ý 3 Phần Panel */}
                {activeAiTool === "outline" && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-300 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📋</span>
                        <h4 className="text-xs font-black text-blue-950 uppercase">
                          Khung Dàn Ý 3 Phần Gợi Mở (Chuẩn GDPT Tiếng Việt 4)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGetOutline}
                          disabled={outlineLoading}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${outlineLoading ? "animate-spin" : ""}`} /> Tải lại dàn ý
                        </button>
                        <button
                          onClick={insertOutlineScaffold}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                          title="Chèn khung sườn 3 phần vào khung viết bài của em"
                        >
                          📋 Chèn khung vào bài
                        </button>
                        <button
                          onClick={() => setActiveAiTool("none")}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-300 text-[11px] font-bold text-blue-900"
                        >
                          Đóng
                        </button>
                      </div>
                    </div>

                    {outlineLoading ? (
                      <p className="text-xs text-blue-800 font-bold py-2 flex items-center gap-2">
                        <span className="animate-spin text-base">🦉</span>
                        <span>Cú Vàng đang sắp xếp dàn ý 3 phần cho em...</span>
                      </p>
                    ) : outlineError ? (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>⚠️ {outlineError}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={handleGetOutline}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700"
                            >
                              Thử lại
                            </button>
                            <button
                              onClick={insertOutlineScaffold}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px]"
                            >
                              Dùng khung mẫu chuẩn
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : outlineData ? (
                      <div className="space-y-3 pt-1">
                        <p className="text-xs text-blue-900 font-medium italic">
                          🧭 {outlineData.pedagogicalTip}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {outlineData.sections?.map((sec: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-2xl bg-white border border-blue-200 space-y-2 text-xs">
                              <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
                                <span className="font-black text-blue-950">{sec.name}</span>
                                <span className="text-[10px] text-blue-700 font-semibold">{sec.target}</span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-800 leading-snug">
                                ❓ {sec.guidingQuestion}
                              </p>
                              <div className="space-y-1 text-[11px] text-slate-600">
                                {sec.checkpoints?.map((chk: string, cIdx: number) => (
                                  <div key={cIdx} className="flex items-start gap-1">
                                    <span className="text-blue-500">•</span>
                                    <span>{chk}</span>
                                  </div>
                                ))}
                              </div>
                              {sec.suggestedConnectors && (
                                <div className="pt-1.5 border-t border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-500 block mb-1">Từ nối gợi ý:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {sec.suggestedConnectors.map((conn: string, connIdx: number) => (
                                      <button
                                        key={connIdx}
                                        onClick={() => insertWordPill(conn)}
                                        className="px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-800 hover:bg-blue-100 border border-blue-100"
                                      >
                                        + {conn}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Main Textarea */}
              <div className="relative">
                <textarea
                  rows={level === "cau" ? 4 : level === "doan" ? 7 : 14}
                  value={content}
                  onChange={(e) => setContent(normalizeVietnameseNFC(e.target.value))}
                  onPaste={() => {
                    setTimeout(() => {
                      setContent((prev) => autoRepairVietnameseText(prev));
                    }, 50);
                  }}
                  placeholder={
                    level === "cau"
                      ? "Em hãy gõ câu văn của mình tại đây (hãy dùng từ ngữ gợi tả và hình ảnh so sánh nhé)..."
                      : level === "doan"
                      ? "Em hãy viết đoạn văn tại đây (gồm câu mở đoạn, các câu phát triển ý và câu kết đoạn)..."
                      : "Em hãy viết bài văn hoàn chỉnh tại đây (Mở bài -> Thân bài -> Kết bài)..."
                  }
                  className="w-full p-4 sm:p-5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-hidden text-base sm:text-lg leading-relaxed font-sans vietnamese-essay-text text-slate-800 transition-all resize-y shadow-inner"
                />
              </div>


              {/* Action Buttons below Editor */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGetAiFeedback}
                    disabled={aiLoading}
                    className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    )}
                    {aiLoading ? "Trợ lý AI đang đọc bài..." : "Nhận Gợi Mở Từ Trợ Lý AI"}
                  </button>

                  <button
                    onClick={handleGetRubric}
                    disabled={rubricLoading}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {rubricLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Award className="w-4 h-4" />
                    )}
                    Xem Bảng Rubric 4 Mức
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {versions.length > 1 && (
                    <button
                      onClick={() => setCurrentStep(6)}
                      className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5"
                    >
                      <History className="w-4 h-4 text-slate-500" /> So sánh 2 bản ({versions.length})
                    </button>
                  )}

                  <button
                    onClick={handleSubmitAssignment}
                    className="px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" /> Nộp Bài Cho Cô
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Nhận Phản Hồi AI (AI Feedback Card) */}
          {aiFeedback && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-200 shadow-md space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xl shadow-xs">
                    🦉
                  </div>
                  <div>
                    <h3 className="text-base font-black text-emerald-950">
                      Góp Ý Từ Trợ Lý EduNova
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">
                      {aiFeedback.pedagogicalNote || "Gợi mở sư phạm • Học sinh làm chủ bài viết"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  Socratic AI
                </span>
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Điểm mạnh cô rất khen ngợi:
                </h4>
                <div className="space-y-1.5">
                  {aiFeedback.strengths?.map((str: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-900 font-medium border border-emerald-100">
                      ✨ {str}
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-orange-800 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  1 – 2 Điểm em có thể trau chuốt thêm:
                </h4>
                <div className="space-y-1.5">
                  {aiFeedback.improvements?.map((imp: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-orange-50 text-xs text-orange-950 font-medium border border-orange-200">
                      📝 {imp}
                    </div>
                  ))}
                </div>
              </div>

              {/* Socratic Questions */}
              {aiFeedback.socraticQuestions && aiFeedback.socraticQuestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-blue-800 uppercase flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    Câu hỏi gợi mở trí tưởng tượng cho em:
                  </h4>
                  <div className="space-y-1.5">
                    {aiFeedback.socraticQuestions.map((q: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-blue-50 text-xs text-blue-950 font-medium border border-blue-200">
                        ❓ {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Question Box */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Em muốn hỏi thêm Trợ lý EduNova điều gì không?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studentQuestion}
                    onChange={(e) => setStudentQuestion(e.target.value)}
                    placeholder="Ví dụ: Em muốn thêm một câu so sánh về tán cây thì làm sao ạ?"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                  />
                  <button
                    onClick={handleGetAiFeedback}
                    disabled={aiLoading || !studentQuestion.trim()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    Hỏi Trợ lý <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Rubric 4 Mức Đánh Giá */}
          {rubricResult && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-200 shadow-md space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Bảng Tự Đánh Giá Theo Rubric 4 Mức
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mức đạt được: <span className="font-bold text-amber-600">Mức {rubricResult.overallLevel}</span> • Điểm trung bình: <span className="font-black text-emerald-600">{rubricResult.overallScore}/5.0</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                  {rubricResult.overallLevel === 4
                    ? "Mức 4: Vận dụng tốt"
                    : rubricResult.overallLevel === 3
                    ? "Mức 3: Đạt yêu cầu"
                    : rubricResult.overallLevel === 2
                    ? "Mức 2: Đang hình thành"
                    : "Mức 1: Cần hỗ trợ"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 font-medium">
                💬 <span className="font-bold">Nhận xét tổng quan:</span> {rubricResult.overallComment}
              </div>

              {/* Criteria List */}
              <div className="space-y-3">
                {rubricResult.scores?.map((sc: RubricScore) => (
                  <div
                    key={sc.criterionId}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{sc.name}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          sc.level === 4
                            ? "bg-emerald-100 text-emerald-800"
                            : sc.level === 3
                            ? "bg-blue-100 text-blue-800"
                            : sc.level === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        Mức {sc.level} ({sc.score}đ)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{sc.comment}</p>
                    {sc.evidence && (
                      <p className="text-[11px] text-slate-500 italic">
                        🔍 Minh chứng: "{sc.evidence}"
                      </p>
                    )}
                    {sc.suggestion && (
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        🌱 Gợi ý: {sc.suggestion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: So Sánh 2 Phiên Bản (Diff View) */}
          {currentStep === 6 && versions.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-black text-slate-900">
                    So Sánh Lịch Sử Các Phiên Bản Viết
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Tổng cộng {versions.length} phiên bản
                </span>
              </div>

              {/* Selector for 2 versions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phiên bản gốc:</label>
                  <select
                    value={compareV1}
                    onChange={(e) => setCompareV1(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        Bản {v.versionNumber} ({v.wordCount} từ - {v.savedAt})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phiên bản sau khi sửa:</label>
                  <select
                    value={compareV2}
                    onChange={(e) => setCompareV2(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        Bản {v.versionNumber} ({v.wordCount} từ - {v.savedAt})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* V1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-slate-700">
                    <span>Bản {compareV1}</span>
                    <span>
                      {versions.find((v) => v.versionNumber === compareV1)?.wordCount || 0} từ
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-mono">
                    {versions.find((v) => v.versionNumber === compareV1)?.content || "(Chưa có nội dung)"}
                  </p>
                </div>

                {/* V2 */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200 text-xs font-bold text-emerald-800">
                    <span>Bản {compareV2}</span>
                    <span>
                      {versions.find((v) => v.versionNumber === compareV2)?.wordCount || 0} từ
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-mono">
                    {versions.find((v) => v.versionNumber === compareV2)?.content || "(Chưa có nội dung)"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 text-xs text-emerald-900 font-medium">
                💡 <span className="font-bold">Bài học tiến bộ:</span> Em hãy quan sát xem sau khi nhận phản hồi từ AI, phiên bản mới đã thêm được những từ ngữ gợi tả hay hình ảnh so sánh nào nhé!
              </div>
            </div>
          )}

          {/* STEP 7: Hoàn Thành Nộp Bài */}
          {currentStep === 7 && (
            <div className="bg-white rounded-3xl p-8 border-2 border-emerald-300 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                🎉
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Chúc Mừng Em Đã Hoàn Thành Bài Viết!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Bài của em đã được chuyển đến cô giáo chủ nhiệm. Cô sẽ đọc, xem xét các gợi ý của Trợ lý AI và gửi nhận xét chính thức cho em sớm nhé!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Xem lại bài viết
                </button>
                <button
                  onClick={() => {
                    setContent("");
                    setCurrentSubmissionId(null);
                    setVersions([]);
                    setAiFeedback(null);
                    setRubricResult(null);
                    setCurrentStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Luyện tập bài viết mới
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tips, Word bank & Version History (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Version History Quick Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-emerald-600" />
                Lịch sử các bản nháp ({versions.length})
              </h4>
            </div>

            <div className="space-y-2">
              {versions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Chưa có bản nháp nào được lưu.</p>
              ) : (
                versions.map((ver) => (
                  <div
                    key={ver.versionNumber}
                    onClick={() => {
                      if (confirm(`Em có muốn khôi phục lại nội dung Bản ${ver.versionNumber} không?`)) {
                        setContent(ver.content);
                      }
                    }}
                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Bản {ver.versionNumber}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{ver.savedAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {ver.notes || `${ver.wordCount} từ`}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-600 font-bold">Khôi phục</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ngân hàng từ gợi ý nhanh (Word Bank) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black uppercase text-slate-900">
                Túi Từ Ngữ Gợi Tả & So Sánh
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">Từ gợi tả màu sắc:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["xanh mướt", "xanh thẫm", "đỏ rực", "vàng tươi", "nâu xám", "trắng muốt"].map((w) => (
                    <button
                      key={w}
                      onClick={() => setContent((prev) => prev + " " + w)}
                      className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 border border-emerald-100"
                    >
                      + {w}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">Từ gợi tả âm thanh & cảm giác:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["róc rách", "xào xạc", "mềm mại", "xù xì", "rực rỡ", "thoang thoảng"].map((w) => (
                    <button
                      key={w}
                      onClick={() => setContent((prev) => prev + " " + w)}
                      className="px-2 py-1 rounded-lg bg-orange-50 text-orange-800 text-[11px] font-bold hover:bg-orange-100 border border-orange-100"
                    >
                      + {w}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">Mẫu câu so sánh hay:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["như một chiếc ô khổng lồ", "như dải lụa đào tha thướt", "tựa như muôn ngàn đốm lửa"].map((w) => (
                    <button
                      key={w}
                      onClick={() => setContent((prev) => prev + " " + w)}
                      className="px-2 py-1 rounded-lg bg-purple-50 text-purple-800 text-[11px] font-bold hover:bg-purple-100 border border-purple-100 text-left"
                    >
                      + {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pedagogical Guidance Badge */}
          <div className="p-4 rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 text-white space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-200">
              <span>🦉 Lời khuyên của Thầy/Cô:</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              "Hãy viết bằng chính cảm xúc chân thật của em. Đừng sợ sai, vì mỗi lần sửa bài là một bước em tiến gần hơn tới danh hiệu Cây Bút Nhí Xuất Sắc!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
