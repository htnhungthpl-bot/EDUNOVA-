import React, { useState } from "react";
import { User, ClassRoom, Submission, ScreenId } from "../../types";
import { EmptyState } from "../../components/common/EmptyState";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  School,
  FileCheck,
  CheckCircle2,
  X,
} from "lucide-react";

interface TeacherStudentsViewProps {
  students: User[];
  classes: ClassRoom[];
  submissions: Submission[];
  onSaveStudent: (student: User) => void;
  onDeleteStudent: (studentId: string) => void;
  onNavigate: (screenId: ScreenId, extra?: any) => void;
  onShowToast: (msg: string, type: "success" | "warning" | "error" | "info") => void;
}

export const TeacherStudentsView: React.FC<TeacherStudentsViewProps> = ({
  students,
  classes,
  submissions,
  onSaveStudent,
  onDeleteStudent,
  onNavigate,
  onShowToast,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Modal Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formClassId, setFormClassId] = useState("class-4a1");

  // Confirm delete dialog
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = students.filter((s) => {
    if (selectedClass !== "all" && s.classId !== selectedClass) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormName("");
    setFormEmail("");
    setFormClassId("class-4a1");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (std: User) => {
    setEditingStudent(std);
    setFormName(std.name);
    setFormEmail(std.email);
    setFormClassId(std.classId || "class-4a1");
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      onShowToast("Vui lòng điền đủ họ tên và email học sinh.", "warning");
      return;
    }

    if (editingStudent) {
      onSaveStudent({
        ...editingStudent,
        name: formName.trim(),
        email: formEmail.trim(),
        classId: formClassId,
      });
      onShowToast(`Đã cập nhật học sinh ${formName.trim()} thành công!`, "success");
    } else {
      const newStd: User = {
        id: "std-" + Date.now(),
        name: formName.trim(),
        email: formEmail.trim(),
        role: "student",
        classId: formClassId,
        avatar:
          "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
        schoolName: "Trường Tiểu học Chu Văn An",
        joinedDate: new Date().toLocaleDateString("vi-VN"),
      };
      onSaveStudent(newStd);
      onShowToast(`Đã thêm học sinh ${formName.trim()} vào lớp!`, "success");
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteStudent(deleteTarget.id);
      onShowToast(`Đã xóa học sinh ${deleteTarget.name} khỏi danh sách.`, "success");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Quản Lý Danh Sách Học Sinh
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Thêm mới, chỉnh sửa thông tin, theo dõi số bài viết và tiến độ rèn luyện của từng em
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Thêm học sinh mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tất cả các lớp ({students.length} em)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo họ tên, email..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
          />
        </div>
      </div>

      {/* Students Data Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Không tìm thấy học sinh nào"
          description="Hãy thử đổi bộ lọc lớp hoặc tìm kiếm tên khác."
          icon={Users}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Học sinh</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Lớp</th>
                  <th className="py-3.5 px-4">Số bài viết</th>
                  <th className="py-3.5 px-4">Mức Rubric gần nhất</th>
                  <th className="py-3.5 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((std) => {
                  const stdSubs = submissions.filter((s) => s.studentId === std.id);
                  const lastSub = stdSubs[0];

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900">{std.name}</p>
                          <span className="text-[10px] text-slate-400">ID: {std.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{std.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800">
                          {classes.find((c) => c.id === std.classId)?.name || "4A1"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{stdSubs.length} bài</td>
                      <td className="py-3.5 px-4">
                        {lastSub?.rubricEvaluation ? (
                          <span className="text-emerald-800 font-extrabold">
                            Mức {lastSub.rubricEvaluation.overallLevel} ({lastSub.rubricEvaluation.overallScore}đ)
                          </span>
                        ) : (
                          <span className="text-slate-400">Chưa chấm</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(std)}
                            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="Sửa học sinh"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(std)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-slate-900">
              {editingStudent ? "Chỉnh sửa thông tin học sinh" : "Thêm học sinh mới"}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh An"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email học sinh</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Ví dụ: an.nguyen@edunova.edu.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lớp học</label>
                <select
                  value={formClassId}
                  onChange={(e) => setFormClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.teacherName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs"
                >
                  {editingStudent ? "Lưu thay đổi" : "Thêm vào lớp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Xác nhận xóa học sinh?"
        message={`Thầy/Cô có chắc chắn muốn xóa học sinh ${deleteTarget?.name} (${deleteTarget?.email}) khỏi danh sách? Thao tác này sẽ áp dụng lên dữ liệu mẫu của phiên.`}
        confirmLabel="Xóa học sinh"
        cancelLabel="Hủy"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
