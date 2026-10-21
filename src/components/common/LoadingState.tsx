import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Đang tải dữ liệu...",
  className = "",
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`py-16 px-4 flex flex-col items-center justify-center space-y-3 text-slate-500 ${className}`}
    >
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      <p className="text-xs font-semibold">{message}</p>
    </div>
  );
};
