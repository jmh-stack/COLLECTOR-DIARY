import React from 'react';
import { CollectorTheme, Transaction, ThemeMetrics } from '../../types';
import { formatKRW } from '../../utils/formatters';

interface SettlementAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CollectorTheme;
  currentMonth: string;
  transactions: Transaction[];
  metrics: ThemeMetrics;
}

export const SettlementAnalysisModal: React.FC<SettlementAnalysisModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentMonth,
  transactions,
  metrics,
}) => {
  if (!isOpen) return null;

  const monthTx = transactions.filter(
    (t) => t.themeId === theme.id && t.month === currentMonth
  );
  const resaleTx = monthTx.filter((t) => t.type === 'resale');
  const expenseTx = monthTx.filter((t) => t.type === 'purchase' || t.type === 'care');

  const totalResale = resaleTx.reduce((sum, t) => sum + Math.max(0, t.amount), 0);
  const totalExpense = expenseTx.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netSettlement = totalResale - totalExpense;
  const recoveryRate = totalExpense > 0 ? (totalResale / totalExpense) * 100 : 100;

  // Breakdown by channel
  const channelsMap: Record<string, number> = {};
  monthTx.forEach((t) => {
    const ch = t.channel.split(' ')[0] || '기타';
    channelsMap[ch] = (channelsMap[ch] || 0) + Math.abs(t.amount);
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-2 border-b border-[#27272a]/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/20 text-[#a78bfa] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">analytics</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#fafafa]">{theme.name} 정산 심층 분석</h3>
              <p className="text-[10px] text-[#a1a1aa]">{currentMonth} 월간 순환 리포트</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Big Health Indicator */}
        <div className="bg-[#18181b] border border-[#27272a]/40 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#a1a1aa]">순환 방어 지수</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#065f46] text-[#bbf7d0]">
              {recoveryRate >= 80 ? '최우수 (S등급)' : recoveryRate >= 60 ? '양호 (A등급)' : '주의 (B등급)'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#fafafa]">회수율 {recoveryRate.toFixed(1)}%</span>
            <span className="text-xs text-[#34d399]">
              순부담 {formatKRW(Math.abs(netSettlement))}
            </span>
          </div>

          {/* Visual comparison bar */}
          <div className="w-full space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-[#a1a1aa]">
              <span className="text-[#34d399]">방출 회수 {formatKRW(totalResale)}</span>
              <span className="text-[#a1a1aa]">지출 합계 {formatKRW(totalExpense)}</span>
            </div>
            <div className="w-full h-2 bg-[#1e1e22] rounded-full overflow-hidden flex">
              <div
                className="h-full bg-[#34d399] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, recoveryRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Key Metrics Snapshot */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#18181b] p-2.5 rounded-lg text-center border border-[#27272a]/40">
            <span className="text-[10px] text-[#a1a1aa] block mb-0.5">회당 착용 원가</span>
            <span className="text-xs font-bold text-[#fafafa]">{formatKRW(metrics.costPerWear)}</span>
            <span className="text-[9px] text-[#34d399] block mt-0.5">{metrics.costPerWearStatus}</span>
          </div>
          <div className="bg-[#18181b] p-2.5 rounded-lg text-center border border-[#27272a]/40">
            <span className="text-[10px] text-[#a1a1aa] block mb-0.5">방출 감가율</span>
            <span className="text-xs font-bold text-[#fafafa]">{metrics.avgDepreciationRate}%</span>
            <span className="text-[9px] text-[#34d399] block mt-0.5">{metrics.avgDepreciationStatus}</span>
          </div>
          <div className="bg-[#18181b] p-2.5 rounded-lg text-center border border-[#27272a]/40">
            <span className="text-[10px] text-[#a1a1aa] block mb-0.5">매각 소요일</span>
            <span className="text-xs font-bold text-[#fafafa]">{metrics.avgDaysToSell}일</span>
            <span className="text-[9px] text-[#a1a1aa] block mt-0.5">{metrics.avgDaysToSellStatus}</span>
          </div>
        </div>

        {/* Strategic Analysis & Insights */}
        <div className="bg-[#0f0f12] border border-[#27272a]/40 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#a78bfa]">
            <span className="material-symbols-outlined text-[15px]">tips_and_updates</span>
            <span>컬렉터 스마트 순환 분석</span>
          </div>
          <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
            {metrics.reportContent}
          </p>
          <div className="pt-2 border-t border-[#27272a]/40 text-[10px] text-[#a1a1aa] space-y-1">
            {monthTx.length > 0 ? (
              <>
                <p className="flex items-center gap-1">
                  <span className="text-[#34d399]">✔</span>
                  <span>
                    방출 매각 {resaleTx.length}건을 통해 지출의 {recoveryRate.toFixed(1)}%를 자가 조달
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  <span className="text-[#34d399]">✔</span>
                  <span>
                    {netSettlement >= 0
                      ? '순흑자 정산으로 자산 규모를 안정적으로 방어 중'
                      : '보관함 내 미착용 아이템 방출로 추가 지출 방어 가능'}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-[#71717a]">
                거래 내역을 기록하면 실시간 순환 분석 및 조달률 통계가 제공됩니다.
              </p>
            )}
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-[#a1a1aa]">거래 채널별 유동성 비중</span>
          {Object.keys(channelsMap).length === 0 ? (
            <p className="text-[11px] text-[#71717a] py-2 px-1 text-center bg-[#18181b] rounded-lg">
              기록된 거래 채널 데이터가 없습니다.
            </p>
          ) : (
            <div className="space-y-1">
              {Object.entries(channelsMap).map(([channel, amount]) => (
                <div key={channel} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-[#18181b]">
                  <span className="text-[#a1a1aa]">{channel}</span>
                  <span className="text-[#fafafa] font-medium">{formatKRW(amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-[#a78bfa] text-xs text-[#0a0012] font-semibold hover:opacity-90 transition-all"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};
