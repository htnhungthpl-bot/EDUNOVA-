import React, { useState } from "react";
import { Material, ScreenId } from "../../types";
import { EmptyState } from "../../components/common/EmptyState";
import { GraduationCap, Search, Eye, Sparkles, BookOpen, X, CheckCircle2 } from "lucide-react";

interface StudentMaterialsViewProps {
  materials: Material[];
  onNavigate: (screenId: ScreenId, extra?: any) => void;
}

export const StudentMaterialsView: React.FC<StudentMaterialsViewProps> = ({
  materials,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  const filtered = materials.filter((m) => {
    if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
    if (selectedSkill !== "all" && m.skill !== selectedSkill) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Kho Học Liệu & Bí Quyết Viết Văn Lớp 4
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Tuyển tập từ láy, câu văn mẫu so sánh, nhân hóa, mở bài gián tiếp và kết bài mở rộng
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả chủ đề</option>
            <option value="Phương pháp viết">Phương pháp viết</option>
            <option value="Cây cối">Cây cối</option>
            <option value="Con vật">Con vật</option>
            <option value="Đồ vật">Đồ vật</option>
            <option value="Cảnh đẹp">Cảnh đẹp</option>
          </select>

          {/* Skill Filter */}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="Từ ngữ gợi tả">Từ ngữ gợi tả</option>
            <option value="Biện pháp so sánh">Biện pháp so sánh</option>
            <option value="Biện pháp nhân hóa">Biện pháp nhân hóa</option>
            <option value="Mở bài gián tiếp">Mở bài gián tiếp</option>
            <option value="Kết bài mở rộng">Kết bài mở rộng</option>
            <option value="Đoạn văn mạch lạc">Đoạn văn mạch lạc</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm bí kíp, từ ngữ..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Materials */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Không tìm thấy học liệu phù hợp"
          description="Hãy thử chọn chủ đề khác hoặc xóa từ khóa tìm kiếm."
          icon={GraduationCap}
          actionLabel="Xem tất cả học liệu"
          onAction={() => {
            setSelectedCategory("all");
            setSelectedSkill("all");
            setSearch("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="font-extrabold text-emerald-800">{mat.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-orange-700 font-bold">{mat.skill}</span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">{mat.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{mat.content}</p>

                {mat.examples && mat.examples.length > 0 && (
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-serif italic">
                    "{mat.examples[0]}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Tác giả: {mat.author}
                </span>

                <button
                  onClick={() => setActiveMaterial(mat)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-extrabold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Material Detail Modal */}
      {activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[85vh] p-6 sm:p-8 space-y-5 overflow-y-auto relative">
            <button
              onClick={() => setActiveMaterial(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="text-emerald-800">{activeMaterial.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-orange-700">{activeMaterial.skill}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{activeMaterial.title}</h3>
              <p className="text-xs text-slate-400">Tác giả: {activeMaterial.author}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs leading-relaxed text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
              {activeMaterial.content}
            </div>

            {/* Examples */}
            {activeMaterial.examples && activeMaterial.examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Ví dụ câu văn mẫu lớp 4:
                </h4>
                <div className="space-y-2">
                  {activeMaterial.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-50 text-xs text-emerald-950 font-serif italic border border-emerald-100"
                    >
                      "{ex}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {activeMaterial.tips && activeMaterial.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-800">
                  💡 Lời khuyên của thầy cô:
                </h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {activeMaterial.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveMaterial(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
