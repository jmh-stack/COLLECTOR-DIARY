import React from 'react';
import { ThemeMetrics, CollectorTheme } from '../../types';
import { formatKRW } from '../../utils/formatters';

interface MetricsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CollectorTheme;
  metrics: ThemeMetrics;
}

export const MetricsDetailModal: React.FC<MetricsDetailModalProps> = ({
  isOpen,
  onClose,
  theme,
  metrics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">query_stats</span>
            {theme.name} 회전율 & 착용 원가 산출 근거
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Card 1 */}
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#fafafa]">1. 회당 착용 원가 (Cost Per Wear)</span>
              <span className="text-[#34d399] font-bold">{formatKRW(metrics.costPerWear)}</span>
            </div>
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              [총 구입비용 ÷ 총 실착 횟수]로 계산됩니다. 많이 착용할수록 회당 원가가 절감되어 고가 의류도 합리적인 소비로 전환됩니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#fafafa]">2. 평균 방출 감가율</span>
              <span className="text-[#34d399] font-bold">{metrics.avgDepreciationRate}%</span>
            </div>
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              [(최초 영입가 - 실제 방출가) ÷ 최초 영입가]의 평균값입니다. 30% 이하일 경우 중고 시장에서 가치 방어가 매우 우수한 명품/디자이너 레이블로 평가됩니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#fafafa]">3. 중고 매각 소요일</span>
              <span className="text-[#a78bfa] font-bold">{metrics.avgDaysToSell}일</span>
            </div>
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              판매 글 등록 후 거래 완료까지 걸린 평균 일수입니다. 짧을수록 유동성이 높아 즉각적인 자금 회수가 가능함을 의미합니다.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-[#a78bfa] text-xs text-[#0a0012] font-semibold hover:opacity-90 transition-all"
        >
          확인
        </button>
      </div>
    </div>
  );
};
