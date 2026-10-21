import React, { useState } from "react";
import { User, UserRole } from "../../types";
import { Users, GraduationCap, UserCheck, Shield, ChevronDown, Check } from "lucide-react";

interface RolePreviewSwitcherProps {
  currentUser: User;
  availableUsers: User[];
  onSelectUser: (user: User) => void;
}

export const RolePreviewSwitcher: React.FC<RolePreviewSwitcherProps> = ({
  currentUser,
  availableUsers,
  onSelectUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const roleMeta = {
    student: {
      label: "Học sinh",
      icon: GraduationCap,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    teacher: {
      label: "Giáo viên",
      icon: UserCheck,
      color: "text-amber-800 bg-amber-50 border-amber-200",
    },
    admin: {
      label: "Quản trị viên",
      icon: Shield,
      color: "text-purple-800 bg-purple-50 border-purple-200",
    },
  };

  const CurrentIcon = roleMeta[currentUser.role].icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left shadow-2xs focus-visible:outline-emerald-600"
        title="Chuyển đổi vai trò xem thử giao diện minh họa (Giai đoạn 2)"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-2 ring-emerald-500/20 shrink-0"
        />
        <div className="hidden sm:block">
          <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
            <span className="truncate max-w-[120px]">{currentUser.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
            <span>{roleMeta[currentUser.role].label}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-bold">Xem thử</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Disclaimer notice */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 mb-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-900 uppercase">
                <span>Chế độ xem thử giao diện</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Công cụ minh họa UI/UX Giai đoạn 2 để kiểm thử giao diện theo vai trò. Chưa phải cơ chế phân quyền bảo mật thực sự.
              </p>
            </div>

            <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Chọn tài khoản thử nghiệm:
            </p>

            <div className="space-y-1">
              {availableUsers.map((user) => {
                const isSelected = user.id === currentUser.id;
                const Icon = roleMeta[user.role].icon;

                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-colors ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-950 font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold leading-tight">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                          <span>{roleMeta[user.role].label}</span>
                          {user.classId && <span>({user.classId.replace("class-", "").toUpperCase()})</span>}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
