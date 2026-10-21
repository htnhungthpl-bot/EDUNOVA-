import React, { useState } from "react";
import { User } from "../types";
import {
  X,
  LogIn,
  UserPlus,
  KeyRound,
  Shield,
  GraduationCap,
  UserCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { api } from "../services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: User[];
  onSelectUser: (user: User) => void;
  onLoginCustom: (credentials: any) => Promise<any>;
  onRegisterCustom: (data: { name: string; email: string; role: string; classId?: string }) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  availableUsers,
  onSelectUser,
  onLoginCustom,
  onRegisterCustom,
}) => {
  const [activeTab, setActiveTab] = useState<"student" | "staff" | "register">("student");
  
  // Student PIN login state
  const [studentClassId, setStudentClassId] = useState("class-4a1");
  const [studentName, setStudentName] = useState("");
  const [studentPin, setStudentPin] = useState("");

  // Staff / Admin login state
  const [staffIdentifier, setStaffIdentifier] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

  // Registration state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState<"student" | "teacher" | "school" | "admin">("student");
  const [regClassId, setRegClassId] = useState("class-4a1");

  // Mandatory first-time password change state
  const [needsPasswordChange, setNeedsPasswordChange] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [oldPassword, setOldPassword] = useState("123456");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1. Submit Student PIN login
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      if (!studentName.trim()) throw new Error("Vui lòng nhập họ và tên của em.");
      if (!studentPin.trim()) throw new Error("Vui lòng nhập mã PIN do Thầy/Cô cấp.");

      const res = await onLoginCustom({
        role: "student",
        classId: studentClassId,
        name: studentName.trim(),
        pinCode: studentPin.trim(),
      });

      setSuccessMsg(res?.message || "Đăng nhập học sinh thành công!");
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Không thể đăng nhập học sinh.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Staff / Admin / School login
  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      if (!staffIdentifier.trim()) throw new Error("Vui lòng nhập tên đăng nhập hoặc email.");
      if (!staffPassword) throw new Error("Vui lòng nhập mật khẩu.");

      const res = await onLoginCustom({
        identifier: staffIdentifier.trim(),
        password: staffPassword,
      });

      if (res?.mustChangePassword) {
        setNeedsPasswordChange(true);
        setPendingUser(res.user);
        setOldPassword(staffPassword);
        setError("Tài khoản lần đầu đăng nhập. Bạn bắt buộc phải đổi mật khẩu để bảo vệ hệ thống!");
        setLoading(false);
        return;
      }

      setSuccessMsg(res?.message || "Đăng nhập thành công!");
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Tên đăng nhập hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const email = prompt("Nhập địa chỉ Gmail để đăng nhập (Google OAuth SSO):", "giaovien@edunova.edu.vn");
      if (!email) {
        setLoading(false);
        return;
      }
      const res = await api.loginGoogle({
        email: email.trim(),
        name: email.split("@")[0],
      });
      onSelectUser(res.user);
      setSuccessMsg("Đăng nhập Google thành công!");
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Lỗi đăng nhập Google.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit Change Password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      if (!pendingUser) throw new Error("Không có người dùng hợp lệ.");
      if (newPassword.length < 6) throw new Error("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      if (newPassword === "123456") throw new Error("Mật khẩu mới không được là mật khẩu mặc định (123456).");
      if (newPassword !== confirmPassword) throw new Error("Xác nhận mật khẩu mới không trùng khớp.");

      const res = await api.changePassword(pendingUser.id, oldPassword, newPassword);
      setSuccessMsg(res.message || "Đổi mật khẩu thành công!");
      setNeedsPasswordChange(false);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Lỗi đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Submit Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      if (!regName.trim() || !regEmail.trim()) throw new Error("Vui lòng điền đủ họ tên và email.");
      await onRegisterCustom({
        name: regName.trim(),
        email: regEmail.trim(),
        role: regRole,
        classId: regRole === "student" ? regClassId : undefined,
      });
      setSuccessMsg("Đăng ký thành công!");
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Đăng ký không thành công.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-amber-500 text-white p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🦉</span>
            <div>
              <h3 className="text-xl font-black">EduNova – Nền Tảng Giáo Dục Thông Minh</h3>
              <p className="text-xs text-emerald-100 font-medium">Đổi mới cách học – Bứt phá tri thức</p>
            </div>
          </div>

          {!needsPasswordChange && (
            <div className="flex gap-1.5 mt-4 bg-emerald-800/40 p-1 rounded-xl">
              <button
                onClick={() => { setActiveTab("student"); setError(""); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "student" ? "bg-white text-emerald-800 shadow-xs" : "text-emerald-100 hover:text-white"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" /> Học sinh
              </button>
              <button
                onClick={() => { setActiveTab("staff"); setError(""); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "staff" ? "bg-white text-emerald-800 shadow-xs" : "text-emerald-100 hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Thầy Cô & Quản trị
              </button>
              <button
                onClick={() => { setActiveTab("register"); setError(""); }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "register" ? "bg-white text-emerald-800 shadow-xs" : "text-emerald-100 hover:text-white"
                }`}
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SCREEN: MANDATORY FIRST-TIME PASSWORD CHANGE */}
          {needsPasswordChange ? (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <div className="flex items-center gap-2 font-black text-amber-800 mb-1">
                  <KeyRound className="w-4 h-4" /> Bắt buộc đổi mật khẩu lần đầu
                </div>
                <p>
                  Tài khoản của bạn ({pendingUser?.name}) đang dùng mật khẩu khởi tạo mặc định. Để bảo vệ dữ liệu nhà trường, vui lòng thiết lập mật khẩu mới ngay bây giờ.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu an toàn mới..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Đang lưu mật khẩu..." : "Lưu mật khẩu mới & Tiếp tục"}
              </button>
            </form>
          ) : activeTab === "student" ? (
            /* TAB 1: STUDENT QUICK PIN LOGIN */
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🎒</span>
                <div className="text-xs">
                  <p className="font-extrabold text-emerald-950">Không gian học sinh Tiểu học</p>
                  <p className="text-emerald-700">Đăng nhập dễ dàng chỉ với Lớp, Họ tên và Mã PIN 4 số</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">1. Chọn lớp học của em</label>
                <select
                  value={studentClassId}
                  onChange={(e) => setStudentClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm font-semibold bg-white"
                >
                  <option value="class-4a1">Lớp 4A1 - Cô Lê Thị Thu Hương</option>
                  <option value="class-4a2">Lớp 4A2 - Thầy Nguyễn Đăng Khoa</option>
                  <option value="class-4a3">Lớp 4A3 - Cô Phạm Mai Lan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2. Nhập họ và tên</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh An"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">3. Nhập mã PIN (4 số do Thầy/Cô cấp)</label>
                  <span className="text-[11px] text-emerald-600 font-semibold cursor-help" title="Mã PIN mặc định mẫu: 1234">
                    Gợi ý mẫu: 1234
                  </span>
                </div>
                <input
                  type="password"
                  maxLength={6}
                  value={studentPin}
                  onChange={(e) => setStudentPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-center tracking-widest text-lg font-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Đang kiểm tra..." : <><LogIn className="w-4 h-4" /> Vào không gian học tập lớp 4</>}
              </button>
            </form>
          ) : activeTab === "staff" ? (
            /* TAB 2: TEACHER / ADMIN / SCHOOL LOGIN */
            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🏫</span>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800">Cán bộ Nhà trường, Giáo viên & Quản trị</p>
                  <p className="text-slate-500">Đăng nhập tài khoản hệ thống hoặc tài khoản Google</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên đăng nhập hoặc Email</label>
                <input
                  type="text"
                  value={staffIdentifier}
                  onChange={(e) => setStaffIdentifier(e.target.value)}
                  placeholder="admin hoặc giaovien@edunova.edu.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="Mật khẩu khởi tạo: 123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Đang xác thực..." : <><LogIn className="w-4 h-4" /> Đăng nhập hệ thống</>}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400 font-bold uppercase">Hoặc</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Đăng nhập bằng tài khoản Google (Giáo viên)
              </button>
            </form>
          ) : (
            /* TAB 3: REGISTER NEW USER */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ví dụ: Thầy Trần Hoàng Nam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email đăng ký</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="giaovien.moi@edunova.edu.vn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vai trò</label>
                <select
                  value={regRole}
                  onChange={(e: any) => setRegRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                >
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="school">Nhà trường / Ban giám hiệu</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              {regRole === "student" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp học</label>
                  <select
                    value={regClassId}
                    onChange={(e) => setRegClassId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-emerald-500 text-sm"
                  >
                    <option value="class-4a1">Lớp 4A1</option>
                    <option value="class-4a2">Lớp 4A2</option>
                    <option value="class-4a3">Lớp 4A3</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? "Đang xử lý..." : <><UserPlus className="w-4 h-4" /> Đăng ký tài khoản mới</>}
              </button>
            </form>
          )}

          {/* Quick 1-Click Role Switcher for instant testing */}
          {!needsPasswordChange && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Tài khoản mẫu đã cấu hình sẵn (Nhấn để chuyển nhanh):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {availableUsers.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    className="p-2 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all flex flex-col gap-0.5"
                  >
                    <div className="flex items-center gap-1">
                      {u.role === "student" ? (
                        <GraduationCap className="w-3 h-3 text-emerald-600" />
                      ) : u.role === "teacher" ? (
                        <UserCheck className="w-3 h-3 text-orange-600" />
                      ) : u.role === "school" ? (
                        <Building2 className="w-3 h-3 text-blue-600" />
                      ) : (
                        <Shield className="w-3 h-3 text-purple-600" />
                      )}
                      <span className="text-[9px] font-black uppercase text-slate-500 truncate">
                        {u.role === "student" ? "Học sinh" : u.role === "teacher" ? "Giáo viên" : u.role === "school" ? "Trường" : "Admin"}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 truncate">{u.name.split(" ").slice(-2).join(" ")}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
