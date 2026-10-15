import React, { useState } from 'react';
import { Transaction, CollectorTheme, ThemeMetrics } from '../types';
import { formatKRW } from '../utils/formatters';

interface LedgerTabProps {
  theme: CollectorTheme;
  transactions: Transaction[];
  metrics: ThemeMetrics;
  currentMonth: string;
  onChangeMonth: (delta: number) => void;
  onOpenAddModal: () => void;
  onOpenAnalysisModal: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onOpenMetricsDetail: () => void;
}

export const LedgerTab: React.FC<LedgerTabProps> = ({
  theme,
  transactions,
  metrics,
  currentMonth,
  onChangeMonth,
  onOpenAddModal,
  onOpenAnalysisModal,
  onSelectTransaction,
  onOpenMetricsDetail,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'resale' | 'purchase'>('all');

  // Filter transactions for this month and theme
  const monthTransactions = transactions.filter(
    (t) => t.themeId === theme.id && t.month === currentMonth
  );

  // Totals calculation
  const resaleTransactions = monthTransactions.filter((t) => t.type === 'resale');
  const purchaseTransactions = monthTransactions.filter(
    (t) => t.type === 'purchase' || t.type === 'care'
  );

  const totalResale = resaleTransactions.reduce((acc, t) => acc + Math.max(0, t.amount), 0);
  const totalExpense = purchaseTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const netSettlement = totalResale - totalExpense;

  // Recovery Rate
  const recoveryRate =
    totalExpense > 0
      ? Math.min(100, Math.round((totalResale / totalExpense) * 1000) / 10)
      : totalResale > 0
      ? 100
      : 0;

  // Active filter item list
  const filteredList = monthTransactions.filter((t) => {
    if (filterType === 'all') return true;
    if (filterType === 'resale') return t.type === 'resale';
    if (filterType === 'purchase') return t.type === 'purchase' || t.type === 'care';
    return true;
  });

  // Format month string e.g. "2026-09" -> "2026년 9월"
  const [year, month] = currentMonth.split('-');
  const formattedMonthStr = `${year}년 ${parseInt(month, 10)}월`;

  // Category-specific ledger terms
  const getThemeLedgerTerms = (themeId: string) => {
    switch (themeId) {
      case 'watch':
        return {
          purchaseSubtext: '영입 및 정비',
          filterPurchaseLabel: '영입/정비',
          metricsSectionTitle: '시계 회전율 & 실착 원가 지표',
          costPerWearLabel: '회당 실착 원가',
          resaleCountLabel: '중고 거래 매각',
        };
      case 'plant':
        return {
          purchaseSubtext: '영입 및 케어',
          filterPurchaseLabel: '영입/케어',
          metricsSectionTitle: '식물 순환 & 소장 관리 지표',
          costPerWearLabel: '개체당 소장 원가',
          resaleCountLabel: '분양 및 매각',
        };
      case 'gacha':
        return {
          purchaseSubtext: '영입 및 구매',
          filterPurchaseLabel: '영입/구매',
          metricsSectionTitle: '아트토이 회전율 & 소장 지표',
          costPerWearLabel: '개체당 소장 원가',
          resaleCountLabel: '중고 거래 매각',
        };
      case 'vintage':
        return {
          purchaseSubtext: '영입 및 케어',
          filterPurchaseLabel: '영입/케어',
          metricsSectionTitle: '빈티지 회전율 & 소장 지표',
          costPerWearLabel: '회당 사용 원가',
          resaleCountLabel: '중고 거래 매각',
        };
      case 'apparel':
      default:
        return {
          purchaseSubtext: '영입 및 세탁',
          filterPurchaseLabel: '영입/세탁',
          metricsSectionTitle: '의류 회전율 & 착용 원가 지표',
          costPerWearLabel: '회당 착용 원가',
          resaleCountLabel: '중고 거래 매각',
        };
    }
  };

  const ledgerTerms = getThemeLedgerTerms(theme.id);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Section 1: Monthly Settlement Header Card */}
      <div className="relative bg-[#121215] border border-[#27272a]/60 rounded-xl p-4 overflow-hidden shadow-sm">
        {/* Top title and recovery rate badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={() => onChangeMonth(-1)}
              className="p-1 -ml-1 text-[#a1a1aa] hover:text-[#fafafa] transition-colors rounded"
              title="이전 달"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <span className="text-xs font-medium tracking-tight text-[#a1a1aa] truncate">
              {formattedMonthStr} {theme.name} 정산 가계부
            </span>
            <button
              onClick={() => onChangeMonth(1)}
              className="p-1 text-[#a1a1aa] hover:text-[#fafafa] transition-colors rounded"
              title="다음 달"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#065f46] text-[#bbf7d0] whitespace-nowrap">
            회수율 {recoveryRate.toFixed(1)}%
          </span>
        </div>

        {/* Big Balance & Quick Add Action */}
        <div className="flex items-baseline justify-between mb-3.5">
          <div>
            <p className="text-[11px] text-[#a1a1aa] mb-0.5">당월 순지출 정산</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-[#fafafa] whitespace-nowrap">
                {netSettlement > 0 ? `+${netSettlement.toLocaleString()}원` : `${netSettlement.toLocaleString()}원`}
              </span>
              <span className="text-[11px] font-medium text-[#34d399] whitespace-nowrap">
                {monthTransactions.length === 0
                  ? '기록 대기'
                  : netSettlement >= 0
                  ? '순흑자 달성'
                  : recoveryRate >= 70
                  ? '초과방출 선방'
                  : '지출 방어 필요'}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#a78bfa] text-[#0a0012] text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span className="whitespace-nowrap">거래 기록</span>
          </button>
        </div>

        {/* Resale to Expense Ratio Progress Meter */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between items-center text-[10px] text-[#a1a1aa]">
            <span>방출 회수 {totalResale.toLocaleString()}원 ({recoveryRate.toFixed(1)}%)</span>
            <span>지출 합계 {totalExpense.toLocaleString()}원</span>
          </div>
          <div className="w-full h-1.5 bg-[#1e1e22] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#34d399] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, recoveryRate)}%` }}
            />
          </div>
        </div>

        {/* 2 Sub Stats Cards: Resale vs Purchase */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5">
            <div className="flex items-center gap-1 text-[#34d399] text-[11px] font-medium mb-1">
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              <span className="truncate">방출 회수</span>
            </div>
            <p className="text-sm font-semibold text-[#fafafa] tracking-tight whitespace-nowrap">
              +{totalResale.toLocaleString()}원
            </p>
            <p className="text-[10px] text-[#a1a1aa] truncate mt-0.5">
              총 {resaleTransactions.length}건 {ledgerTerms.resaleCountLabel}
            </p>
          </div>

          <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5">
            <div className="flex items-center gap-1 text-[#a1a1aa] text-[11px] font-medium mb-1">
              <span className="material-symbols-outlined text-[14px]">south_west</span>
              <span className="truncate">신규 영입/케어</span>
            </div>
            <p className="text-sm font-semibold text-[#fafafa] tracking-tight whitespace-nowrap">
              -{totalExpense.toLocaleString()}원
            </p>
            <p className="text-[10px] text-[#a1a1aa] truncate mt-0.5">
              총 {purchaseTransactions.length}건 {ledgerTerms.purchaseSubtext}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Tab Switcher & Dynamic Filters */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar" id="filter-group">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-[#1e1e22] text-[#fafafa] font-medium border border-[#27272a]'
                : 'text-[#a1a1aa] bg-[#121215] hover:text-[#fafafa]'
            }`}
          >
            전체 ({monthTransactions.length})
          </button>
          <button
            onClick={() => setFilterType('resale')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              filterType === 'resale'
                ? 'bg-[#1e1e22] text-[#fafafa] font-medium border border-[#27272a]'
                : 'text-[#a1a1aa] bg-[#121215] hover:text-[#fafafa]'
            }`}
          >
            방출/매각 ({resaleTransactions.length})
          </button>
          <button
            onClick={() => setFilterType('purchase')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              filterType === 'purchase'
                ? 'bg-[#1e1e22] text-[#fafafa] font-medium border border-[#27272a]'
                : 'text-[#a1a1aa] bg-[#121215] hover:text-[#fafafa]'
            }`}
          >
            {ledgerTerms.filterPurchaseLabel} ({purchaseTransactions.length})
          </button>
        </div>

        <button
          onClick={onOpenAnalysisModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#a78bfa] bg-[#121215] hover:bg-[#18181b] border border-[#27272a]/60 transition-colors whitespace-nowrap flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[14px]">analytics</span>
          <span>정산 분석</span>
        </button>
      </div>

      {/* Section 3: Transaction History List */}
      <div className="flex flex-col gap-2.5">
        {filteredList.length === 0 ? (
          <div className="bg-[#121215] rounded-xl p-8 text-center border border-[#27272a]/50 flex flex-col items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-3xl text-[#52525b]">receipt_long</span>
            <p className="text-xs text-[#a1a1aa] font-medium">
              {formattedMonthStr} {theme.name} 거래 내역이 없습니다.
            </p>
            <p className="text-[11px] text-[#71717a]">
              상단의 <strong className="text-[#a78bfa] font-medium">+ 거래 기록</strong> 버튼을 눌러 첫 거래를 등록해보세요.
            </p>
          </div>
        ) : (
          filteredList.map((tx) => {
            const isResale = tx.type === 'resale';
            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="bg-[#121215] border border-[#27272a]/40 rounded-lg p-3 hover:bg-[#18181b] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail / Icon with corner badge */}
                  {tx.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-lg bg-[#1e1e22] overflow-hidden flex-shrink-0 border border-[#27272a]/60">
                      <img
                        src={tx.imageUrl}
                        alt={tx.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className={`absolute bottom-0 right-0 p-0.5 bg-[#0c0c0f]/90 rounded-tl ${
                        isResale ? 'text-[#34d399]' : 'text-[#a78bfa]'
                      }`}>
                        <span className="material-symbols-outlined text-[10px] block">
                          {isResale ? 'trending_up' : 'shopping_bag'}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-12 h-12 rounded-lg bg-[#1e1e22] flex items-center justify-center flex-shrink-0 text-[#a1a1aa] border border-[#27272a]/60">
                      <span className="material-symbols-outlined text-[24px]">
                        {tx.type === 'care' ? 'dry_cleaning' : 'receipt'}
                      </span>
                    </div>
                  )}

                  {/* Transaction content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-xs font-semibold text-[#fafafa] truncate group-hover:text-[#a78bfa] transition-colors">
                        {tx.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold whitespace-nowrap ${
                          isResale ? 'text-[#34d399]' : 'text-[#fafafa]'
                        }`}
                      >
                        {formatKRW(tx.amount, true)}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#a1a1aa] truncate mb-2">{tx.channel}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {tx.badges.map((b, idx) => {
                          const isGreenBadge = b.includes('완료') || b.includes('방출') || b.includes('분양');
                          const isPurpleBadge = b.includes('영입') || b.includes('신규');
                          return (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
                                isGreenBadge
                                  ? 'bg-[#065f46] text-[#bbf7d0]'
                                  : isPurpleBadge
                                  ? 'bg-[#27272a] text-[#a1a1aa]'
                                  : 'bg-[#1e1e22] text-[#a1a1aa]'
                              }`}
                            >
                              {b}
                            </span>
                          );
                        })}
                      </div>
                      <span
                        className={`text-[10px] whitespace-nowrap ${
                          tx.subtext.includes('정산 완료') ? 'text-[#34d399]' : 'text-[#a1a1aa]'
                        }`}
                      >
                        {tx.subtext}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Section 4: Turnover & Wear Cost Statistics */}
      <div className="bg-[#121215] border border-[#27272a]/60 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#fafafa]">{ledgerTerms.metricsSectionTitle}</span>
          <button
            onClick={onOpenMetricsDetail}
            className="text-[11px] text-[#a78bfa] flex items-center gap-0.5 hover:underline"
          >
            <span>산출 기준 안내</span>
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Metric 1 */}
          <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-[#a1a1aa] mb-1">{ledgerTerms.costPerWearLabel}</span>
            <div>
              <p className="text-sm font-bold text-[#fafafa] whitespace-nowrap">
                {metrics.costPerWear > 0 ? `${metrics.costPerWear.toLocaleString()}원` : '-'}
              </p>
              <p className="text-[10px] text-[#34d399] mt-0.5 whitespace-nowrap">
                {metrics.costPerWearStatus}
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-[#a1a1aa] mb-1">평균 방출 감가율</span>
            <div>
              <p className="text-sm font-bold text-[#fafafa] whitespace-nowrap">
                {metrics.avgDepreciationRate > 0 ? `${metrics.avgDepreciationRate.toFixed(1)}%` : '-'}
              </p>
              <p className="text-[10px] text-[#34d399] mt-0.5 whitespace-nowrap">
                {metrics.avgDepreciationStatus}
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-[#a1a1aa] mb-1">중고 매각 소요일</span>
            <div>
              <p className="text-sm font-bold text-[#fafafa] whitespace-nowrap">
                {metrics.avgDaysToSell > 0 ? `${metrics.avgDaysToSell.toFixed(1)}일` : '-'}
              </p>
              <p className="text-[10px] text-[#a1a1aa] mt-0.5 whitespace-nowrap">
                {metrics.avgDaysToSellStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Bottom Analysis Report Card */}
      <div className="bg-[#0f0f12] border border-[#27272a]/40 rounded-xl p-3.5 mb-2 shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1e1e22] flex items-center justify-center flex-shrink-0 text-[#a78bfa] mt-0.5">
            <span className="material-symbols-outlined text-[16px]">insights</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-semibold text-[#fafafa] truncate">{metrics.reportTitle}</h4>
              <span className="text-[10px] text-[#a1a1aa] whitespace-nowrap">{metrics.reportDefenseStatus}</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              {metrics.reportContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
