import React, { useState } from "react";
import { User, Assignment } from "../types";
import { Sparkles, BookOpen, PenTool, Award, Gamepad2, ArrowRight, CheckCircle2, Star, Flame, Lightbulb, FileText, ScanLine, Compass } from "lucide-react";
import { EdunovaCoverHero } from "../components/EdunovaCoverHero";
import { CoverPreviewModal } from "../components/CoverPreviewModal";

interface HomeViewProps {
  currentUser: User;
  onNavigate: (tab: string, extraData?: any) => void;
  assignments: Assignment[];
  availableUsers?: User[];
  onSelectUser?: (user: User) => void;
  onLoginCustom?: (email: string) => Promise<void>;
  onOpenAuthModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  onNavigate,
  assignments,
  availableUsers = [],
  onSelectUser = () => {},
  onLoginCustom = async () => {},
  onOpenAuthModal = () => {},
}) => {
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const pendingAssignments = assignments.filter((a) => a.status === "Đã giao" || a.status === "Đang thực hiện");

  return (
    <div className="space-y-12 pb-10">
      {/* Master Cover & Hero Section (16:9 Master Design) */}
      <EdunovaCoverHero
        currentUser={currentUser}
        availableUsers={availableUsers}
        onSelectUser={onSelectUser}
        onLoginCustom={onLoginCustom}
        onOpenAuthModal={onOpenAuthModal}
        onNavigate={onNavigate}
        onOpenFullscreenCover={() => setCoverModalOpen(true)}
      />

      {/* Modal Xem Ảnh Bìa Toàn Màn Hình Tỷ Lệ 16:9 */}
      <CoverPreviewModal
        isOpen={coverModalOpen}
        onClose={() => setCoverModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Phân hệ nổi bật: AI Scan & Rubric */}
      <section className="bg-linear-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-3xl p-6 sm:p-7 border-2 border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <ScanLine className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Mới ra mắt</span>
              <span className="text-xs font-bold text-teal-800">Tải tệp Word (.docx) hoặc Chụp ảnh bài viết</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">AI Scan & Rubric – Đánh Giá 6 Tiêu Chí Chuẩn Bộ GD&ĐT</h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Trích xuất văn bản từ bài làm của em, cho phép kiểm tra và sửa lỗi nhận dạng, sau đó đánh giá theo Rubric 4 mức độ, chỉ ra điểm mạnh có trích dẫn và hướng dẫn em tự sửa bài.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("scan")}
          className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          Trải nghiệm AI Scan & Rubric <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 3 Writing Levels - Lộ trình 3 cấp độ */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
              Lộ trình bài bản
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              3 Cấp Độ Luyện Viết Toàn Diện
            </h2>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Từ nền tảng câu đúng đến bài văn sinh động có hình ảnh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cấp độ 1 */}
          <div
            onClick={() => onNavigate("writing", { level: "cau" })}
            className="group cursor-pointer bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                🌱
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                  Cấp độ 1
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Luyện Câu Đúng & Hay</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rèn cách sắp xếp từ, sửa lỗi câu cụt/lửng, mở rộng câu với trạng ngữ và vận dụng so sánh, nhân hóa.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Sắp xếp từ xáo trộn thành câu
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Thêm từ gợi tả màu sắc, âm thanh
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Tự viết câu theo cảm xúc riêng
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
              <span>Bắt đầu luyện câu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Cấp độ 2 */}
          <div
            onClick={() => onNavigate("writing", { level: "doan" })}
            className="group cursor-pointer bg-white rounded-3xl p-6 border-2 border-orange-100 hover:border-orange-400 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                🌿
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-orange-600 uppercase bg-orange-50 px-2 py-0.5 rounded-md">
                  Cấp độ 2
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Luyện Đoạn Mạch Lạc</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Biết viết câu mở đoạn, triển khai các câu thân đoạn liên kết chặt chẽ và câu kết đoạn ấn tượng.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Xác định ý chính & câu chủ đề
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Dùng từ nối câu, tránh lặp từ
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Viết đoạn 4–7 câu hoàn chỉnh
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-700 group-hover:text-orange-900">
              <span>Bắt đầu luyện đoạn</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Cấp độ 3 */}
          <div
            onClick={() => onNavigate("writing", { level: "bai" })}
            className="group cursor-pointer bg-white rounded-3xl p-6 border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                🌳
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                  Cấp độ 3
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Luyện Bài Văn Hoàn Chỉnh</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lập dàn ý 3 phần, mở bài gián tiếp, thân bài tả theo giác quan và kết bài mở rộng dạt dào cảm xúc.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Phân tích đề & Lập dàn ý chi tiết
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Tả từ bao quát đến chi tiết đặc sắc
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Tự so sánh 2 phiên bản để hoàn thiện
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-900">
              <span>Bắt đầu luyện bài văn</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* BANNER NỔI BẬT: KHO ĐỀ VĂN LỚP 4 KẾT NỐI TRI THỨC */}
      <section className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-700/50">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 bg-radial from-amber-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Phân hệ mới: Kho Đề Tập Làm Văn Lớp 4</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Khám Phá Toàn Bộ Dạng Bài & Đề Thực Hành Theo Sách Kết Nối Tri Thức
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Bao trọn 8 thể loại trọng tâm Tập Một & Tập Hai: Thuật lại sự việc, Viết đơn, Đoạn văn nêu ý kiến, Miêu tả con vật, Đoạn văn tình cảm, Miêu tả cây cối, Hướng dẫn công việc và Tưởng tượng. Tích hợp AI gợi ý dàn ý, vốn từ hay và chấm Rubric tự động!
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onNavigate("prompts")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm shadow-md transition-all active:scale-95"
            >
              <Compass className="w-4 h-4 text-emerald-950" />
              <span>Vào Kho Đề Văn Ngay</span>
              <ArrowRight className="w-4 h-4 text-emerald-950" />
            </button>
          </div>
        </div>
      </section>

      {/* Nhiệm vụ đang chờ & Trò chơi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Nhiệm vụ được giao */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Nhiệm Vụ Của Em</h3>
                <p className="text-xs text-slate-500">Các bài tập cô giáo đã giao cho lớp</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("assignments")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Xem tất cả ({assignments.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {pendingAssignments.slice(0, 3).map((asg) => (
              <div
                key={asg.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex items-start justify-between gap-4"
              >
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
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Hạn nộp: {asg.dueDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{asg.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1">{asg.prompt}</p>
                </div>
                <button
                  onClick={() => onNavigate("writing", { assignment: asg })}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-colors"
                >
                  Làm bài
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trò chơi & Huy hiệu tích lũy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-linear-to-tr from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  Góc vui học
                </span>
                <span className="flex items-center gap-1 text-xs font-bold bg-amber-900/30 px-2 py-0.5 rounded-lg">
                  <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Chuỗi 5 ngày
                </span>
              </div>
              <h3 className="text-xl font-black">4 Trò Chơi Ngôn Ngữ Hấp Dẫn</h3>
              <p className="text-xs text-amber-100 leading-relaxed">
                Rèn luyện khả năng phát hiện từ ngữ, ghép câu thần tốc và bắt lỗi chính tả cùng các bạn trong lớp.
              </p>
              <button
                onClick={() => onNavigate("games", { gamesTab: "mini-games" })}
                className="w-full py-2.5 rounded-xl bg-white text-orange-600 hover:bg-amber-50 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" /> Khám phá các trò chơi
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Mẹo hay viết văn hôm nay
              </h4>
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Khi miêu tả một cái cây hay một con vật, em hãy tưởng tượng mình đang đứng thật gần: chạm tay vào lớp vỏ, nghe tiếng lá xào xạc và ngửi mùi hương hoa thoang thoảng."
            </p>
            <div className="text-right">
              <button
                onClick={() => onNavigate("materials")}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Vào kho học liệu lớp 4 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
