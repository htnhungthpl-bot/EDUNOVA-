import React, { useState } from "react";
import { X, Maximize2, Download, CheckCircle2, Sparkles, Star, Palette, Layers, Info } from "lucide-react";
import { User } from "../types";

interface CoverPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const CoverPreviewModal: React.FC<CoverPreviewModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<"cover" | "specs">("cover");

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Modal Topbar */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-lg shadow-md">
              🦉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  Ảnh Bìa & Nhận Diện Web App EDUNOVA WRITING COACH
                </h3>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                  16:9 • 1920 × 1080 px
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thiết kế đồ họa EdTech chuẩn Chương trình GDPT 2018 Lớp 4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-700/60 p-1 rounded-xl text-xs font-bold mr-2">
              <button
                onClick={() => setActiveTab("cover")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "cover" ? "bg-emerald-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Khung Ảnh Bìa 16:9
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === "specs" ? "bg-emerald-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Hồ Sơ Thiết Kế
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>In / Lưu PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950">
          {activeTab === "cover" ? (
            <div className="space-y-4">
              {/* 16:9 Exact Aspect Ratio Canvas Container */}
              <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/40 bg-linear-to-br from-emerald-950 via-teal-950 to-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                {/* Top Bar of Cover */}
                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg text-xl">
                      🦉
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-white">EDUNOVA</span>
                        <span className="text-xs font-black tracking-widest text-amber-300 uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                          WRITING COACH
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-200 font-semibold tracking-wider uppercase">
                        VIẾT HAY HƠN MỖI NGÀY
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Lớp 4 • Giáo Dục Phổ Thông 2018</span>
                  </div>
                </div>

                {/* Main 2-Zone Body */}
                <div className="relative z-10 grid grid-cols-12 gap-6 my-auto items-center">
                  {/* Left Zone: 58% */}
                  <div className="col-span-7 space-y-4 pr-2">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                      VIẾT HAY HƠN <br />
                      <span className="bg-linear-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                        MỖI NGÀY
                      </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-lg">
                      “Cùng AI khám phá ý tưởng, luyện viết và hoàn thiện bài văn bằng chính suy nghĩ của em.”
                    </p>

                    {/* Visual Scene: 2 Students + AI Robot */}
                    <div className="grid grid-cols-12 gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5">
                      <div className="col-span-8 flex items-center gap-2.5">
                        <div className="flex-1 bg-white/95 rounded-xl p-2.5 text-center text-slate-900 shadow-md">
                          <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden ring-2 ring-rose-500 mb-1 relative">
                            <img
                              src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
                              alt="Bé Minh An áo polo đỏ"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[8px] font-black uppercase">
                              Polo Đỏ
                            </span>
                          </div>
                          <p className="text-[11px] font-black">Bé Minh An</p>
                          <p className="text-[9px] text-emerald-700 font-bold">Viết vở ô ly</p>
                        </div>

                        <div className="flex-1 bg-white/95 rounded-xl p-2.5 text-center text-slate-900 shadow-md">
                          <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden ring-2 ring-rose-500 mb-1 relative">
                            <img
                              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80"
                              alt="Bé Phương Thảo áo polo đỏ"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[8px] font-black uppercase">
                              Polo Đỏ
                            </span>
                          </div>
                          <p className="text-[11px] font-black">Bé Phương Thảo</p>
                          <p className="text-[9px] text-orange-700 font-bold">Trao đổi ý tưởng</p>
                        </div>
                      </div>

                      <div className="col-span-4 bg-teal-600/30 border border-teal-400/40 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                        <span className="text-2xl animate-pulse">🤖</span>
                        <p className="text-[10px] font-black text-amber-300 mt-1">Robot AI Thân Thiện</p>
                        <p className="text-[8px] text-emerald-100 font-medium">Gợi ý từ khóa • Không viết thay</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Zone: 42% Login Card Mockup */}
                  <div className="col-span-5">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-white/60 text-slate-900">
                      <div className="text-center pb-2.5 border-b border-slate-100">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">
                          Chào mừng bạn đến với EDUNOVA
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Đăng nhập để bắt đầu hành trình viết hay hơn.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-1 my-2 bg-slate-100 p-1 rounded-xl text-center text-[10px] font-bold">
                        <div className="py-1 bg-white text-emerald-800 rounded-lg shadow-xs">Học sinh</div>
                        <div className="py-1 text-slate-600">Giáo viên</div>
                        <div className="py-1 text-slate-600">Quản trị viên</div>
                      </div>

                      <div className="space-y-1.5 text-[10px]">
                        <div>
                          <div className="text-slate-500 font-bold mb-0.5">Tên đăng nhập hoặc email</div>
                          <div className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800">
                            hocsinh@edunova.edu.vn
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-slate-500 font-bold mb-0.5">
                            <span>Mật khẩu</span>
                            <span className="text-emerald-700">Quên mật khẩu?</span>
                          </div>
                          <div className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800">
                            ••••••••
                          </div>
                        </div>

                        <div className="w-full py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-black text-center shadow-md text-xs mt-2">
                          Đăng nhập
                        </div>

                        <div className="text-center text-[9px] text-slate-500 pt-1">
                          Chưa có tài khoản? <span className="font-bold text-emerald-700">Đăng ký ngay</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: 5 Skill Badges & Inspiring Motto */}
                <div className="relative z-10 pt-3 border-t border-white/10 space-y-2">
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-[9px] font-black text-emerald-200">
                      1. VIẾT CÂU ĐÚNG
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-teal-500/20 border border-teal-400/30 text-[9px] font-black text-teal-200">
                      2. VIẾT CÂU HAY
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-[9px] font-black text-amber-200">
                      3. VIẾT CÂU CÓ HÌNH ẢNH
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-orange-500/20 border border-orange-400/30 text-[9px] font-black text-orange-200">
                      4. VIẾT ĐOẠN MẠCH LẠC
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-rose-500/20 border border-rose-400/30 text-[9px] font-black text-rose-200">
                      5. VIẾT BÀI HOÀN CHỈNH
                    </div>
                  </div>

                  <p className="text-center text-[11px] font-bold text-amber-300 italic">
                    “Mỗi bài viết là một bước tiến đến phiên bản tốt hơn của chính mình!”
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Khung hiển thị mô phỏng 1920 × 1080 px chuẩn Web App Hero Banner.</span>
                <span className="text-emerald-400 font-semibold">Tự động tương thích với mọi kích thước màn hình</span>
              </div>
            </div>
          ) : (
            /* Specification Sheet */
            <div className="space-y-6 text-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                    <Sparkles className="w-4 h-4" />
                    <h4>1. Thông Tin Nhận Diện Thương Hiệu</h4>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li><strong className="text-white">Tên thương hiệu:</strong> EDUNOVA</li>
                    <li><strong className="text-white">Tên sản phẩm:</strong> WRITING COACH</li>
                    <li><strong className="text-white">Tiêu đề chính:</strong> VIẾT HAY HƠN MỖI NGÀY</li>
                    <li><strong className="text-white">Câu giới thiệu:</strong> “Cùng AI khám phá ý tưởng, luyện viết và hoàn thiện bài văn bằng chính suy nghĩ của em.”</li>
                    <li><strong className="text-white">Đối tượng mục tiêu:</strong> Học sinh lớp 4 (9–10 tuổi), Giáo viên tiểu học, Nhà trường.</li>
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <Palette className="w-4 h-4" />
                    <h4>2. Bảng Màu & Ngôn Ngữ Thiết Kế</h4>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li><strong className="text-emerald-400">Xanh lá (Emerald & Teal):</strong> Biểu tượng cho sự phát triển, sinh động và tiến bộ.</li>
                    <li><strong className="text-amber-400">Cam & Vàng hổ phách:</strong> Năng lượng, sự sáng tạo và hứng thú học tập.</li>
                    <li><strong className="text-rose-400">Đỏ cam (Polo Đỏ):</strong> Màu nhấn thương hiệu, đồng phục học sinh tiểu học Việt Nam.</li>
                    <li><strong className="text-white">Trắng & Kem nhạt:</strong> Giao diện thoáng đãng, tương phản cao, dễ đọc.</li>
                    <li><strong className="text-cyan-400">Cyan AI:</strong> Ánh hào quang công nghệ trợ lý thân thiện, tiết chế.</li>
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-orange-400 font-black text-sm">
                    <Layers className="w-4 h-4" />
                    <h4>3. Hệ Thống 5 Thẻ Kỹ Năng</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="font-bold text-emerald-300">1. VIẾT CÂU ĐÚNG</span>
                      <span className="text-slate-400">Đúng ngữ pháp, đủ chủ vị, dấu câu</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="font-bold text-teal-300">2. VIẾT CÂU HAY</span>
                      <span className="text-slate-400">Mở rộng trạng ngữ, từ gợi cảm</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="font-bold text-amber-300">3. VIẾT CÂU CÓ HÌNH ẢNH</span>
                      <span className="text-slate-400">So sánh, nhân hóa, âm thanh</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="font-bold text-orange-300">4. VIẾT ĐOẠN MẠCH LẠC</span>
                      <span className="text-slate-400">Câu chủ đề, liên kết tự nhiên</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex justify-between">
                      <span className="font-bold text-rose-300">5. VIẾT BÀI HOÀN CHỈNH</span>
                      <span className="text-slate-400">Bố cục 3 phần, miêu tả cảm xúc</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 font-black text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4>4. 5 Thông Điệp Sư Phạm Cốt Lõi</h4>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Học sinh yêu thích việc viết văn, biến giờ học thành niềm vui.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>AI là bạn đồng hành, gợi mở Socratic từ 1–3 điểm, không viết bài thay.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Học sinh tự mình tạo ra bài viết bằng suy nghĩ và vốn từ của chính mình.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Giáo viên có công cụ AI Scan & Rubric hỗ trợ nhận dạng chữ viết tay và chấm bài.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Mỗi học sinh tiến bộ theo năng lực riêng với lộ trình 3 cấp độ rõ ràng.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
