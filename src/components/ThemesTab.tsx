import React from 'react';
import { CollectorTheme, Transaction } from '../types';
import { formatKRW } from '../utils/formatters';

interface ThemesTabProps {
  themes: CollectorTheme[];
  activeThemeId: string;
  transactions: Transaction[];
  currentMonth: string;
  onSelectTheme: (themeId: string) => void;
  onOpenAddTheme: () => void;
  onUpdateThemeBudget: (themeId: string, budget: number, recoveryRate: number) => void;
  onDeleteTheme: (themeId: string) => void;
}

export const ThemesTab: React.FC<ThemesTabProps> = ({
  themes,
  activeThemeId,
  transactions,
  currentMonth,
  onSelectTheme,
  onOpenAddTheme,
  onUpdateThemeBudget,
  onDeleteTheme,
}) => {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Overview Card */}
      <div className="bg-[#121215] border border-[#27272a]/60 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#a1a1aa]">컬렉터 테마 및 월간 회수 목표</span>
          <button
            onClick={onOpenAddTheme}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#a78bfa] text-[#0a0012] text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span>테마 추가</span>
          </button>
        </div>
        <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
          수집 영역별로 가계부와 보관함을 분리하여, 각 카테고리의 방출 회수율과 지출 한도를 정밀하게 관리할 수 있습니다.
        </p>
      </div>

      {/* Theme Cards */}
      <div className="flex flex-col gap-3">
        {themes.map((theme) => {
          const isActive = theme.id === activeThemeId;
          const themeMonthTx = transactions.filter(
            (t) => t.themeId === theme.id && t.month === currentMonth
          );
          const resaleTotal = themeMonthTx
            .filter((t) => t.type === 'resale')
            .reduce((sum, t) => sum + Math.max(0, t.amount), 0);
          const expenseTotal = themeMonthTx
            .filter((t) => t.type === 'purchase' || t.type === 'care')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          const currentRecoveryRate =
            expenseTotal > 0 ? Math.min(100, Math.round((resaleTotal / expenseTotal) * 100)) : resaleTotal > 0 ? 100 : 0;

          return (
            <div
              key={theme.id}
              className={`bg-[#121215] border rounded-xl p-4 transition-all ${
                isActive ? 'border-[#a78bfa] shadow-[0_0_12px_rgba(167,139,250,0.15)]' : 'border-[#27272a]/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-[#7c3aed] text-white' : 'bg-[#1e1e22] text-[#a78bfa]'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">{theme.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#fafafa]">{theme.name}</h4>
                      {isActive && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#7c3aed]/20 text-[#c4b5fd]">
                          현재 선택됨
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#a1a1aa] mt-0.5">{theme.description}</p>
                  </div>
                </div>

                {!isActive && (
                  <button
                    onClick={() => onSelectTheme(theme.id)}
                    className="px-2.5 py-1 rounded-md bg-[#1e1e22] hover:bg-[#27272a] text-[#a78bfa] text-xs font-medium transition-colors"
                  >
                    전환
                  </button>
                )}
              </div>

              {/* Stats for current month */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#27272a]/40 text-center">
                <div className="bg-[#18181b] p-2 rounded-lg">
                  <span className="text-[9px] text-[#a1a1aa] block">당월 지출</span>
                  <span className="text-xs font-semibold text-[#fafafa]">{formatKRW(expenseTotal)}</span>
                </div>
                <div className="bg-[#18181b] p-2 rounded-lg">
                  <span className="text-[9px] text-[#a1a1aa] block">방출 회수</span>
                  <span className="text-xs font-semibold text-[#34d399]">{formatKRW(resaleTotal, true)}</span>
                </div>
                <div className="bg-[#18181b] p-2 rounded-lg">
                  <span className="text-[9px] text-[#a1a1aa] block">목표 회수율</span>
                  <span className="text-xs font-semibold text-[#a78bfa]">{theme.targetRecoveryRate}%</span>
                </div>
              </div>

              {/* Progress bar towards target recovery */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-[#a1a1aa] mb-1">
                  <span>현재 회수 달성도</span>
                  <span className="font-semibold text-[#fafafa]">{currentRecoveryRate}% / 목표 {theme.targetRecoveryRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1e1e22] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      currentRecoveryRate >= theme.targetRecoveryRate ? 'bg-[#34d399]' : 'bg-[#7c3aed]'
                    }`}
                    style={{ width: `${Math.min(100, (currentRecoveryRate / (theme.targetRecoveryRate || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Management Actions */}
              {!['watch', 'plant', 'apparel', 'gacha', 'vintage'].includes(theme.id) && (
                <div className="flex justify-end pt-2 mt-2 border-t border-[#27272a]/40">
                  <button
                    onClick={() => onDeleteTheme(theme.id)}
                    className="text-[11px] text-[#ef4444] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">delete</span>
                    테마 삭제
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
