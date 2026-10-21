import React, { useState, useEffect, useCallback, useMemo } from "react";
import { User } from "../types";
import { api } from "../services/api";
import confetti from "canvas-confetti";
import { GAME_QUESTION_BANK, GameQuestion } from "../data/gameQuestionBank";
import { MiniGamesSection } from "../components/games/MiniGamesSection";
import {
  Gamepad2,
  Award,
  Star,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  HelpCircle,
  BookOpen,
  Compass,
  Check,
  Flame,
  Shuffle,
  RefreshCw,
  Sliders,
  ChevronRight,
  Eye,
} from "lucide-react";

interface GamesViewProps {
  currentUser: User;
  initialTab?: "arena-100" | "mini-games";
}

// Cấu trúc một câu hỏi trong lượt chơi đang diễn ra (đã được đảo đáp án)
interface PlayQuestion {
  originalId: number;
  genre: string;
  genreLabel: string;
  category: string;
  question: string;
  shuffledOptions: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
}

// Hàm xáo trộn mảng theo thuật toán Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Web Audio API để phát âm thanh tương tác nhẹ nhàng (không cần tệp ngoài)
function playTone(freq: number, type: OscillatorType = "sine", duration: number = 0.15) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio disabled or unsupported
  }
}

export const GamesView: React.FC<GamesViewProps> = ({ currentUser, initialTab = "mini-games" }) => {
  // Chế độ trò chơi: "mini-games" (Trò chơi bổ trợ) | "arena-100" (Đấu trường 100 câu)
  const [activeTab, setActiveTab] = useState<"arena-100" | "mini-games">(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Bộ lọc thể loại trong Đấu trường 100 câu
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>("all");

  // Trạng thái lượt chơi Đấu trường 100 câu
  const [sessionQuestions, setSessionQuestions] = useState<PlayQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [answeredHistory, setAnsweredHistory] = useState<
    Array<{
      question: PlayQuestion;
      chosenIndex: number;
      isCorrect: boolean;
    }>
  >([]);

  // 10 Thể loại chuẩn bị cho bộ lọc
  const genreFilters = [
    { id: "all", label: "🌟 Tất cả 10 Thể loại (Ngẫu nhiên 100 câu)", count: 100 },
    { id: "cay-coi", label: "🌿 Miêu tả cây cối", count: 10 },
    { id: "con-vat", label: "🐾 Miêu tả con vật", count: 10 },
    { id: "thuat-lai", label: "📖 Thuật lại sự việc", count: 10 },
    { id: "y-kien", label: "💡 Đoạn văn nêu ý kiến", count: 10 },
    { id: "tinh-cam", label: "❤️ Tình cảm, cảm xúc", count: 10 },
    { id: "viet-don", label: "📝 Viết đơn & Thể thức", count: 10 },
    { id: "huong-dan", label: "🛠️ Hướng dẫn công việc", count: 10 },
    { id: "tuong-tuong", label: "🚀 Tưởng tượng sáng tạo", count: 10 },
    { id: "tu-tu", label: "✨ So sánh & Nhân hóa", count: 10 },
    { id: "chinh-ta", label: "🔍 Chính tả & Từ vựng", count: 10 },
  ];

  // ==========================================================================
  // KHỞI TẠO LƯỢT CHƠI MỚI (10 CÂU): ĐẢO CÂU HỎI & ĐẢO ĐÁP ÁN HOÀN TOÀN
  // ==========================================================================
  const startNewSession = useCallback((genre: string = selectedGenreFilter) => {
    // 1. Lọc nguồn câu hỏi theo thể loại
    let pool: GameQuestion[] = [...GAME_QUESTION_BANK];
    if (genre !== "all") {
      pool = pool.filter((q) => q.genre === genre);
    }

    // 2. Xáo trộn thứ tự các câu hỏi (Shuffle questions)
    const shuffledPool = shuffleArray(pool);

    // 3. Rút đúng 10 câu hỏi cho lượt chơi này
    const chosenTen = shuffledPool.slice(0, 10);

    // 4. ĐỐI VỚI MỖI CÂU: ĐẢO THỨ TỰ 4 ĐÁP ÁN (Shuffle options) & TÍNH LẠI CHỈ SỐ ĐÚNG
    const formattedPlayQuestions: PlayQuestion[] = chosenTen.map((q) => {
      const shuffledOpts = shuffleArray(q.options);
      const newCorrectIndex = shuffledOpts.indexOf(q.correctAnswer);
      return {
        originalId: q.id,
        genre: q.genre,
        genreLabel: q.genreLabel,
        category: q.category,
        question: q.question,
        shuffledOptions: shuffledOpts,
        correctIndex: newCorrectIndex,
        explanation: q.explanation,
        tip: q.tip,
      };
    });

    setSessionQuestions(formattedPlayQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsFinished(false);
    setAnsweredHistory([]);
  }, [selectedGenreFilter]);

  // Khởi tạo lượt chơi đầu tiên khi mở trang
  useEffect(() => {
    startNewSession("all");
  }, []);

  // Xử lý khi học sinh bấm chọn đáp án
  const handleSelectOption = (index: number) => {
    if (selectedOption !== null || isFinished || sessionQuestions.length === 0) return;

    const currentQ = sessionQuestions[currentIndex];
    setSelectedOption(index);
    const isCorrect = index === currentQ.correctIndex;

    // Âm thanh tương tác
    if (soundEnabled) {
      if (isCorrect) {
        playTone(587.33, "triangle", 0.1); // D5
        setTimeout(() => playTone(880, "sine", 0.25), 100); // A5 ting!
      } else {
        playTone(220, "sawtooth", 0.25); // Thấp
      }
    }

    // Cập nhật điểm & chuỗi combo đúng
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    if (newStreak > maxStreak) {
      setMaxStreak(newStreak);
    }

    const earnedPoints = isCorrect ? 10 : 0;
    const newTotalScore = score + earnedPoints;
    if (isCorrect) {
      setScore(newTotalScore);
    }

    // Ghi nhận lịch sử câu này
    setAnsweredHistory((prev) => [
      ...prev,
      {
        question: currentQ,
        chosenIndex: index,
        isCorrect,
      },
    ]);
  };

  // Chuyển sang câu tiếp theo hoặc kết thúc lượt chơi
  const handleNextQuestion = async () => {
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      // Đã trả lời xong 10 câu
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Lưu kết quả vào hệ thống
      try {
        await api.recordGameResult({
          gameId: "dau-truong-100-cau",
          gameName: "Đấu trường 100 câu hỏi vàng",
          studentId: currentUser.id,
          studentName: currentUser.name,
          score: score,
          maxScore: 100,
          stars: score >= 80 ? 3 : score >= 60 ? 2 : 1,
        });
      } catch (err) {
        console.warn("Lưu điểm trò chơi warning:", err);
      }
    }
  };

  // Danh hiệu vinh danh học sinh
  const getStudentTitle = (finalScore: number) => {
    if (finalScore >= 100) {
      return {
        title: "Trạng Nguyên Văn Học Nhí 🏆",
        stars: 3,
        badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
        message: "Xuất sắc tuyệt đỉnh! Em đã trả lời đúng 10/10 câu hỏi, nắm vững toàn diện kiến thức tiếng Việt và tập làm văn lớp 4!",
      };
    }
    if (finalScore >= 80) {
      return {
        title: "Cây Bút Vàng Triển Vọng 🌟",
        stars: 3,
        badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
        message: "Rất giỏi! Em có tư duy ngôn ngữ nhạy bén và kĩ năng dùng từ đặt câu rất vững vàng!",
      };
    }
    if (finalScore >= 60) {
      return {
        title: "Dũng Sĩ Ngôn Ngữ Chăm Chỉ 🎖️",
        stars: 2,
        badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
        message: "Làm tốt lắm! Em đã nắm được các kiến thức cốt lõi. Hãy chơi thêm vòng mới để bứt phá lên 100 điểm nhé!",
      };
    }
    return {
      title: "Hạt Giống Chăm Ngoan Cố Lên 🌱",
      stars: 1,
      badgeColor: "bg-orange-100 text-orange-900 border-orange-300",
      message: "Đừng nản lòng nhé! Mỗi câu hỏi vừa qua đã giúp em học thêm một mẹo hành văn bổ ích. Hãy thử lại vòng mới ngay nào!",
    };
  };

  const currentQ = sessionQuestions[currentIndex];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation Tabs & Sound Control */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex bg-slate-100 p-1.5 rounded-xl text-xs sm:text-sm font-bold gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("mini-games")}
            className={`px-4 sm:px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "mini-games"
                ? "bg-emerald-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-emerald-800 hover:bg-slate-200/60"
            }`}
          >
            <Gamepad2 className={`w-4 h-4 ${activeTab === "mini-games" ? "text-amber-300" : "text-emerald-600"}`} />
            <span>4 Mini Games Bổ Trợ</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === "mini-games" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
            }`}>
              Tương tác
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("arena-100")}
            className={`px-4 sm:px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "arena-100"
                ? "bg-amber-500 text-emerald-950 shadow-xs font-black"
                : "text-slate-600 hover:text-amber-800 hover:bg-slate-200/60"
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === "arena-100" ? "text-emerald-950" : "text-amber-500"}`} />
            <span>Đấu Trường 100 Câu Vàng</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === "arena-100" ? "bg-black/10 text-emerald-950" : "bg-amber-100 text-amber-800"
            }`}>
              10 câu/lượt
            </span>
          </button>
        </div>

        {/* Nút bật/tắt âm thanh */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Âm thanh: Bật</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Âm thanh: Tắt</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Banner Matching Active Tab */}
      {activeTab === "mini-games" ? (
        <div className="bg-linear-to-r from-teal-700 via-emerald-600 to-green-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Rèn Luyện Kỹ Năng Viết Chuyên Sâu • Lớp 4
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              4 Mini Games Bổ Trợ Kỹ Năng Tiếng Việt
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl leading-relaxed">
              Thực hành 4 kĩ năng then chốt: <strong>Xây Cầu Thần Tốc</strong> (ghép trật tự câu), <strong>Thám Tử Chính Tả</strong> (bắt lỗi l/n, s/x, tr/ch), <strong>Vua Từ Láy & Từ Gợi Cảm</strong>, và <strong>Thợ Rèn Câu Văn</strong> (nâng cấp câu Mức 4 Rubric).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30 text-xs font-black shrink-0">
            <Gamepad2 className="w-5 h-5 text-amber-300" />
            <div>
              <p className="text-[10px] text-teal-200 uppercase">Học sinh tham gia:</p>
              <p className="text-sm font-black">{currentUser.name}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              Ngân Hàng 100 Câu Hỏi Vàng • GDPT 2018
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Đấu Trường Ngôn Ngữ Tiếng Việt Lớp 4
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
              Mỗi lượt chơi gồm <strong>10 câu hỏi ngẫu nhiên</strong>. Hệ thống <strong>tự động đảo câu hỏi và xáo trộn 4 đáp án A, B, C, D</strong> ở mỗi lượt để tăng tối đa sự hứng thú và loại bỏ học vẹt!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30 text-xs font-black shrink-0">
            <Trophy className="w-5 h-5 text-amber-300 animate-pulse" />
            <div>
              <p className="text-[10px] text-amber-200 uppercase">Học sinh thi đấu:</p>
              <p className="text-sm font-black">{currentUser.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* PHẦN CHÍNH: ĐẤU TRƯỜNG 100 CÂU (10 CÂU / LƯỢT CHƠI)                  */}
      {/* ==================================================================== */}
      {activeTab === "arena-100" && (
        <div className="space-y-6">
          {/* Thanh Chọn Thể Loại Để Thử Thách */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-orange-600" />
                Chọn Chế Độ Thể Loại (Ngân hàng 100 câu):
              </span>
              <button
                type="button"
                onClick={() => startNewSession(selectedGenreFilter)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Đổi 10 câu mới & Đảo đáp án ngay
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {genreFilters.map((g) => {
                const isSelected = selectedGenreFilter === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedGenreFilter(g.id);
                      startNewSession(g.id);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm font-black scale-102"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    {g.label} ({g.count} câu)
                  </button>
                );
              })}
            </div>
          </div>

          {/* GIAO DIỆN CHƠI: 10 CÂU HỎI TRẮC NGHIỆM ĐẢO ĐÁP ÁN */}
          {!isFinished && currentQ ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Header Lượt Chơi: Tiến độ câu & Điểm số & Streak */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-orange-100 text-orange-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                      Câu hỏi {currentIndex + 1} / {sessionQuestions.length}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {currentQ.genreLabel} • {currentQ.category}
                    </span>
                  </div>
                  <h3 className="text-xs text-slate-400 font-medium">
                    Mỗi câu đúng được 10 điểm • Tối đa 100 điểm cho 10 câu
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Streak Flame */}
                  {streak > 1 && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-black animate-pulse">
                      <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span>Chuỗi đúng x{streak}!</span>
                    </div>
                  )}

                  {/* Current Score */}
                  <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black flex items-center gap-1.5 shadow-2xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{score} / 100 điểm</span>
                  </div>
                </div>
              </div>

              {/* Thanh tiến độ 10 câu */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-linear-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + (selectedOption !== null ? 1 : 0)) / sessionQuestions.length) * 100}%` }}
                />
              </div>

              {/* Hộp Câu Hỏi Lớn */}
              <div className="p-6 rounded-3xl bg-linear-to-tr from-amber-50/70 via-orange-50/40 to-slate-50 border-2 border-amber-200/80 text-base sm:text-lg font-black text-slate-900 leading-relaxed shadow-xs">
                <span className="text-amber-600 mr-2 text-xl">❓</span>
                {currentQ.question}
              </div>

              {/* 4 Đáp Án A, B, C, D (Đã được xáo trộn ngẫu nhiên hoàn toàn) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQ.shuffledOptions.map((optionText, optIndex) => {
                  const letter = String.fromCharCode(65 + optIndex); // A, B, C, D
                  const isSelected = selectedOption === optIndex;
                  const isCorrect = optIndex === currentQ.correctIndex;
                  const hasAnswered = selectedOption !== null;

                  let buttonStyle = "bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 text-slate-800";
                  let badgeStyle = "bg-slate-100 text-slate-600 border-slate-300";

                  if (hasAnswered) {
                    if (isCorrect) {
                      buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-400";
                      badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = "bg-rose-50 border-rose-500 text-rose-950 font-bold";
                      badgeStyle = "bg-rose-600 text-white border-rose-600";
                    } else {
                      buttonStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                      badgeStyle = "bg-slate-200 text-slate-400 border-slate-200";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(optIndex)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all flex items-start gap-3.5 cursor-pointer ${buttonStyle}`}
                    >
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${badgeStyle}`}>
                        {letter}
                      </span>
                      <span className="flex-1 leading-snug pt-0.5">{optionText}</span>
                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hộp Giải Thích Sư Phạm Ngay Sau Khi Chọn */}
              {selectedOption !== null && (
                <div className="p-5 rounded-3xl bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2">
                    {selectedOption === currentQ.correctIndex ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black uppercase flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Chính xác (+10 điểm)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Chưa chính xác
                      </span>
                    )}
                    <span className="text-xs font-extrabold text-emerald-900">
                      Đáp án đúng là: {String.fromCharCode(65 + currentQ.correctIndex)}. {currentQ.shuffledOptions[currentQ.correctIndex]}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    💡 <strong className="text-slate-900">Vì sao đúng:</strong> {currentQ.explanation}
                  </p>

                  {currentQ.tip && (
                    <p className="text-[11px] text-emerald-800 font-medium italic pt-1 border-t border-emerald-200/60">
                      ✨ {currentQ.tip}
                    </p>
                  )}

                  {/* Nút sang câu tiếp theo */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer scale-102"
                    >
                      {currentIndex + 1 < sessionQuestions.length ? (
                        <>
                          Câu tiếp theo ({currentIndex + 2}/10)
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Xem kết quả & Nhận danh hiệu
                          <Trophy className="w-4 h-4 text-amber-300" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* MÀN HÌNH TỔNG KẾT & VINH DANH DANH HIỆU HỌC SINH SAU 10 CÂU */}
          {isFinished && (
            <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-300 shadow-xl text-center space-y-6">
              {/* Badge Cúp vàng */}
              <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25 animate-bounce">
                <Trophy className="w-12 h-12 text-white" />
              </div>

              {/* Danh hiệu */}
              {(() => {
                const info = getStudentTitle(score);
                return (
                  <div className="space-y-2 max-w-lg mx-auto">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase border ${info.badgeColor}`}>
                      {info.title}
                    </span>
                    <h3 className="text-3xl font-black text-slate-900">
                      {score} / 100 Điểm
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {info.message}
                    </p>

                    <div className="flex items-center justify-center gap-1.5 pt-2">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-6 h-6 ${
                            s <= info.stars
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 fill-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Thống kê chi tiết */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Số câu đúng</span>
                  <p className="text-lg font-black text-emerald-700">{score / 10} / 10 câu</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Số câu sai</span>
                  <p className="text-lg font-black text-rose-600">{10 - score / 10} câu</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Chuỗi cao nhất</span>
                  <p className="text-lg font-black text-orange-600">x{maxStreak} liên tiếp</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Ngân hàng đề</span>
                  <p className="text-lg font-black text-indigo-700">100 câu</p>
                </div>
              </div>

              {/* Nút hành động sau trận đấu */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => startNewSession(selectedGenreFilter)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer scale-102"
                >
                  <Shuffle className="w-5 h-5" />
                  Chơi Lượt Mới (Đổi 10 Câu Khác & Đảo Đáp Án)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Chuyển sang thể loại khác
                    const nextIndex = (genreFilters.findIndex((g) => g.id === selectedGenreFilter) + 1) % genreFilters.length;
                    const nextGenre = genreFilters[nextIndex].id;
                    setSelectedGenreFilter(nextGenre);
                    startNewSession(nextGenre);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Đổi sang Thể loại khác
                </button>
              </div>

              {/* Bảng Chi Tiết Xem Lại 10 Câu Vừa Chơi (Ôn tập sư phạm) */}
              {answeredHistory.length > 0 && (
                <div className="text-left pt-6 border-t border-slate-100 space-y-3">
                  <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Xem Lại Lời Giải & Mẹo Sư Phạm Của 10 Câu Vừa Qua:
                  </h4>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {answeredHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                          item.isCorrect
                            ? "bg-emerald-50/40 border-emerald-200"
                            : "bg-rose-50/40 border-rose-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900">
                            Câu {idx + 1}: {item.question.question}
                          </span>
                          {item.isCorrect ? (
                            <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                              ✓ Đúng
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                              ✗ Chưa đúng
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 text-[11px]">
                          <strong>Đáp án đúng:</strong> {item.question.shuffledOptions[item.question.correctIndex]}
                        </p>
                        <p className="text-slate-700 text-[11px]">
                          💡 <strong>Giải thích:</strong> {item.question.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* PHẦN MINI GAMES BỔ TRỢ (4 TRÒ CHƠI TƯƠNG TÁC THỰC THỤ)              */}
      {/* ==================================================================== */}
      {activeTab === "mini-games" && (
        <MiniGamesSection
          currentUser={currentUser}
          soundEnabled={soundEnabled}
          onPlayTone={playTone}
        />
      )}
    </div>
  );
};
