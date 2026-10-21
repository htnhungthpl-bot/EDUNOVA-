import React, { useState, useEffect } from "react";
import { User, Material } from "../types";
import { api } from "../services/api";
import { GraduationCap, Search, Filter, BookOpen, Plus, Trash2, Eye, X, Sparkles, CheckCircle2 } from "lucide-react";

interface MaterialsViewProps {
  currentUser: User;
  onSelectForWriting?: (material: Material) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ currentUser, onSelectForWriting }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Detail Modal
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Add Material Modal (Teacher/Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<any>("Phương pháp viết");
  const [newSkill, setNewSkill] = useState<any>("Từ ngữ gợi tả");
  const [newLevel, setNewLevel] = useState<any>("doan");
  const [newContent, setNewContent] = useState("");
  const [newExample1, setNewExample1] = useState("");
  const [newTip1, setNewTip1] = useState("");

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.getMaterials({
        category: category || undefined,
        skill: skill || undefined,
        level: level || undefined,
        search: search || undefined,
      });
      setMaterials(res.materials || []);
    } catch (err) {
      console.error("Failed to load materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [category, skill, level]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMaterials();
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Vui lòng điền tiêu đề và nội dung học liệu.");
      return;
    }
    try {
      await api.createMaterial({
        title: newTitle,
        category: newCategory,
        skill: newSkill,
        level: newLevel,
        content: newContent,
        examples: newExample1.trim() ? [newExample1] : [],
        tips: newTip1.trim() ? [newTip1] : [],
        author: currentUser.name,
      });
      setShowAddModal(false);
      setNewTitle("");
      setNewContent("");
      setNewExample1("");
      setNewTip1("");
      loadMaterials();
    } catch (err: any) {
      alert("Lỗi khi thêm học liệu: " + err.message);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Thầy/Cô có chắc chắn muốn xóa học liệu này không?")) return;
    try {
      await api.deleteMaterial(id);
      loadMaterials();
    } catch (err: any) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-200">
            Kho Tư Liệu Chuẩn Lớp 4
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Kho Học Liệu & Bí Quyết Viết Văn
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Tuyển tập từ láy, câu văn mẫu so sánh, nhân hóa và bí quyết mở bài gián tiếp, kết bài mở rộng theo chương trình GDPT.
          </p>
        </div>

        {(currentUser.role === "teacher" || currentUser.role === "admin") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-emerald-600" /> Thêm Học Liệu Mới
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm từ ngữ gợi tả, mở bài gián tiếp, phép so sánh..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Tìm kiếm
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-extrabold text-slate-400 uppercase text-[10px]">Lọc theo:</span>

          {/* Chủ đề */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-emerald-500"
          >
            <option value="">Tất cả chủ đề</option>
            <option value="Phương pháp viết">Phương pháp viết</option>
            <option value="Cây cối">Cây cối</option>
            <option value="Con vật">Con vật</option>
            <option value="Đồ vật">Đồ vật</option>
            <option value="Cảnh đẹp">Cảnh đẹp</option>
            <option value="Gia đình">Gia đình</option>
          </select>

          {/* Kỹ năng */}
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-emerald-500"
          >
            <option value="">Tất cả kỹ năng</option>
            <option value="Từ ngữ gợi tả">Từ ngữ gợi tả</option>
            <option value="Biện pháp so sánh">Biện pháp so sánh</option>
            <option value="Biện pháp nhân hóa">Biện pháp nhân hóa</option>
            <option value="Mở rộng câu">Mở rộng câu</option>
            <option value="Mở bài gián tiếp">Mở bài gián tiếp</option>
            <option value="Kết bài mở rộng">Kết bài mở rộng</option>
            <option value="Đoạn văn mạch lạc">Đoạn văn mạch lạc</option>
          </select>

          {/* Cấp độ */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-emerald-500"
          >
            <option value="">Tất cả cấp độ</option>
            <option value="cau">Cấp 1: Luyện câu</option>
            <option value="doan">Cấp 2: Luyện đoạn</option>
            <option value="bai">Cấp 3: Luyện bài</option>
          </select>

          {(category || skill || level || search) && (
            <button
              onClick={() => {
                setCategory("");
                setSkill("");
                setLevel("");
                setSearch("");
              }}
              className="text-xs text-rose-600 font-bold hover:underline ml-auto"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Materials List Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold text-xs">
          Đang tải kho học liệu...
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700">Chưa tìm thấy học liệu phù hợp</h4>
          <p className="text-xs">Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {mat.category}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">
                      {mat.skill}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Cấp {mat.level === "cau" ? "1: Câu" : mat.level === "doan" ? "2: Đoạn" : "3: Bài"}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {mat.content}
                </p>

                {mat.examples && mat.examples.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 italic">
                    " {mat.examples[0]} "
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Tác giả: {mat.author}</span>
                <div className="flex items-center gap-2">
                  {(currentUser.role === "teacher" || currentUser.role === "admin") && (
                    <button
                      onClick={() => handleDeleteMaterial(mat.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa học liệu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedMaterial(mat)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Material Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => setSelectedMaterial(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {selectedMaterial.category}
                </span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800">
                  {selectedMaterial.skill}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{selectedMaterial.title}</h3>
              <p className="text-xs text-slate-500">Người chia sẻ: {selectedMaterial.author}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
              {selectedMaterial.content}
            </div>

            {selectedMaterial.examples && selectedMaterial.examples.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Ví dụ câu văn mẫu lớp 4:
                </h4>
                <div className="space-y-2">
                  {selectedMaterial.examples.map((ex, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-emerald-50 text-xs text-emerald-950 italic border border-emerald-100">
                      "{ex}"
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMaterial.tips && selectedMaterial.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-orange-800 uppercase flex items-center gap-1.5">
                  💡 Lời khuyên khi làm bài:
                </h4>
                <div className="space-y-1.5">
                  {selectedMaterial.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Modal for Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900">Thêm Học Liệu / Ngữ Liệu Mới</h3>

            <form onSubmit={handleCreateMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề học liệu</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Cách miêu tả đôi mắt chú cún sinh động"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Phương pháp viết">Phương pháp viết</option>
                    <option value="Cây cối">Cây cối</option>
                    <option value="Con vật">Con vật</option>
                    <option value="Đồ vật">Đồ vật</option>
                    <option value="Cảnh đẹp">Cảnh đẹp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kỹ năng</label>
                  <select
                    value={newSkill}
                    onChange={(e: any) => setNewSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Từ ngữ gợi tả">Từ ngữ gợi tả</option>
                    <option value="Biện pháp so sánh">Biện pháp so sánh</option>
                    <option value="Biện pháp nhân hóa">Biện pháp nhân hóa</option>
                    <option value="Mở bài gián tiếp">Mở bài gián tiếp</option>
                    <option value="Kết bài mở rộng">Kết bài mở rộng</option>
                    <option value="Đoạn văn mạch lạc">Đoạn văn mạch lạc</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cấp độ</label>
                  <select
                    value={newLevel}
                    onChange={(e: any) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="cau">Cấp 1: Câu</option>
                    <option value="doan">Cấp 2: Đoạn</option>
                    <option value="bai">Cấp 3: Bài</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung hướng dẫn</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Giải thích phương pháp, cách quan sát và diễn đạt..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ví dụ minh họa mẫu</label>
                <input
                  type="text"
                  value={newExample1}
                  onChange={(e) => setNewExample1(e.target.value)}
                  placeholder="Ví dụ: Đôi mắt chú tròn xoe, sáng lấp lánh như hai viên bi ve..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mẹo / Lời khuyên cho học sinh</label>
                <input
                  type="text"
                  value={newTip1}
                  onChange={(e) => setNewTip1(e.target.value)}
                  placeholder="Ví dụ: Khi tả mắt con vật nên quan sát lúc ban ngày và ban đêm..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Lưu học liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
