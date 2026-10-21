import React from "react";
import { X, BookOpen, CheckCircle2, Sparkles, Lightbulb, ShieldCheck } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Đóng sổ tay"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase">
            <span>Sổ tay hướng dẫn</span>
          </div>
          <h3 id="help-modal-title" className="text-xl font-black text-slate-900">
            Cẩm Nang Viết Hay Lớp 4 – EduNova Writing Coach
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Slogan: “Mỗi ngày chăm chỉ – Mỗi bài viết tiến bộ!”
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin">
          {/* Lộ trình 5 bước */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Lộ trình 5 bước rèn luyện kỹ năng viết
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
              {[
                { s: "1", title: "Viết câu đúng", desc: "Đủ chủ vị, không câu cụt" },
                { s: "2", title: "Viết câu hay", desc: "Thêm trạng ngữ, từ gợi tả" },
                { s: "3", title: "Có hình ảnh", desc: "Dùng so sánh & nhân hóa" },
                { s: "4", title: "Đoạn mạch lạc", desc: "Dùng từ nối, tránh lặp" },
                { s: "5", title: "Bài hoàn chỉnh", desc: "Bố cục 3 phần sinh động" },
              ].map((step) => (
                <div key={step.s} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[11px] inline-flex items-center justify-center">
                    {step.s}
                  </span>
                  <p className="font-extrabold text-slate-900 text-[11px]">{step.title}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Triết lý sư phạm Socratic */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <h4 className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Triết lý sư phạm: Học sinh là tác giả chính!
            </h4>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              AI đóng vai trò người thầy/cô gợi mở, đặt câu hỏi kích thích trí tưởng tượng và chỉ ra 1–3 điểm cần trau chuốt. Ứng dụng tuyệt đối <strong>không viết hộ cả bài</strong> để các em rèn luyện tính độc lập tư duy.
            </p>
          </div>

          {/* Bảng Rubric 4 mức */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-slate-900">
              Quy chuẩn Rubric 4 mức đánh giá môn Tiếng Việt Lớp 4
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                <span className="font-extrabold text-[11px]">Mức 1: Cần hỗ trợ</span>
                <p className="text-[10px] text-rose-700 mt-1">1.0 – 2.5 điểm. Cần bổ sung từ ngữ và sửa câu.</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <span className="font-extrabold text-[11px]">Mức 2: Đang hình thành</span>
                <p className="text-[10px] text-amber-700 mt-1">2.6 – 3.5 điểm. Đạt ý cơ bản, cần thêm so sánh.</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                <span className="font-extrabold text-[11px]">Mức 3: Đạt yêu cầu</span>
                <p className="text-[10px] text-blue-700 mt-1">3.6 – 4.5 điểm. Câu văn đúng, giàu hình ảnh.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="font-extrabold text-[11px]">Mức 4: Vận dụng tốt</span>
                <p className="text-[10px] text-emerald-800 mt-1">4.6 – 5.0 điểm. Diễn đạt xuất sắc, có chất thơ.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Đã hiểu, bắt đầu viết bài!
          </button>
        </div>
      </div>
    </div>
  );
};
