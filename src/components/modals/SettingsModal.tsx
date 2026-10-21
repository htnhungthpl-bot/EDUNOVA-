import React from "react";
import { AppSettings } from "../../types";
import { X, Type, Volume2, ShieldCheck, Check, Sparkles } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [localSettings, setLocalSettings] = React.useState<AppSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Đóng cài đặt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 id="settings-modal-title" className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span className="text-2xl">⚙️</span> Cài Đặt Giao Diện & Trợ Năng
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Tùy chỉnh cỡ chữ, âm thanh và hiệu ứng thân thiện cho học sinh tiểu học
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cỡ chữ */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-emerald-600" /> Cỡ chữ hiển thị
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "normal", label: "Chuẩn", desc: "14px" },
                { id: "large", label: "Lớn", desc: "16px (Khuyên dùng)" },
                { id: "huge", label: "Rất lớn", desc: "18px" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setLocalSettings({ ...localSettings, fontSize: item.id as any })
                  }
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    localSettings.fontSize === item.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <span className="text-[10px] text-slate-500">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Âm thanh & Giảm chuyển động */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Hiệu ứng ăn mừng (Pháo hoa sao)</p>
                <p className="text-[11px] text-slate-500">
                  Hiển thị chúc mừng khi hoàn thành bài viết hoặc đạt điểm cao
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.soundEffects}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, soundEffects: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-800">Chế độ giảm chuyển động</p>
                <p className="text-[11px] text-slate-500">
                  Tối ưu cho thiết bị cấu hình nhẹ và người nhạy cảm chuyển động
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.reducedMotion}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, reducedMotion: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Trường học & Năm học */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tên trường học</label>
              <input
                type="text"
                value={localSettings.schoolName}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, schoolName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Năm học</label>
              <input
                type="text"
                value={localSettings.currentSchoolYear}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, currentSchoolYear: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs"
            >
              Lưu cài đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
