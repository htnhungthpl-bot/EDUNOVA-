import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { api } from "../../services/api";
import confetti from "canvas-confetti";
import {
  SENTENCE_BUILDER_DATA,
  SPELLING_DETECTIVE_DATA,
  WORD_MASTER_DATA,
  SENTENCE_UPGRADER_DATA,
  SentenceBuilderItem,
  SpellingDetectiveItem,
  WordMasterItem,
  SentenceUpgraderItem,
} from "../../data/miniGamesData";
import {
  Award,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  RotateCcw,
  HelpCircle,
  BookOpen,
  Flame,
  Shuffle,
  RefreshCw,
  Search,
  Hammer,
  Layers,
  Check,
  Zap,
  Lightbulb,
  Edit3,
} from "lucide-react";

interface MiniGamesSectionProps {
  currentUser: User;
  soundEnabled: boolean;
  onPlayTone: (freq: number, type?: OscillatorType, duration?: number) => void;
}

export const MiniGamesSection: React.FC<MiniGamesSectionProps> = ({
  currentUser,
  soundEnabled,
  onPlayTone,
}) => {
  // Chọn trò chơi: "hub" | "xay-cau" | "tham-tu" | "vua-tu-ngu" | "tho-ren"
  const [activeGame, setActiveGame] = useState<
    "hub" | "xay-cau" | "tham-tu" | "vua-tu-ngu" | "tho-ren"
  >("hub");

  // ==========================================================================
  // 1. GAME 1: XÂY CẦU THẦN TỐC
  // ==========================================================================
  const [xcIndex, setXcIndex] = useState<number>(0);
  const [xcAvailable, setXcAvailable] = useState<string[]>([]);
  const [xcPlaced, setXcPlaced] = useState<string[]>([]);
  const [xcResult, setXcResult] = useState<"pending" | "correct" | "wrong">("pending");
  const [xcScore, setXcScore] = useState<number>(0);

  const currentXc = SENTENCE_BUILDER_DATA[xcIndex];

  // Khởi tạo vòng chơi Xây Cầu
  const startXcRound = (index: number) => {
    const item = SENTENCE_BUILDER_DATA[index];
    if (!item) return;
    setXcIndex(index);
    // Xáo trộn các từ có sẵn
    const shuffled = [...item.shuffledWords].sort(() => Math.random() - 0.5);
    setXcAvailable(shuffled);
    setXcPlaced([]);
    setXcResult("pending");
  };

  const handlePlaceWord = (word: string, indexInAvailable: number) => {
    if (xcResult === "correct") return;
    if (soundEnabled) onPlayTone(440, "sine", 0.08);
    setXcPlaced((prev) => [...prev, word]);
    setXcAvailable((prev) => prev.filter((_, idx) => idx !== indexInAvailable));
    setXcResult("pending");
  };

  const handleRemovePlacedWord = (word: string, indexInPlaced: number) => {
    if (xcResult === "correct") return;
    if (soundEnabled) onPlayTone(350, "sine", 0.08);
    setXcPlaced((prev) => prev.filter((_, idx) => idx !== indexInPlaced));
    setXcAvailable((prev) => [...prev, word]);
    setXcResult("pending");
  };

  const handleCheckBridge = async () => {
    if (xcPlaced.length === 0) return;
    const isCorrect = xcPlaced.join(" ") === currentXc.correctOrder.join(" ");

    if (isCorrect) {
      if (soundEnabled) {
        onPlayTone(587.33, "triangle", 0.1);
        setTimeout(() => onPlayTone(880, "sine", 0.3), 100);
      }
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      setXcResult("correct");
      const newScore = xcScore + 20;
      setXcScore(newScore);

      try {
        await api.recordGameResult({
          gameId: "xay-cau-than-toc",
          gameName: "Xây Cầu Thần Tốc",
          studentId: currentUser.id,
          studentName: currentUser.name,
          score: newScore,
          maxScore: SENTENCE_BUILDER_DATA.length * 20,
          stars: 3,
        });
      } catch (e) {
        console.warn("Lưu điểm Xây cầu:", e);
      }
    } else {
      if (soundEnabled) onPlayTone(220, "sawtooth", 0.25);
      setXcResult("wrong");
    }
  };

  // ==========================================================================
  // 2. GAME 2: THÁM TỬ CHÍNH TẢ
  // ==========================================================================
  const [ttIndex, setTtIndex] = useState<number>(0);
  const [ttSelectedWordIdx, setTtSelectedWordIdx] = useState<number | null>(null);
  const [ttStatus, setTtStatus] = useState<"hunting" | "found_error" | "solved" | "wrong_word">("hunting");
  const [ttScore, setTtScore] = useState<number>(0);

  const currentTt = SPELLING_DETECTIVE_DATA[ttIndex];

  const startTtRound = (index: number) => {
    setTtIndex(index);
    setTtSelectedWordIdx(null);
    setTtStatus("hunting");
  };

  const handleSelectWordInSentence = (idx: number) => {
    if (ttStatus === "solved") return;
    setTtSelectedWordIdx(idx);

    if (idx === currentTt.errorWordIndex) {
      if (soundEnabled) onPlayTone(659.25, "sine", 0.15);
      setTtStatus("found_error");
    } else {
      if (soundEnabled) onPlayTone(260, "sine", 0.1);
      setTtStatus("wrong_word");
    }
  };

  const handlePickFixOption = async (option: string) => {
    if (option === currentTt.correctWord) {
      if (soundEnabled) {
        onPlayTone(587.33, "triangle", 0.1);
        setTimeout(() => onPlayTone(880, "sine", 0.3), 100);
      }
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.7 } });
      setTtStatus("solved");
      const newScore = ttScore + 25;
      setTtScore(newScore);

      try {
        await api.recordGameResult({
          gameId: "tham-tu-chinh-ta",
          gameName: "Thám Tử Chính Tả",
          studentId: currentUser.id,
          studentName: currentUser.name,
          score: newScore,
          maxScore: SPELLING_DETECTIVE_DATA.length * 25,
          stars: 3,
        });
      } catch (e) {
        console.warn("Lưu điểm Thám tử:", e);
      }
    } else {
      if (soundEnabled) onPlayTone(220, "sawtooth", 0.25);
    }
  };

  // ==========================================================================
  // 3. GAME 3: VUA TỪ LÁY & TỪ GỢI CẢM
  // ==========================================================================
  const [vmIndex, setVmIndex] = useState<number>(0);
  const [vmSelectedOption, setVmSelectedOption] = useState<string | null>(null);
  const [vmScore, setVmScore] = useState<number>(0);
  const [vmStreak, setVmStreak] = useState<number>(0);

  const currentVm = WORD_MASTER_DATA[vmIndex];

  const handleSelectVmOption = async (opt: string) => {
    if (vmSelectedOption !== null) return;
    setVmSelectedOption(opt);
    const isCorrect = opt === currentVm.correctAnswer;

    if (isCorrect) {
      if (soundEnabled) {
        onPlayTone(587.33, "triangle", 0.1);
        setTimeout(() => onPlayTone(880, "sine", 0.25), 100);
      }
      const newScore = vmScore + 15;
      const newStreak = vmStreak + 1;
      setVmScore(newScore);
      setVmStreak(newStreak);

      try {
        await api.recordGameResult({
          gameId: "vua-tu-ngu",
          gameName: "Vua Từ Ngữ & Từ Láy",
          studentId: currentUser.id,
          studentName: currentUser.name,
          score: newScore,
          maxScore: WORD_MASTER_DATA.length * 15,
          stars: 3,
        });
      } catch (e) {
        console.warn("Lưu điểm Vua từ:", e);
      }
    } else {
      if (soundEnabled) onPlayTone(220, "sawtooth", 0.25);
      setVmStreak(0);
    }
  };

  // ==========================================================================
  // 4. GAME 4: THỢ RÈN CÂU VĂN
  // ==========================================================================
  const [trIndex, setTrIndex] = useState<number>(0);
  const [trAdverb, setTrAdverb] = useState<string>("");
  const [trVivid, setTrVivid] = useState<string>("");
  const [trComparison, setTrComparison] = useState<string>("");
  const [trCustom, setTrCustom] = useState<string>("");
  const [trFeedback, setTrFeedback] = useState<string | null>(null);

  const currentTr = SENTENCE_UPGRADER_DATA[trIndex];

  useEffect(() => {
    if (currentTr) {
      setTrAdverb(currentTr.adverbOptions[0] || "");
      setTrVivid(currentTr.vividWordOptions[0] || "");
      setTrComparison(currentTr.comparisonOptions[0] || "");
      setTrCustom("");
      setTrFeedback(null);
    }
  }, [trIndex]);

  // Tự động khởi tạo dữ liệu khi vào từng game
  useEffect(() => {
    if (activeGame === "xay-cau" && xcAvailable.length === 0 && xcPlaced.length === 0) {
      startXcRound(0);
    } else if (activeGame === "tham-tu" && ttSelectedWordIdx === null && ttStatus === "hunting") {
      startTtRound(0);
    }
  }, [activeGame]);

  const handleEvaluateCustomSentence = () => {
    const text = (trCustom || "").trim();
    if (!text) {
      setTrFeedback("Em hãy nhập câu văn của mình trước nhé!");
      return;
    }

    if (soundEnabled) {
      onPlayTone(587.33, "triangle", 0.1);
      setTimeout(() => onPlayTone(880, "sine", 0.25), 100);
    }
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });

    // Đánh giá nhanh về sự hiện diện của so sánh hoặc nhân hóa
    const lower = text.toLowerCase();
    const hasComparison = lower.includes("như") || lower.includes("tựa như") || lower.includes("giống như");
    const hasPersonification = lower.includes("bác") || lower.includes("chú") || lower.includes("anh") || lower.includes("chị");

    if (hasComparison && hasPersonification) {
      setTrFeedback("🌟 Xuất sắc tuyệt vời! Câu văn kết hợp cả nhân hóa lẫn so sánh rất tự nhiên và đạt Mức 4 Rubric!");
    } else if (hasComparison) {
      setTrFeedback("✨ Rất giỏi! Câu văn có hình ảnh so sánh sinh động, giúp sự vật hiện lên rõ nét trong tâm trí người đọc.");
    } else if (hasPersonification) {
      setTrFeedback("✨ Rất hay! Em đã nhân hóa sự vật khiến câu văn trở nên ấm áp và gần gũi như một người bạn.");
    } else {
      setTrFeedback("👍 Câu văn trôi chảy và đúng ngữ pháp! Em hãy thử thêm từ 'như' để tạo hình ảnh so sánh độc đáo hơn nhé.");
    }
  };

  // Thanh chuyển đổi nhanh trực tiếp giữa 4 trò chơi
  const renderGameSwitcherBar = () => (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold flex-wrap">
      <button
        type="button"
        onClick={() => {
          setActiveGame("xay-cau");
          startXcRound(xcIndex);
        }}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
          activeGame === "xay-cau" ? "bg-emerald-600 text-white shadow-xs font-black" : "text-slate-600 hover:text-emerald-800"
        }`}
      >
        <span>🌉 Xây Cầu</span>
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveGame("tham-tu");
          startTtRound(ttIndex);
        }}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
          activeGame === "tham-tu" ? "bg-blue-600 text-white shadow-xs font-black" : "text-slate-600 hover:text-blue-800"
        }`}
      >
        <span>🕵️ Thám Tử</span>
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveGame("vua-tu-ngu");
          setVmSelectedOption(null);
        }}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
          activeGame === "vua-tu-ngu" ? "bg-amber-500 text-white shadow-xs font-black" : "text-slate-600 hover:text-amber-800"
        }`}
      >
        <span>👑 Vua Từ Láy</span>
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveGame("tho-ren");
        }}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
          activeGame === "tho-ren" ? "bg-rose-600 text-white shadow-xs font-black" : "text-slate-600 hover:text-rose-800"
        }`}
      >
        <span>⚒️ Thợ Rèn</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* 1. MÀN HÌNH TRUNG TÂM (HUB): CHỌN TRONG 4 TRÒ CHƠI BỔ TRỢ             */}
      {/* ==================================================================== */}
      {activeGame === "hub" && (
        <div className="space-y-6">
          <div className="bg-linear-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-teal-100 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Luyện Tập Kĩ Năng Chuyên Sâu
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              4 Mini Games Bổ Trợ Kỹ Năng Viết Lớp 4
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl mt-1 leading-relaxed">
              Các trò chơi được thiết kế theo chuẩn sư phạm giúp học sinh rèn luyện từng viên gạch ngôn ngữ: 
              từ nối, trật tự câu, chính tả và biện pháp tu từ so sánh - nhân hóa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Game 1 Card */}
            <div
              onClick={() => {
                setActiveGame("xay-cau");
                startXcRound(0);
              }}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🌉
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                  {SENTENCE_BUILDER_DATA.length} Vòng Chơi
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  1. Xây Cầu Thần Tốc
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                  Sắp xếp các mảnh ghép từ ngữ bị đảo lộn theo đúng trật tự câu văn lớp 4 (Trạng ngữ $\rightarrow$ Chủ ngữ $\rightarrow$ Vị ngữ $\rightarrow$ So sánh).
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-emerald-700">
                <span>Điểm tích lũy: {xcScore}đ</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Vào chơi ngay <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Game 2 Card */}
            <div
              onClick={() => {
                setActiveGame("tham-tu");
                startTtRound(0);
              }}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🔍
                </div>
                <span className="bg-blue-50 text-blue-800 text-[11px] font-black uppercase px-2.5 py-1 rounded-full border border-blue-200">
                  {SPELLING_DETECTIVE_DATA.length} Vụ Án
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                  2. Thám Tử Chính Tả
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                  Đóng vai Thám tử nhí soi kính lúp tìm từ viết sai chính tả (l/n, s/x, tr/ch, d/gi/r, hỏi/ngã) và sửa lại chuẩn mực.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-blue-700">
                <span>Điểm tích lũy: {ttScore}đ</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Vào phá án <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Game 3 Card */}
            <div
              onClick={() => setActiveGame("vua-tu-ngu")}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👑
                </div>
                <span className="bg-amber-50 text-amber-800 text-[11px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-200">
                  {WORD_MASTER_DATA.length} Thách Đấu
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  3. Vua Từ Láy & Từ Gợi Cảm
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                  Chọn từ láy đắt giá nhất để miêu tả màu sắc, âm thanh, dáng vẻ, chuyển động của sự vật trong bài văn miêu tả.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-amber-700">
                <span className="flex items-center gap-1">
                  Điểm: {vmScore}đ {vmStreak > 0 && <span className="text-orange-600">🔥 x{vmStreak}</span>}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Đấu trí ngay <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Game 4 Card */}
            <div
              onClick={() => setActiveGame("tho-ren")}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all cursor-pointer group space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⚒️
                </div>
                <span className="bg-rose-50 text-rose-800 text-[11px] font-black uppercase px-2.5 py-1 rounded-full border border-rose-200">
                  {SENTENCE_UPGRADER_DATA.length} Cấp Độ
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 group-hover:text-rose-700 transition-colors">
                  4. Thợ Rèn Câu Văn (Nâng Cấp Mức 4)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
                  Rèn giũa một câu mộc mạc thành câu văn giàu hình ảnh so sánh, nhân hóa và tự tay sáng tác câu của em để Cú Vàng chấm điểm.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-rose-700">
                <span>Rèn câu Mức 4 Rubric</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Vào rèn câu <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. GIAO DIỆN CHƠI GAME 1: XÂY CẦU THẦN TỐC                            */}
      {/* ==================================================================== */}
      {activeGame === "xay-cau" && currentXc && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveGame("hub")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Tất cả Game
              </button>
              {renderGameSwitcherBar()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Vòng {xcIndex + 1}/{SENTENCE_BUILDER_DATA.length}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                {xcScore} Điểm
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentXc.topicIcon}</span>
              <h3 className="text-lg font-black text-slate-900">
                Xây Cầu Thần Tốc: Chủ đề "{currentXc.topic}"
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Em hãy nhấp vào các khối từ ngữ ở dưới theo đúng thứ tự để xây dựng chiếc cầu hoàn chỉnh nhé:
            </p>
          </div>

          {/* VÙNG CHIẾC CẦU ĐANG XÂY (PLACED WORDS) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>🌉 Nhịp cầu đang ghép:</span>
              <span className="text-slate-400 font-normal">({xcPlaced.length} / {currentXc.correctOrder.length} khối từ)</span>
            </label>

            <div
              className={`p-5 rounded-2xl border-2 min-h-24 flex flex-wrap items-center gap-2 transition-all ${
                xcResult === "correct"
                  ? "bg-emerald-50/80 border-emerald-400"
                  : xcResult === "wrong"
                  ? "bg-rose-50/80 border-rose-300"
                  : "bg-slate-50/80 border-dashed border-slate-300"
              }`}
            >
              {xcPlaced.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Chưa có khối từ nào được đặt lên cầu. Hãy nhấp chọn các khối từ bên dưới...
                </p>
              ) : (
                xcPlaced.map((w, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRemovePlacedWord(w, idx)}
                    className="px-3.5 py-2 rounded-xl bg-white border-2 border-emerald-500 text-emerald-950 font-bold text-xs sm:text-sm shadow-xs hover:bg-rose-50 hover:border-rose-400 hover:text-rose-700 transition-all flex items-center gap-1.5 cursor-pointer group"
                    title="Bấm để gỡ khối từ này về"
                  >
                    <span>{w}</span>
                    <span className="text-[10px] text-slate-300 group-hover:text-rose-500">✕</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* CÁC KHỐI TỪ CÒN LẠI ĐỂ CHỌN (AVAILABLE WORDS) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              👉 Các khối từ ngữ có sẵn (Nhấp để đưa lên cầu):
            </label>
            <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              {xcAvailable.length === 0 ? (
                <p className="text-xs text-emerald-700 font-bold">
                  ✓ Toàn bộ các khối từ đã được đặt lên cầu. Em hãy bấm "Kiểm tra cầu" nhé!
                </p>
              ) : (
                xcAvailable.map((w, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePlaceWord(w, idx)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-800 hover:text-emerald-800 font-bold text-xs sm:text-sm shadow-xs hover:scale-103 transition-all cursor-pointer"
                  >
                    + {w}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* KẾT QUẢ & PHẢN HỒI SƯ PHẠM */}
          {xcResult === "correct" && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Cây cầu hoàn thành xuất sắc! (+20 Điểm)
              </div>
              <p className="font-bold text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-emerald-200">
                "{currentXc.correctOrder.join(" ")}"
              </p>
              <p className="text-slate-700 leading-relaxed">
                💡 <strong className="text-slate-900">Quy tắc ngữ pháp:</strong> {currentXc.grammarExplanation}
              </p>
              <p className="text-emerald-800 italic pt-1 border-t border-emerald-200/60 font-medium">
                ✨ {currentXc.pedagogicalTip}
              </p>
            </div>
          )}

          {xcResult === "wrong" && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-900 space-y-1 animate-in shake">
              <div className="flex items-center gap-2 font-black">
                <XCircle className="w-4 h-4 text-rose-600" />
                Trật tự từ chưa thật chuẩn xác.
              </div>
              <p className="text-slate-600">
                Em hãy thử bấm vào các khối từ trên cầu để xếp lại trật tự cho mạch lạc hơn nhé!
              </p>
            </div>
          )}

          {/* NÚT THAO TÁC */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-3">
            <button
              type="button"
              onClick={() => startXcRound(xcIndex)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Xếp lại vòng này
            </button>

            <div className="flex items-center gap-2">
              {xcResult !== "correct" ? (
                <button
                  type="button"
                  onClick={handleCheckBridge}
                  disabled={xcPlaced.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Kiểm tra cầu
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const next = (xcIndex + 1) % SENTENCE_BUILDER_DATA.length;
                    startXcRound(next);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer scale-102"
                >
                  Sang vòng tiếp theo ({((xcIndex + 1) % SENTENCE_BUILDER_DATA.length) + 1}/{SENTENCE_BUILDER_DATA.length})
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. GIAO DIỆN CHƠI GAME 2: THÁM TỬ CHÍNH TẢ                            */}
      {/* ==================================================================== */}
      {activeGame === "tham-tu" && currentTt && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveGame("hub")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Tất cả Game
              </button>
              {renderGameSwitcherBar()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Vụ án {ttIndex + 1}/{SPELLING_DETECTIVE_DATA.length}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
                {ttScore} Điểm
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🕵️‍♂️</span>
              <h3 className="text-lg font-black text-slate-900">
                Hồ Sơ Vụ Án: Truy Tìm Từ Viết Sai Chính Tả
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Trong câu dưới đây có một từ viết sai chính tả. Em hãy nhấp vào từ đó để kích hoạt kính lúp thám tử:
            </p>
          </div>

          {/* CÂU VĂN VỚI TỪNG TỪ ĐỂ NHẤP CHỌN */}
          <div className="p-6 rounded-2xl bg-blue-50/50 border-2 border-blue-200 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              {currentTt.sentenceWords.map((word, idx) => {
                const isSelected = ttSelectedWordIdx === idx;
                const isError = idx === currentTt.errorWordIndex;
                const isSolved = ttStatus === "solved" && isError;

                let chipStyle = "bg-white border-slate-200 text-slate-800 hover:border-blue-400";
                if (isSolved) {
                  chipStyle = "bg-emerald-600 border-emerald-600 text-white font-black scale-105";
                } else if (isSelected && isError) {
                  chipStyle = "bg-amber-500 border-amber-600 text-white font-black scale-105 animate-pulse";
                } else if (isSelected && !isError) {
                  chipStyle = "bg-rose-100 border-rose-300 text-rose-800";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectWordInSentence(idx)}
                    className={`px-3 py-2 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${chipStyle}`}
                  >
                    {isSolved ? currentTt.correctWord : word}
                  </button>
                );
              })}
            </div>

            {ttStatus === "wrong_word" && (
              <p className="text-xs text-amber-800 font-semibold flex items-center gap-1.5 pt-1">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Từ này viết hoàn toàn đúng chính tả rồi em nhé. Hãy đọc kỹ và tìm từ khác!
              </p>
            )}
          </div>

          {/* BƯỚC 2: CHỌN PHƯƠNG ÁN SỬA ĐÚNG (KHI ĐÃ BẮT TRÚNG TỪ SAI) */}
          {(ttStatus === "found_error" || ttStatus === "solved") && (
            <div className="p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-xs space-y-3 animate-in zoom-in-95">
              <h4 className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-600" />
                Đã phát hiện từ viết sai: <span className="underline text-rose-600 font-black">"{currentTt.errorWord}"</span>. Chọn cách sửa đúng:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentTt.options.map((opt, oIdx) => {
                  const isCorrect = opt === currentTt.correctWord;
                  const isSolved = ttStatus === "solved";

                  let btnStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50 hover:border-emerald-400";
                  if (isSolved && isCorrect) {
                    btnStyle = "bg-emerald-600 border-emerald-600 text-white font-black";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handlePickFixOption(opt)}
                      disabled={isSolved}
                      className={`p-3 rounded-xl border-2 text-xs sm:text-sm font-bold text-center transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {ttStatus === "solved" && (
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Phá án chính xác! Từ đúng là "{currentTt.correctWord}" (+25 Điểm)
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    💡 <strong>Quy tắc chính tả:</strong> {currentTt.ruleExplanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CHUYỂN VỤ ÁN TIẾP THEO */}
          {ttStatus === "solved" && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  const next = (ttIndex + 1) % SPELLING_DETECTIVE_DATA.length;
                  startTtRound(next);
                }}
                className="px-6 py-2.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer scale-102"
              >
                Vụ án tiếp theo ({((ttIndex + 1) % SPELLING_DETECTIVE_DATA.length) + 1}/{SPELLING_DETECTIVE_DATA.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. GIAO DIỆN CHƠI GAME 3: VUA TỪ LÁY & TỪ GỢI CẢM                     */}
      {/* ==================================================================== */}
      {activeGame === "vua-tu-ngu" && currentVm && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveGame("hub")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Tất cả Game
              </button>
              {renderGameSwitcherBar()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Câu {vmIndex + 1}/{WORD_MASTER_DATA.length}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                {vmScore} Điểm
              </span>
              {vmStreak > 1 && (
                <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-black flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> x{vmStreak}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
              {currentVm.tag}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {currentVm.prompt}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100 font-medium">
              "{currentVm.context}"
            </p>
          </div>

          {/* 4 LỰA CHỌN TỪ LÁY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentVm.options.map((opt, oIdx) => {
              const isSelected = vmSelectedOption === opt;
              const isCorrect = opt === currentVm.correctAnswer;
              const hasAnswered = vmSelectedOption !== null;

              let btnStyle = "bg-white border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-400";
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-600 border-emerald-600 text-white font-black shadow-md";
                } else if (isSelected) {
                  btnStyle = "bg-rose-600 border-rose-600 text-white font-black";
                } else {
                  btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectVmOption(opt)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                  {hasAnswered && isCorrect && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>

          {/* GIẢI THÍCH SAU KHI CHỌN */}
          {vmSelectedOption !== null && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 animate-in zoom-in-95">
              <p className="font-bold text-slate-800">
                💡 <strong>Giải nghĩa:</strong> {currentVm.explanation}
              </p>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = (vmIndex + 1) % WORD_MASTER_DATA.length;
                    setVmIndex(next);
                    setVmSelectedOption(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  Câu tiếp theo ({((vmIndex + 1) % WORD_MASTER_DATA.length) + 1}/{WORD_MASTER_DATA.length})
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. GIAO DIỆN CHƠI GAME 4: THỢ RÈN CÂU VĂN                            */}
      {/* ==================================================================== */}
      {activeGame === "tho-ren" && currentTr && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveGame("hub")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Tất cả Game
              </button>
              {renderGameSwitcherBar()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Thử thách {trIndex + 1}/{SENTENCE_UPGRADER_DATA.length}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚒️</span>
              <h3 className="text-lg font-black text-slate-900">
                Đe Rèn Câu Văn Lớp 4: Nâng Cấp Câu Mộc Mạc Lên Mức 4
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {currentTr.context}
            </p>
          </div>

          {/* Câu mộc mạc ban đầu */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 text-xs">
            <span className="font-extrabold text-slate-500 uppercase text-[10px]">Câu gốc ban đầu:</span>
            <span className="font-black text-slate-800 text-sm">"{currentTr.baseSentence}"</span>
          </div>

          {/* CÁC NÚT CHỌN THÀNH PHẦN RÈN CÂU */}
          <div className="space-y-4">
            {/* 1. Trạng ngữ */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">1</span>
                Chọn Trạng ngữ mở rộng thời gian / không gian:
              </label>
              <div className="flex flex-wrap gap-2">
                {currentTr.adverbOptions.map((adv, aIdx) => (
                  <button
                    key={aIdx}
                    type="button"
                    onClick={() => setTrAdverb(adv)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      trAdverb === adv
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {adv}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Từ ngữ gợi cảm */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-amber-800 uppercase flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">2</span>
                Chọn Từ ngữ chỉ đặc điểm màu sắc / hành động:
              </label>
              <div className="flex flex-wrap gap-2">
                {currentTr.vividWordOptions.map((viv, vIdx) => (
                  <button
                    key={vIdx}
                    type="button"
                    onClick={() => setTrVivid(viv)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      trVivid === viv
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {viv}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Hình ảnh so sánh */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-rose-800 uppercase flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px]">3</span>
                Chọn Hình ảnh so sánh / nhân hóa đắt giá:
              </label>
              <div className="flex flex-wrap gap-2">
                {currentTr.comparisonOptions.map((comp, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => setTrComparison(comp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      trComparison === comp
                        ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* XEM TRƯỚC SIÊU CÂU VĂN ĐÃ RÈN XONG */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-emerald-800">
              ✨ Siêu câu văn mẫu sau khi rèn giũa (Mức 4 Rubric):
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed font-sans">
              "{currentTr.sampleSuperSentence}"
            </p>
            <p className="text-xs text-slate-600">{currentTr.explanation}</p>
          </div>

          {/* HỌC SINH TỰ RÈN CÂU CỦA RIÊNG MÌNH */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              Thử tài của em: Hãy gõ một câu văn sáng tạo của riêng em cho sự vật trên:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trCustom}
                onChange={(e) => setTrCustom(e.target.value)}
                placeholder="Ví dụ: Mỗi buổi sớm mai, vầng thái dương đỏ rực như quả cầu lửa nhô lên khỏi rặng tre..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleEvaluateCustomSentence}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Cú Vàng Nhận Xét
              </button>
            </div>

            {trFeedback && (
              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 animate-in fade-in">
                🦉 {trFeedback}
              </div>
            )}
          </div>

          {/* CHUYỂN CÂU TIẾP THEO */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                const next = (trIndex + 1) % SENTENCE_UPGRADER_DATA.length;
                setTrIndex(next);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Đổi sang thử thách khác ({((trIndex + 1) % SENTENCE_UPGRADER_DATA.length) + 1}/{SENTENCE_UPGRADER_DATA.length})
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
