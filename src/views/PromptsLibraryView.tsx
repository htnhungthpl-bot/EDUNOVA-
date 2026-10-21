import React, { useState, useEffect } from "react";
import { User, EssayPrompt, Assignment, ClassRoom, WritingLevel, PromptGenre, PromptSourceType, PromptBookVolume } from "../types";
import { api } from "../services/api";
import {
  Compass,
  BookOpen,
  Sparkles,
  PenTool,
  FileSearch,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  Plus,
  Send,
  Trash2,
  Edit3,
  Bookmark,
  Share2,
  Award,
  HelpCircle,
  X,
  FileText,
  Lightbulb,
  Palette,
  Heart,
  Bot,
  ExternalLink,
  Tag,
  GraduationCap,
  Users,
  Check,
} from "lucide-react";

interface PromptsLibraryViewProps {
  currentUser: User;
  onSelectPromptForWriting: (prompt: EssayPrompt) => void;
  onSelectPromptForScan: (prompt: EssayPrompt) => void;
  onBackToHome?: () => void;
}

export const PromptsLibraryView: React.FC<PromptsLibraryViewProps> = ({
  currentUser,
  onSelectPromptForWriting,
  onSelectPromptForScan,
  onBackToHome,
}) => {
  const [prompts, setPrompts] = useState<EssayPrompt[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    countTap1: 0,
    countTap2: 0,
    countSourceDoc: 0,
    countCurated: 0,
    countTeacher: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeVolume, setActiveVolume] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [detailPrompt, setDetailPrompt] = useState<EssayPrompt | null>(null);
  const [aiOutlinePrompt, setAiOutlinePrompt] = useState<EssayPrompt | null>(null);
  const [assignPrompt, setAssignPrompt] = useState<EssayPrompt | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // AI Outline state
  const [aiSubjectInput, setAiSubjectInput] = useState("");
  const [aiOutlineResult, setAiOutlineResult] = useState<any>(null);
  const [aiOutlineLoading, setAiOutlineLoading] = useState(false);

  // Assign modal state
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [assignClassId, setAssignClassId] = useState("class-4a1");
  const [assignDueDate, setAssignDueDate] = useState("2026-11-05");
  const [assignCustomNotes, setAssignCustomNotes] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Create prompt form state
  const [formTitle, setFormTitle] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [formGenre, setFormGenre] = useState<PromptGenre>("mieu-ta-cay-coi");
  const [formVolume, setFormVolume] = useState<PromptBookVolume>("tap1");
  const [formLevel, setFormLevel] = useState<WritingLevel>("bai");
  const [formTopic, setFormTopic] = useState("Cây cối");
  const [formTargetWords, setFormTargetWords] = useState(180);
  const [formLessonRef, setFormLessonRef] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Notification toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const res = await api.getPrompts({
        volume: activeVolume,
        source: selectedSource,
        genre: selectedGenre,
        level: selectedLevel,
        search: searchQuery.trim() || undefined,
      });
      setPrompts(res.prompts || []);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err: any) {
      console.error("Error loading prompts:", err);
      showToast("Lỗi khi tải kho đề: " + (err.message || "Vui lòng thử lại"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, [activeVolume, selectedSource, selectedGenre, selectedLevel]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPrompts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Classes for assignment
  useEffect(() => {
    if (currentUser.role === "teacher" || currentUser.role === "admin") {
      api.getClasses().then((res) => {
        if (res.classes) setClasses(res.classes);
      });
    }
  }, [currentUser]);

  // Generate AI Outline
  const handleGenerateAiOutline = async (p: EssayPrompt) => {
    setAiOutlinePrompt(p);
    setAiSubjectInput(p.topic);
    setAiOutlineResult(null);
    setAiOutlineLoading(true);
    try {
      const res = await api.getPromptAiOutline(p.id, {
        specificSubject: p.topic,
        studentLevel: p.level,
      });
      if (res.customOutline) {
        setAiOutlineResult(res.customOutline);
      }
    } catch (err: any) {
      showToast("Lỗi khi tạo dàn ý: " + err.message, "error");
    } finally {
      setAiOutlineLoading(false);
    }
  };

  const handleRefreshAiOutline = async () => {
    if (!aiOutlinePrompt) return;
    setAiOutlineLoading(true);
    try {
      const res = await api.getPromptAiOutline(aiOutlinePrompt.id, {
        specificSubject: aiSubjectInput.trim() || aiOutlinePrompt.topic,
        studentLevel: aiOutlinePrompt.level,
      });
      if (res.customOutline) {
        setAiOutlineResult(res.customOutline);
        showToast("🦉 Cú Vàng đã cập nhật dàn ý cho chủ đề của em!", "success");
      }
    } catch (err: any) {
      showToast("Lỗi khi tạo lại dàn ý: " + err.message, "error");
    } finally {
      setAiOutlineLoading(false);
    }
  };

  // Assign to class
  const handleAssignToClass = async () => {
    if (!assignPrompt) return;
    setAssignLoading(true);
    try {
      const guidelines = assignCustomNotes.trim()
        ? assignCustomNotes.split("\n").filter(Boolean)
        : undefined;

      const res = await api.assignPromptToClass(assignPrompt.id, {
        classId: assignClassId,
        dueDate: assignDueDate,
        customGuidelines: guidelines,
        teacherName: currentUser.name,
      });

      showToast(res.message || "Đã giao bài tập thành công!", "success");
      setAssignPrompt(null);
      loadPrompts();
    } catch (err: any) {
      showToast("Lỗi khi giao bài: " + err.message, "error");
    } finally {
      setAssignLoading(false);
    }
  };

  // Create new prompt
  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrompt.trim()) {
      showToast("Vui lòng nhập đầy đủ tiêu đề và nội dung đề bài.", "error");
      return;
    }
    setCreateLoading(true);
    try {
      const genreLabels: Record<string, string> = {
        "thuat-lai-su-viec": "Thuật lại sự việc",
        "viet-don": "Viết đơn",
        "doan-van-neu-y-kien": "Đoạn văn nêu ý kiến",
        "mieu-ta-con-vat": "Văn miêu tả con vật",
        "doan-van-tinh-cam": "Đoạn văn nêu tình cảm",
        "mieu-ta-cay-coi": "Văn miêu tả cây cối",
        "huong-dan-cong-viec": "Hướng dẫn thực hiện công việc",
        "tuong-tuong": "Văn tưởng tượng",
      };

      const res = await api.createPrompt({
        title: formTitle.trim(),
        prompt: formPrompt.trim(),
        genre: formGenre,
        genreLabel: genreLabels[formGenre] || "Văn miêu tả",
        bookVolume: formVolume,
        level: formLevel,
        topic: formTopic.trim() || "Chủ đề tự chọn",
        targetWords: formTargetWords,
        lessonReference: formLessonRef.trim() || `Đề bổ trợ - ${currentUser.name} tạo`,
        createdBy: currentUser.id,
        createdByName: currentUser.name,
        source: "teacher",
      });

      showToast(res.message || "Tạo đề bài thành công!", "success");
      setShowCreateModal(false);
      // Reset form
      setFormTitle("");
      setFormPrompt("");
      setFormLessonRef("");
      loadPrompts();
    } catch (err: any) {
      showToast("Lỗi khi tạo đề: " + err.message, "error");
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete prompt
  const handleDeletePrompt = async (id: string, title: string) => {
    if (!window.confirm(`Thầy/Cô có chắc chắn muốn xóa đề bài "${title}" khỏi Kho đề không?`)) {
      return;
    }
    try {
      const res = await api.deletePrompt(id);
      showToast(res.message || "Đã xóa đề bài.", "success");
      loadPrompts();
    } catch (err: any) {
      showToast(err.message || "Không thể xóa đề bài.", "error");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium animate-bounce ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Header for Kho Đề Văn Lớp 4 */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-radial from-amber-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-96 h-96 bg-radial from-emerald-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Chương trình GDPT 2018 — Bộ sách Kết nối tri thức với cuộc sống</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              KHO ĐỀ VĂN LỚP 4
              <span className="text-amber-300 text-lg sm:text-2xl font-bold font-serif italic">
                “Viết hay hơn mỗi ngày”
              </span>
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Ngân hàng đề bài chính thống từ Vở Tập làm văn lớp 4 (Tập Một & Tập Hai) cùng hệ thống đề luyện tập biên soạn chuyên sâu. Đầy đủ hướng dẫn 5 bước: <span className="text-amber-200 font-medium">Hiểu đề → Quan sát giác quan → Dàn ý 3 phần → Từ ngữ vàng → Tự đánh giá Rubric</span>.
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-medium text-emerald-100">
                <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                <span>Tổng cộng: <strong className="text-white">{stats.total}</strong> đề</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-medium text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Tập Một: <strong className="text-white">{stats.countTap1}</strong> đề</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-xs font-medium text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>Tập Hai: <strong className="text-white">{stats.countTap2}</strong> đề</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-xs font-medium text-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tài liệu nguồn SGK: <strong className="text-white">{stats.countSourceDoc}</strong></span>
              </div>
              {stats.countTeacher > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-xs font-medium text-amber-200">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Giáo viên tạo: <strong className="text-white">{stats.countTeacher}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Action on Right (Teacher / Admin) */}
          {(currentUser.role === "teacher" || currentUser.role === "admin") && (
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 text-emerald-950" />
                <span>Thêm đề bài mới</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Dimensional Filter Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200/80 space-y-4">
        {/* Row 1: Volume Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Volume Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl max-w-fit">
            <button
              onClick={() => setActiveVolume("all")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeVolume === "all"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả các kì ({stats.total})
            </button>
            <button
              onClick={() => setActiveVolume("tap1")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeVolume === "tap1"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Tập Một (Học kì 1)
            </button>
            <button
              onClick={() => setActiveVolume("tap2")}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeVolume === "tap2"
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Tập Hai (Học kì 2)
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên đề, cây bàng, con mèo, chuyến đi..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Secondary Dropdowns (Source, Genre, Level) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Nguồn:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả nguồn ({stats.total})</option>
              <option value="source_doc">📖 Tài liệu nguồn SGK Kết nối tri thức ({stats.countSourceDoc})</option>
              <option value="curated">✨ Đề luyện tập biên soạn chuyên sâu ({stats.countCurated})</option>
              <option value="teacher">👩‍🏫 Đề do giáo viên trong trường tạo ({stats.countTeacher})</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Thể loại:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả 8 thể loại</option>
              <option value="thuat-lai-su-viec">Thuật lại sự việc (kể chuyện, trải nghiệm, việc tốt)</option>
              <option value="viet-don">Viết đơn (nghỉ học, vào Đội, tham gia CLB)</option>
              <option value="doan-van-neu-y-kien">Đoạn văn nêu ý kiến / cảm nghĩ về tác phẩm</option>
              <option value="mieu-ta-con-vat">Văn miêu tả con vật (vật nuôi, thói quen)</option>
              <option value="doan-van-tinh-cam">Đoạn văn nêu tình cảm, cảm xúc (mẹ, thầy cô)</option>
              <option value="mieu-ta-cay-coi">Văn miêu tả cây cối (bóng mát, ăn quả, hoa Tết)</option>
              <option value="huong-dan-cong-viec">Hướng dẫn thực hiện công việc (gấp giấy, trồng cây)</option>
              <option value="tuong-tuong">Đoạn văn / bài văn tưởng tượng</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Cấp độ:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả cấp độ viết</option>
              <option value="cau">Luyện viết câu (Mở rộng câu, so sánh)</option>
              <option value="doan">Luyện viết đoạn (4-8 câu)</option>
              <option value="bai">Luyện viết bài văn (3 phần hoàn chỉnh)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prompts Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Đang chuẩn bị kho đề văn lớp 4...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy đề bài phù hợp bộ lọc</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Em hoặc Thầy/Cô hãy thử bỏ bớt bộ lọc hoặc xóa từ khóa tìm kiếm để khám phá toàn bộ kho đề nhé!
          </p>
          <button
            onClick={() => {
              setActiveVolume("all");
              setSelectedSource("all");
              setSelectedGenre("all");
              setSelectedLevel("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Hiển thị toàn bộ kho đề
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((p) => {
            const isSourceDoc = p.source === "source_doc";
            const isTeacher = p.source === "teacher";
            const isCurated = p.source === "curated";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top: Badges & Volume */}
                <div className="p-5 pb-3 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Source Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isSourceDoc
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : isTeacher
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {isSourceDoc ? "📖 Tài liệu nguồn KNTT" : isTeacher ? "👩‍🏫 Đề giáo viên" : "✨ Biên soạn chuyên sâu"}
                    </span>

                    {/* Volume & Week Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.week && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Tuần {p.week} {p.sgkPage ? `• Tr.${p.sgkPage}` : ""}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          p.bookVolume === "tap1"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : p.bookVolume === "tap2"
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {p.bookVolume === "tap1" ? "Tập 1" : p.bookVolume === "tap2" ? "Tập 2" : "Cả năm"}
                      </span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1 flex-wrap">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{p.genreLabel}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">{p.topic}</span>
                      {p.stage && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {p.stage}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>

                  {/* Prompt Text Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {p.prompt}
                  </p>

                  {/* Meta Tags: Target words, Lesson Ref */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">{p.targetWords} chữ</span>
                      <span>({p.level === "cau" ? "Câu" : p.level === "doan" ? "Đoạn văn" : "Bài văn"})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {p.lessonReference || p.sourceLabel}
                    </span>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="p-4 pt-3 bg-slate-50/70 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* View Guide 5 steps */}
                    <button
                      onClick={() => setDetailPrompt(p)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Hướng dẫn 5 bước</span>
                    </button>

                    {/* AI Socratic Outline */}
                    <button
                      onClick={() => handleGenerateAiOutline(p)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
                    >
                      <Bot className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Dàn ý cùng AI</span>
                    </button>
                  </div>

                  {/* Primary Direct Actions: Write Now / Scan & Rubric */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectPromptForWriting(p)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Luyện viết ngay</span>
                    </button>

                    <button
                      onClick={() => onSelectPromptForScan(p)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                    >
                      <FileSearch className="w-3.5 h-3.5" />
                      <span>Chấm Rubric</span>
                    </button>
                  </div>

                  {/* Teacher actions: Assign to class / Delete */}
                  {(currentUser.role === "teacher" || currentUser.role === "admin") && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <button
                        onClick={() => {
                          setAssignPrompt(p);
                          setAssignCustomNotes(p.stepByStepGuide.step4VocabularyAndFigurative.comparisons[0] || "");
                        }}
                        className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        <Users className="w-3 h-3" />
                        <span>Giao bài cho lớp</span>
                      </button>

                      {isTeacher && (
                        <button
                          onClick={() => handleDeletePrompt(p.id, p.title)}
                          className="flex items-center gap-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: HƯỚNG DẪN CHI TIẾT 5 BƯỚC THEO ĐỀ BÀI (PROMPT DETAIL MODAL) */}
      {/* ========================================================================= */}
      {detailPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-linear-to-r from-emerald-800 to-teal-900 text-white flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-emerald-200">
                    {detailPrompt.sourceLabel}
                  </span>
                  <span className="text-xs text-emerald-300 font-medium">
                    {detailPrompt.lessonReference}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">{detailPrompt.title}</h2>
              </div>
              <button
                onClick={() => setDetailPrompt(null)}
                className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-700">
              {/* Prompt Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Yêu cầu đề bài:</span>
                <p className="text-sm font-semibold text-slate-800">{detailPrompt.prompt}</p>
                <div className="text-xs text-amber-700 flex items-center gap-3 pt-1">
                  <span>Dung lượng mục tiêu: <strong>{detailPrompt.targetWords} chữ</strong></span>
                  <span>•</span>
                  <span>Thể loại: <strong>{detailPrompt.genreLabel}</strong></span>
                </div>
              </div>

              {/* Learning Objectives & SGK Curriculum Metadata */}
              {(detailPrompt.learningObjectives || detailPrompt.stage || detailPrompt.week) && (
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {detailPrompt.week && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-black">
                        Tuần {detailPrompt.week} {detailPrompt.lessonNumber ? `- Bài ${detailPrompt.lessonNumber}` : ""}
                      </span>
                    )}
                    {detailPrompt.sgkPage && (
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold">
                        Trang {detailPrompt.sgkPage} (SGK Tiếng Việt 4 KNTT)
                      </span>
                    )}
                    {detailPrompt.stage && (
                      <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 text-xs font-bold">
                        Chặng: {detailPrompt.stage}
                      </span>
                    )}
                  </div>
                  {detailPrompt.learningObjectives && (
                    <div className="text-xs text-emerald-950 font-medium pt-1 border-t border-emerald-200/60">
                      <strong className="text-emerald-900 font-bold">🎯 Mục tiêu học tập chuẩn GDPT 2018: </strong>
                      <span>{detailPrompt.learningObjectives}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 5 Bước Hướng Dẫn Sư Phạm */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Quy trình 5 bước phát triển bài viết chuẩn GDPT 2018
                </h4>

                {/* Bước 1: Hiểu đề */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                    <span>Bước 1: Tìm hiểu đề & Xác định yêu cầu trọng tâm</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium pl-8">
                    {detailPrompt.stepByStepGuide.step1Understanding.questionPrompt}
                  </p>
                  <div className="pl-8 flex flex-wrap gap-2 pt-1">
                    {detailPrompt.stepByStepGuide.step1Understanding.keyElements.map((elem, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {elem}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bước 2: Quan sát & 5 Giác quan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-teal-800">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">2</span>
                    <span>Bước 2: Quan sát & Khơi gợi 5 giác quan</span>
                  </div>
                  <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {detailPrompt.stepByStepGuide.step2Observation.senses.sight && (
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-800">👀 Thị giác (Mắt thấy):</strong> {detailPrompt.stepByStepGuide.step2Observation.senses.sight}
                      </div>
                    )}
                    {detailPrompt.stepByStepGuide.step2Observation.senses.sound && (
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-800">👂 Thính giác (Tai nghe):</strong> {detailPrompt.stepByStepGuide.step2Observation.senses.sound}
                      </div>
                    )}
                    {detailPrompt.stepByStepGuide.step2Observation.senses.touch && (
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-800">✋ Xúc giác (Tay chạm):</strong> {detailPrompt.stepByStepGuide.step2Observation.senses.touch}
                      </div>
                    )}
                    {detailPrompt.stepByStepGuide.step2Observation.senses.emotion && (
                      <div className="p-2 rounded-lg bg-white border border-slate-200">
                        <strong className="text-slate-800">❤️ Cảm xúc (Trái tim):</strong> {detailPrompt.stepByStepGuide.step2Observation.senses.emotion}
                      </div>
                    )}
                  </div>
                  <div className="pl-8 pt-1">
                    <span className="text-xs font-semibold text-slate-700">Câu hỏi gợi ý suy nghĩ:</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 mt-1 space-y-1">
                      {detailPrompt.stepByStepGuide.step2Observation.guidingQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bước 3: Dàn ý 3 phần */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-800">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                    <span>Bước 3: Lập dàn ý gợi ý 3 phần chuẩn mực</span>
                  </div>
                  <div className="pl-8 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-indigo-900 block mb-1">🌿 1. Mở bài:</strong>
                      <p className="text-slate-700">{detailPrompt.stepByStepGuide.step3Outline.introduction}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-indigo-900 block mb-1">🌿 2. Thân bài:</strong>
                      <ul className="space-y-1 text-slate-700">
                        {detailPrompt.stepByStepGuide.step3Outline.body.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <strong className="text-indigo-900 block mb-1">🌿 3. Kết bài:</strong>
                      <p className="text-slate-700">{detailPrompt.stepByStepGuide.step3Outline.conclusion}</p>
                    </div>
                  </div>
                </div>

                {/* Bước 4: Vốn từ hay & So sánh, nhân hóa */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">4</span>
                    <span>Bước 4: Vốn từ ngữ vàng & Biện pháp tu từ đắt giá</span>
                  </div>
                  <div className="pl-8 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">Từ láy & từ ngữ gợi cảm xúc:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {detailPrompt.stepByStepGuide.step4VocabularyAndFigurative.vividWords.map((word, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-medium">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                    {detailPrompt.stepByStepGuide.step4VocabularyAndFigurative.comparisons.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">Hình ảnh so sánh sinh động:</span>
                        <ul className="space-y-1 text-slate-600 italic">
                          {detailPrompt.stepByStepGuide.step4VocabularyAndFigurative.comparisons.map((c, i) => (
                            <li key={i}>“{c}”</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {detailPrompt.stepByStepGuide.step4VocabularyAndFigurative.personifications.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">Phép nhân hóa ngộ nghĩnh:</span>
                        <ul className="space-y-1 text-slate-600 italic">
                          {detailPrompt.stepByStepGuide.step4VocabularyAndFigurative.personifications.map((p, i) => (
                            <li key={i}>“{p}”</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bước 5: Checklist tự kiểm tra */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs">5</span>
                    <span>Bước 5: Bảng tự kiểm tra (Checklist) trước khi nộp</span>
                  </div>
                  <div className="pl-8 space-y-1 text-xs">
                    {detailPrompt.stepByStepGuide.step5Checklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Đoạn Văn Mẫu Tham Khảo */}
              {detailPrompt.sampleExcerpts && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                    Đoạn văn mẫu tham khảo đạt Mức 4:
                  </span>
                  {detailPrompt.sampleExcerpts.goodIntroExample && (
                    <div className="text-xs text-slate-800 italic bg-white p-3 rounded-xl border border-emerald-100 leading-relaxed">
                      <strong>Mở bài mẫu:</strong> “{detailPrompt.sampleExcerpts.goodIntroExample}”
                    </div>
                  )}
                  {detailPrompt.sampleExcerpts.goodBodyExcerpt && (
                    <div className="text-xs text-slate-800 italic bg-white p-3 rounded-xl border border-emerald-100 leading-relaxed">
                      <strong>Thân bài mẫu:</strong> “{detailPrompt.sampleExcerpts.goodBodyExcerpt}”
                    </div>
                  )}
                  {detailPrompt.sampleExcerpts.goodConclusionExample && (
                    <div className="text-xs text-slate-800 italic bg-white p-3 rounded-xl border border-emerald-100 leading-relaxed">
                      <strong>Kết bài mẫu:</strong> “{detailPrompt.sampleExcerpts.goodConclusionExample}”
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom CTA */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Đã có <strong>{detailPrompt.usageCount}</strong> lượt học sinh luyện tập đề này
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const target = detailPrompt;
                    setDetailPrompt(null);
                    onSelectPromptForScan(target);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs"
                >
                  Tải ảnh / Word chấm Rubric
                </button>
                <button
                  onClick={() => {
                    const target = detailPrompt;
                    setDetailPrompt(null);
                    onSelectPromptForWriting(target);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Bắt đầu luyện viết</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DÀN Ý CÙNG AI (AI OUTLINE MODAL) */}
      {/* ========================================================================= */}
      {aiOutlinePrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-linear-to-r from-indigo-700 to-purple-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Trợ lý Cú Vàng gợi ý Dàn ý</h3>
                  <p className="text-xs text-indigo-200">{aiOutlinePrompt.title}</p>
                </div>
              </div>
              <button
                onClick={() => setAiOutlinePrompt(null)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700">
              {/* Subject Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Đối tượng cụ thể của em (ví dụ: Cây phượng góc sân, Chú cún Bông, Chiếc cặp mới...):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiSubjectInput}
                    onChange={(e) => setAiSubjectInput(e.target.value)}
                    placeholder="Nhập đối tượng em muốn tả/kể..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleRefreshAiOutline}
                    disabled={aiOutlineLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all disabled:opacity-50"
                  >
                    {aiOutlineLoading ? "Đang nghĩ..." : "Tạo dàn ý"}
                  </button>
                </div>
              </div>

              {/* Outline Result */}
              {aiOutlineLoading ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium text-slate-500">Cú Vàng đang suy nghĩ và sắp xếp các ý hay cho em...</p>
                </div>
              ) : aiOutlineResult ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-slate-800 space-y-1">
                    <strong className="text-indigo-900 block">1. Mở bài gợi mở:</strong>
                    <p>{aiOutlineResult.introduction}</p>
                  </div>

                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-slate-800 space-y-1">
                    <strong className="text-indigo-900 block">2. Thân bài (Trình tự quan sát):</strong>
                    <ul className="space-y-1 text-slate-700">
                      {aiOutlineResult.bodyPoints.map((pt: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-slate-800 space-y-1">
                    <strong className="text-indigo-900 block">3. Kết bài mở rộng:</strong>
                    <p>{aiOutlineResult.conclusion}</p>
                  </div>

                  {aiOutlineResult.suggestedWords && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-800">
                      <strong className="text-amber-900 block mb-1">Từ ngữ gợi cảm khuyên dùng:</strong>
                      <div className="flex flex-wrap gap-1">
                        {aiOutlineResult.suggestedWords.map((w: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-white text-amber-900 rounded-md border border-amber-200 text-[11px]">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setAiOutlinePrompt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const target = aiOutlinePrompt;
                  setAiOutlinePrompt(null);
                  onSelectPromptForWriting(target);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Áp dụng và viết bài</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: GIAO BÀI TẬP CHO LỚP (ASSIGN PROMPT MODAL - TEACHER/ADMIN) */}
      {/* ========================================================================= */}
      {assignPrompt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-linear-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Giao bài tập từ Kho đề</h3>
              </div>
              <button onClick={() => setAssignPrompt(null)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-slate-700">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                <span className="font-bold text-emerald-900 block">Đề bài:</span>
                <p className="text-slate-800 font-medium">{assignPrompt.title}</p>
                <span className="text-[11px] text-emerald-700 mt-1 block">Dung lượng: ~{assignPrompt.targetWords} chữ</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chọn lớp học:</label>
                <select
                  value={assignClassId}
                  onChange={(e) => setAssignClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.teacherName})
                    </option>
                  ))}
                  {classes.length === 0 && (
                    <>
                      <option value="class-4a1">Lớp 4A1 (Cô Lê Thị Thu Hương)</option>
                      <option value="class-4a2">Lớp 4A2 (Thầy Nguyễn Đăng Khoa)</option>
                      <option value="class-4a3">Lớp 4A3 (Cô Phạm Mai Lan)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hạn nộp bài:</label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ghi chú hướng dẫn thêm cho học sinh (tùy chọn):
                </label>
                <textarea
                  value={assignCustomNotes}
                  onChange={(e) => setAssignCustomNotes(e.target.value)}
                  placeholder="Ví dụ: Chú ý dùng ít nhất 2 câu so sánh và không mắc lỗi chính tả l/n..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setAssignPrompt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignToClass}
                disabled={assignLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
              >
                {assignLoading ? "Đang giao..." : "Xác nhận giao bài"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: THÊM ĐỀ BÀI MỚI (CREATE PROMPT MODAL - TEACHER/ADMIN) */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-linear-to-r from-amber-600 to-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-base">Thêm đề bài mới vào Kho đề</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrompt} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên đề bài ngắn gọn *:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Tả cây bưởi trĩu quả trong vườn nhà"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nội dung đề bài chi tiết *:</label>
                <textarea
                  required
                  rows={3}
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  placeholder="Em hãy quan sát và viết bài văn miêu tả cây bưởi..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Học kì (Tập sách):</label>
                  <select
                    value={formVolume}
                    onChange={(e) => setFormVolume(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="tap1">Tập Một (Học kì 1)</option>
                    <option value="tap2">Tập Hai (Học kì 2)</option>
                    <option value="all">Toàn bộ năm học</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cấp độ bài viết:</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="cau">Viết câu</option>
                    <option value="doan">Viết đoạn văn</option>
                    <option value="bai">Viết bài văn 3 phần</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Thể loại:</label>
                  <select
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="mieu-ta-cay-coi">Văn miêu tả cây cối</option>
                    <option value="mieu-ta-con-vat">Văn miêu tả con vật</option>
                    <option value="thuat-lai-su-viec">Thuật lại sự việc</option>
                    <option value="viet-don">Viết đơn</option>
                    <option value="doan-van-neu-y-kien">Đoạn văn nêu ý kiến</option>
                    <option value="doan-van-tinh-cam">Đoạn văn nêu tình cảm</option>
                    <option value="huong-dan-cong-viec">Hướng dẫn thực hiện công việc</option>
                    <option value="tuong-tuong">Văn tưởng tượng</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số chữ mục tiêu:</label>
                  <input
                    type="number"
                    value={formTargetWords}
                    onChange={(e) => setFormTargetWords(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đề:</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="Cây cối, Gia đình, Trường học..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bài học trong sách:</label>
                  <input
                    type="text"
                    value={formLessonRef}
                    onChange={(e) => setFormLessonRef(e.target.value)}
                    placeholder="Tuần 20 - Bài 14..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 -mx-6 -mb-6 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  {createLoading ? "Đang lưu..." : "Lưu vào Kho đề"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
