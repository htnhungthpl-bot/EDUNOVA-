import React, { useState, useEffect } from "react";
import { User, AuditLog } from "../types";
import { api } from "../services/api";
import {
  Shield,
  Settings,
  Database,
  History,
  Download,
  Upload,
  CheckCircle2,
  Lock,
  Building,
  School,
  Activity,
  AlertCircle,
} from "lucide-react";

interface AdminDashboardViewProps {
  currentUser: User;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentUser }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<any>({
    schoolName: "Trường Tiểu học Chu Văn An",
    currentSchoolYear: "2025 - 2026",
    aiStrictSocraticMode: true,
    maxSuggestionsPerTurn: 3,
    allowStudentSelfAssessment: true,
    rubricMaxScore: 5.0,
  });
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [logsRes, sysRes] = await Promise.all([api.getAuditLogs(), api.getAdminSystem()]);
      setLogs(logsRes.logs || []);
      if (sysRes.settings) setSettings(sysRes.settings);
      if (sysRes.stats) setStats(sysRes.stats);
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAdminSettings(settings);
      setSaveMessage("Đã lưu cấu hình hệ thống thành công!");
      setTimeout(() => setSaveMessage(null), 3000);
      loadAdminData();
    } catch (err: any) {
      alert("Lỗi lưu cấu hình: " + err.message);
    }
  };

  const handleDownloadBackup = () => {
    window.location.href = "/api/admin/backup";
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawJson = event.target?.result as string;
        const parsed = JSON.parse(rawJson);
        if (confirm("Thầy có chắc chắn muốn khôi phục dữ liệu từ bản sao lưu này? Dữ liệu hiện tại sẽ được cập nhật.")) {
          await api.restoreBackup(parsed);
          alert("Khôi phục dữ liệu thành công!");
          loadAdminData();
        }
      } catch (err: any) {
        alert("Lỗi khi đọc file sao lưu: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-purple-800 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-300">
            Trung Tâm Quản Trị Hệ Thống
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Cấu Hình & An Toàn Dữ Liệu Trường Học
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Quản trị viên: <span className="font-bold text-white">{currentUser.name}</span> • Giám sát nhật ký hoạt động, bảo vệ quyền riêng tư học sinh và kiểm soát sao lưu dữ liệu.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold text-emerald-300">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Hệ thống hoạt động ổn định</span>
        </div>
      </div>

      {/* System Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Tổng tài khoản</span>
            <p className="text-xl font-black text-slate-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Học sinh</span>
            <p className="text-xl font-black text-emerald-600">{stats.studentsCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Giáo viên</span>
            <p className="text-xl font-black text-orange-600">{stats.teachersCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Lớp học</span>
            <p className="text-xl font-black text-blue-600">{stats.classesCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Bài tập</span>
            <p className="text-xl font-black text-purple-600">{stats.assignmentsCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Bài đã nộp</span>
            <p className="text-xl font-black text-amber-600">{stats.submissionsCount}</p>
          </div>
        </div>
      )}

      {/* System Configuration & Safety Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-900">
              Cài Đặt Hệ Thống & Quy Tắc Sư Phạm AI
            </h3>
          </div>

          {saveMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {saveMessage}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên trường học</label>
                <input
                  type="text"
                  value={settings.schoolName || ""}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Năm học hiện tại</label>
                <input
                  type="text"
                  value={settings.currentSchoolYear || ""}
                  onChange={(e) => setSettings({ ...settings, currentSchoolYear: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-purple-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-purple-950">
                    Chế độ sư phạm Socratic nghiêm ngặt
                  </p>
                  <p className="text-[11px] text-purple-800">
                    Bắt buộc AI chỉ gợi mở và đặt câu hỏi, tuyệt đối từ chối viết hộ toàn bộ bài văn.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.aiStrictSocraticMode}
                  onChange={(e) => setSettings({ ...settings, aiStrictSocraticMode: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded-md focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-200/50">
                <div>
                  <p className="text-xs font-black text-purple-950">
                    Cho phép học sinh tự đánh giá theo Rubric
                  </p>
                  <p className="text-[11px] text-purple-800">
                    Hiển thị bảng 4 mức Rubric cho học sinh xem trước khi nộp bài chính thức.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowStudentSelfAssessment}
                  onChange={(e) => setSettings({ ...settings, allowStudentSelfAssessment: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded-md focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số gợi ý tối đa mỗi lượt phản hồi
                </label>
                <select
                  value={settings.maxSuggestionsPerTurn}
                  onChange={(e) => setSettings({ ...settings, maxSuggestionsPerTurn: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value={1}>1 gợi ý (Trọng tâm nhất)</option>
                  <option value={2}>2 gợi ý</option>
                  <option value={3}>3 gợi ý (Chuẩn Lớp 4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thang điểm tối đa Rubric
                </label>
                <select
                  value={settings.rubricMaxScore}
                  onChange={(e) => setSettings({ ...settings, rubricMaxScore: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value={5.0}>Thang điểm 5.0 (Chuẩn 4 Mức)</option>
                  <option value={10.0}>Thang điểm 10.0</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20"
              >
                Lưu cấu hình hệ thống
              </button>
            </div>
          </form>
        </div>

        {/* Backup, Restore & Data Privacy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black text-slate-900">
                Sao Lưu & Khôi Phục Dữ Liệu
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tải toàn bộ cơ sở dữ liệu học sinh, bài tập, bài viết và lịch sử phiên bản về máy tính dưới định dạng tệp tin an toàn JSON.
            </p>

            <div className="space-y-2">
              <button
                onClick={handleDownloadBackup}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" /> Tải tệp sao lưu (.JSON)
              </button>

              <label className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-400 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-purple-600" /> Khôi phục từ tệp sao lưu (.JSON)
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={async () => {
                  if (
                    confirm(
                      "XÁC NHẬN LÀM SẠCH DỮ LIỆU THỬ NGHIỆM:\n\n- Hệ thống sẽ tự động sao lưu toàn bộ dữ liệu trước khi xóa.\n- Xóa các bài nộp, điểm số và bài làm thử nghiệm.\n- Bảo lưu 100% kho 85 đề văn SGK, học liệu chuẩn và danh mục lớp học.\n\nThầy có chắc chắn muốn làm sạch để sẵn sàng tiếp nhận dữ liệu thật?"
                    )
                  ) {
                    try {
                      const res = await api.cleanDemoData();
                      alert(`Đã làm sạch dữ liệu thành công! Bản sao lưu an toàn: ${res.backupFile}`);
                      loadAdminData();
                    } catch (err: any) {
                      alert("Lỗi: " + err.message);
                    }
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-600" /> Làm sạch dữ liệu thử nghiệm (Stage 2)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-black uppercase text-slate-800">
                Chính sách an toàn dữ liệu học sinh
              </h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Học sinh chỉ được xem bài làm của chính mình, tuyệt đối không truy cập dữ liệu của bạn khác.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Khóa API AI được bảo vệ an toàn phía máy chủ server-side proxy.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Không thu thập thông tin nhạy cảm của học sinh tiểu học.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">
              Nhật Ký Thao Tác Hệ Thống (Audit Logs)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {logs.length} sự kiện được ghi nhận
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 max-h-72">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Thời gian</th>
                <th className="py-2.5 px-3">Hành động</th>
                <th className="py-2.5 px-3">Người thực hiện</th>
                <th className="py-2.5 px-3">Vai trò</th>
                <th className="py-2.5 px-3">Chi tiết sự kiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{log.action}</td>
                  <td className="py-2.5 px-3">{log.actorName}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.actorRole === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : log.actorRole === "teacher"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
