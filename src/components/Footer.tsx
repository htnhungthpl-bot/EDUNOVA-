import React from "react";
import { Heart, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md">
                <span className="text-xl">🦉</span>
              </div>
              <div>
                <span className="text-xl font-black text-emerald-800">EduNova Writing Coach</span>
                <p className="text-xs font-semibold text-emerald-600">Mỗi ngày chăm chỉ – Mỗi bài viết tiến bộ!</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Hệ thống trợ lý AI sư phạm đồng hành cùng học sinh lớp 4 rèn luyện kỹ năng viết Tiếng Việt theo chuẩn chương trình GDPT. AI đóng vai trò người thầy gợi mở, khích lệ và tự đánh giá; học sinh luôn là người trực tiếp suy nghĩ và viết bài.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> An toàn cho học sinh tiểu học
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Socratic AI Pedagogy
              </span>
            </div>
          </div>

          {/* Lộ trình phát triển kỹ năng */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Lộ trình 5 bước viết hay
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bước 1: Viết câu đúng ngữ pháp
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bước 2: Viết câu hay, giàu cảm xúc
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bước 3: Viết câu có hình ảnh so sánh, nhân hóa
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bước 4: Viết đoạn văn mạch lạc, liên kết
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bước 5: Viết bài văn hoàn chỉnh, sáng tạo
              </li>
            </ul>
          </div>

          {/* Trò chơi & Học liệu */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Góc học tập bổ ích
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" /> Kho từ láy & từ gợi tả âm thanh, màu sắc
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" /> Bí quyết mở bài gián tiếp và kết bài mở rộng
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Trò chơi: Vua từ ngữ & Xây câu thần tốc
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Trò chơi: Thám tử chính tả & Thử thách viết hay
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EduNova Writing Coach. Dành riêng cho học sinh, giáo viên và nhà trường tiểu học.</p>
          <div className="flex items-center gap-1">
            <span>Thiết kế vì tình yêu tiếng Việt của các em học sinh</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
