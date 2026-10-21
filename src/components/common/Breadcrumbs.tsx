import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { ScreenId } from "../../types";

export interface BreadcrumbItem {
  label: string;
  screenId?: ScreenId;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (screenId: ScreenId) => void;
  rootLabel?: string;
  rootScreenId?: ScreenId;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  rootLabel = "Trang chủ",
  rootScreenId = "student-home",
}) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 font-medium">
      <button
        onClick={() => onNavigate(rootScreenId)}
        className="flex items-center gap-1 hover:text-emerald-700 transition-colors focus-visible:outline-emerald-600 rounded-sm"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>{rootLabel}</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 mx-1.5 text-slate-300 shrink-0" aria-hidden="true" />
            {isLast || !item.screenId ? (
              <span className="text-slate-800 font-semibold truncate max-w-xs">{item.label}</span>
            ) : (
              <button
                onClick={() => onNavigate(item.screenId!)}
                className="hover:text-emerald-700 transition-colors focus-visible:outline-emerald-600 rounded-sm truncate max-w-xs"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
