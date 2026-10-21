import React from "react";
import { User, Submission, GameResult, ScreenId } from "../../types";
import { StatCard } from "../../components/common/StatCard";
import { ProgressBar } from "../../components/common/ProgressBar";
import {
  TrendingUp,
  Award,
  Star,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Heart,
  Flame,
  ArrowRight,
} from "lucide-react";

interface StudentProgressViewProps {
  currentUser: User;
  submissions: Submission[];
  gameResults: GameResult[];
  onNavigate: (screenId: ScreenId) => void;
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({
  currentUser,
  submissions,
  gameResults,
  onNavigate,
}) => {
  const studentSubs = submissions.filter((s) => s.studentId === currentUser.id);
  const totalStars = gameResults.reduce((acc, g) => acc + g.stars, 0) + studentSubs.length * 2;

  const curriculumSteps = [
    {
      step: 1,
      title: "Viết câu đúng",
      desc: "Câu đủ chủ ngữ, vị ngữ, chấm phẩy đúng chỗ",
      status: "completed",
    },
    {
      step: 2,
      title: "Viết câu hay",
      desc: "Biết thêm trạng ngữ và từ láy gợi cảm xúc",
      status: "completed",
    },
    {
      step: 3,
      title: "Viết câu có hình ảnh",
      desc: "Sử dụng thuần thục phép so sánh và nhân hóa",
      status: "in-progress",
    },
    {
      step: 4,
      title: "Viết đoạn mạch lạc",
      desc: "Câu mở đoạn, các câu thân đoạn liên kết, câu kết",
      status: "in-progress",
    },
    {
      step: 5,
      title: "Viết bài hoàn chỉnh",
      desc: "Bài văn 3 phần mở - thân - kết dạt dào cảm xúc",
      status: "upcoming",
    },
  ];

  const badges = [
    {
      id: "b1",
      icon: "🌟",
      title: "Ngôi Sao Siêng Năng",
      desc: "Hoàn thành 5 ngày luyện viết liên tục",
      unlocked: true,
    },
    {
      id: "b2",
      icon: "🖊️",
      title: "Cây Bút Miêu Tả",
      desc: "Sử dụng ít nhất 3 câu so sánh trong bài viết",
      unlocked: true,
    },
    {
      id: "b3",
      icon: "🕵️",
      title: "Thám Tử Chính Tả",
      desc: "Đạt điểm tối đa trong trò chơi bắt lỗi chính tả",
      unlocked: true,
    },
    {
      id: "b4",
      icon: "🌳",
      title: "Tâm Hồn Yêu Thiên Nhiên",
      desc: "Viết bài văn tả cây cối đạt Mức 4 xuất sắc",
      unlocked: true,
    },
    {
      id: "b5",
      icon: "🏆",
      title: "Cây Bút Vàng Lớp 4",
      desc: "Hoàn thành trọn vẹn cả 3 cấp độ Luyện bài",
      unlocked: false,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Hồ Sơ & Hành Trình Tiến Bộ
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Mỗi ngày một chút cố gắng, từng bài viết nhỏ sẽ làm nên sự tiến bộ vượt bậc của em
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Bài viết đã lưu"
          value={`${studentSubs.length} bài`}
          subtext="Đầy đủ các phiên bản"
        />
        <StatCard
          label="Ngôi sao tích lũy"
          value={`${totalStars} ⭐`}
          subtext="Học tập chăm chỉ"
        />
        <StatCard
          label="Chuỗi luyện tập"
          value="5 ngày"
          subtext="Không gián đoạn"
          trend="Đang duy trì tốt"
        />
        <StatCard
          label="Huy hiệu đạt được"
          value="4 / 5"
          subtext="Gần đạt danh hiệu Vàng"
        />
      </div>

      {/* 5-Step Curriculum Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Lộ Trình Phát Triển Kỹ Năng Viết Lớp 4
            </h3>
            <p className="text-xs text-slate-500">
              Tiến độ hiện tại: Hoàn thành 65% lộ trình rèn luyện
            </p>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Cấp độ 2 → Cấp độ 3
          </span>
        </div>

        <ProgressBar value={65} height="h-3" color="bg-emerald-500" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {curriculumSteps.map((s) => (
            <div
              key={s.step}
              className={`p-4 rounded-2xl border-2 space-y-2 transition-all ${
                s.status === "completed"
                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                  : s.status === "in-progress"
                  ? "border-amber-300 bg-amber-50/50 text-amber-950 shadow-xs"
                  : "border-slate-200 bg-slate-50 text-slate-500 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-white border font-bold text-xs flex items-center justify-center">
                  {s.step}
                </span>
                {s.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : s.status === "in-progress" ? (
                  <Sparkles className="w-4 h-4 text-amber-600" />
                ) : null}
              </div>
              <h4 className="text-xs font-black">{s.title}</h4>
              <p className="text-[11px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Bộ Sưu Tập Huy Hiệu Khích Lệ
            </h3>
            <p className="text-xs text-slate-500">
              Ghi nhận từng nỗ lực nhỏ của em trên con đường chinh phục môn Tiếng Việt
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
                b.unlocked
                  ? "bg-white border-slate-200 shadow-xs"
                  : "bg-slate-50/50 border-dashed border-slate-200 opacity-50"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                {b.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-900">{b.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{b.desc}</p>
                <span className="text-[10px] font-bold text-emerald-800 block pt-0.5">
                  {b.unlocked ? "✓ Đã đạt được" : "Chưa mở khóa"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
