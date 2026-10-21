import React, { useState } from "react";
import { User, Assignment, ScreenId } from "../../types";
import { EmptyState } from "../../components/common/EmptyState";
import { Award, Search, Calendar, ArrowRight, BookOpen, Clock, CheckCircle2 } from "lucide-react";

interface StudentAssignmentsViewProps {
  currentUser: User;
  assignments: Assignment[];
  onStartAssignment: (assignment: Assignment) => void;
  onNavigate: (screenId: ScreenId) => void;
}

export const StudentAssignmentsView: React.FC<StudentAssignmentsViewProps> = ({
  currentUser,
  assignments,
  onStartAssignment,
  onNavigate,
}) => {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = assignments.filter((a) => {
    if (levelFilter !== "all" && a.level !== levelFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.prompt.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Nhiệm Vụ & Bài Tập Được Giao
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Các bài tập rèn luyện viết câu, đoạn văn và bài văn do cô giáo chủ nhiệm giao cho lớp em
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Filter segmented buttons */}
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setLevelFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                levelFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setLevelFilter("cau")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                levelFilter === "cau" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600"
              }`}
            >
              Luyện câu
            </button>
            <button
              onClick={() => setLevelFilter("doan")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                levelFilter === "doan" ? "bg-white text-orange-800 shadow-xs" : "text-slate-600"
              }`}
            >
              Luyện đoạn
            </button>
            <button
              onClick={() => setLevelFilter("bai")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                levelFilter === "bai" ? "bg-white text-blue-800 shadow-xs" : "text-slate-600"
              }`}
            >
              Luyện bài
            </button>
          </div>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm đề bài..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
          />
        </div>
      </div>

      {/* Assignment Cards List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Không tìm thấy bài tập nào"
          description="Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm bài tập khác."
          icon={Award}
          actionLabel="Xóa bộ lọc"
          onAction={() => {
            setLevelFilter("all");
            setStatusFilter("all");
            setSearch("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((asg) => (
            <div
              key={asg.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-extrabold text-emerald-800">
                    {asg.level === "cau"
                      ? "Cấp 1: Luyện câu"
                      : asg.level === "doan"
                      ? "Cấp 2: Luyện đoạn"
                      : "Cấp 3: Luyện bài văn"}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Hạn nộp: {asg.dueDate}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug">{asg.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100 line-clamp-3">
                  {asg.prompt}
                </p>

                {asg.guidelines && asg.guidelines.length > 0 && (
                  <div className="space-y-1 text-xs text-slate-500">
                    <p className="font-bold text-slate-700 text-[11px] uppercase">Gợi ý từ cô giáo:</p>
                    <ul className="space-y-0.5 text-[11px] text-slate-600 list-disc pl-4 font-medium">
                      {asg.guidelines.slice(0, 2).map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Mục tiêu: {asg.targetWords || 100} từ
                </span>

                <button
                  onClick={() => onStartAssignment(asg)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Làm bài ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
