import React from "react";
import { RubricCriterionDefinition, RubricScore } from "../../types";
import { Check, Star, Info } from "lucide-react";

interface RubricScaleProps {
  definitions: RubricCriterionDefinition[];
  currentScores: RubricScore[];
  onChangeScore?: (criterionId: string, level: 1 | 2 | 3 | 4) => void;
  readOnly?: boolean;
}

export const RubricScale: React.FC<RubricScaleProps> = ({
  definitions,
  currentScores,
  onChangeScore,
  readOnly = false,
}) => {
  const levelNames = {
    1: "Mức 1: Cần hỗ trợ",
    2: "Mức 2: Đang hình thành",
    3: "Mức 3: Đạt yêu cầu",
    4: "Mức 4: Vận dụng tốt",
  };

  const levelColors = {
    1: {
      active: "border-rose-400 bg-rose-50 text-rose-900 font-bold",
      badge: "text-rose-700 bg-rose-50 border-rose-200",
    },
    2: {
      active: "border-amber-400 bg-amber-50 text-amber-900 font-bold",
      badge: "text-amber-700 bg-amber-50 border-amber-200",
    },
    3: {
      active: "border-blue-400 bg-blue-50 text-blue-900 font-bold",
      badge: "text-blue-700 bg-blue-50 border-blue-200",
    },
    4: {
      active: "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold",
      badge: "text-emerald-800 bg-emerald-50 border-emerald-200",
    },
  };

  return (
    <div className="space-y-6">
      {definitions.map((def, defIdx) => {
        const currentScore = currentScores.find((s) => s.criterionId === def.id);
        const selectedLevel = currentScore?.level || 3;

        return (
          <div
            key={def.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  {defIdx + 1}. {def.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{def.description}</p>
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Đang chọn:{" "}
                <span className="font-extrabold text-emerald-800">{levelNames[selectedLevel]}</span>
              </div>
            </div>

            {/* 4 Levels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {([1, 2, 3, 4] as (1 | 2 | 3 | 4)[]).map((lvl) => {
                const isSelected = selectedLevel === lvl;
                const desc = def.levels[lvl];

                return (
                  <button
                    key={lvl}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onChangeScore && onChangeScore(def.id, lvl)}
                    className={`p-3 rounded-xl border-2 text-left text-xs transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? levelColors[lvl].active + " shadow-xs"
                        : "border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700"
                    } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[11px] uppercase tracking-wider">
                        {levelNames[lvl]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{desc}</p>
                  </button>
                );
              })}
            </div>

            {currentScore?.suggestion && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Gợi ý phát triển: </span>
                  <span>{currentScore.suggestion}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
