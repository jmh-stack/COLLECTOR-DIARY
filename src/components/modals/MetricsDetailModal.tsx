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

  const getThemeExplanation = (themeId: string, themeName: string) => {
    switch (themeId) {
      case 'watch':
        return {
          title: `${themeName} 회전율 & 실착 원가 산출 근거`,
          metric1Title: '1. 회당 실착 원가 (Cost Per Wear)',
          metric1Desc: '[총 구입비용 ÷ 총 실착 횟수]로 계산됩니다. 많이 착용할수록 회당 원가가 절감되어 고가 타임피스도 합리적인 자산으로 전환됩니다.',
          metric2Desc: '[(최초 영입가 - 실제 방출가) ÷ 최초 영입가]의 평균값입니다. 20% 이하일 경우 중고 시장에서 시세 방어력이 뛰어난 브랜드로 평가됩니다.',
        };
      case 'plant':
        return {
          title: `${themeName} 순환 & 소장 관리 원가 산출 근거`,
          metric1Title: '1. 개체당 소장 원가 (Cost Per Specimen)',
          metric1Desc: '[총 구입비용 ÷ 소장 개체수 또는 관리 개월수]로 계산됩니다. 지속적으로 케어하고 번식하여 분양할수록 지출 원가가 회수됩니다.',
          metric2Desc: '[(최초 영입가 - 실제 분양가) ÷ 최초 영입가]의 비율입니다. 번식 분양 시 원가 대비 100% 이상 수익 전환되기도 합니다.',
        };
      case 'gacha':
        return {
          title: `${themeName} 회전율 & 소장 지표 산출 근거`,
          metric1Title: '1. 개체당 소장 원가 (Cost Per Item)',
          metric1Desc: '[총 지출비용 ÷ 소장 아이템 수]로 계산됩니다. 중복 개체 정리와 위시 영입을 병행하여 컬렉션의 순환 만족도를 높입니다.',
          metric2Desc: '인기 아티스트 한정판이나 시크릿 개체일수록 2차 거래 시세 방어율이 높게 유지됩니다.',
        };
      case 'vintage':
        return {
          title: `${themeName} 회전율 & 사용 가치 산출 근거`,
          metric1Title: '1. 회당 사용 원가 (Cost Per Use)',
          metric1Desc: '[총 취득원가 ÷ 총 사용 횟수/일수]로 계산됩니다. 시간이 지날수록 오리지널 빈티지 특유의 소장 가치가 누적됩니다.',
          metric2Desc: '희귀 빈티지 조명, 오디오 및 가구는 시간이 흘러도 감가상각이 적고 가치가 안정적으로 유지됩니다.',
        };
      case 'apparel':
      default:
        return {
          title: `${themeName} 회전율 & 착용 원가 산출 근거`,
          metric1Title: '1. 회당 착용 원가 (Cost Per Wear)',
          metric1Desc: '[총 구입비용 ÷ 총 실착 횟수]로 계산됩니다. 많이 착용할수록 회당 원가가 절감되어 고가 의류도 합리적인 소비로 전환됩니다.',
          metric2Desc: '[(최초 영입가 - 실제 방출가) ÷ 최초 영입가]의 평균값입니다. 30% 이하일 경우 중고 시장에서 가치 방어가 매우 우수한 브랜드로 평가됩니다.',
        };
    }
  };

  const exp = getThemeExplanation(theme.id, theme.name);

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">query_stats</span>
            {exp.title}
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
              <span className="font-semibold text-[#fafafa]">{exp.metric1Title}</span>
              <span className="text-[#34d399] font-bold">
                {metrics.costPerWear > 0 ? formatKRW(metrics.costPerWear) : '-'}
              </span>
            </div>
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              {exp.metric1Desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#fafafa]">2. 평균 방출 감가율</span>
              <span className="text-[#34d399] font-bold">
                {metrics.avgDepreciationRate > 0 ? `${metrics.avgDepreciationRate}%` : '-'}
              </span>
            </div>
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              {exp.metric2Desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a]/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#fafafa]">3. 매각/정리 소요일</span>
              <span className="text-[#a78bfa] font-bold">
                {metrics.avgDaysToSell > 0 ? `${metrics.avgDaysToSell}일` : '-'}
              </span>
            </div>
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              방출 등록 후 거래 완료까지 걸린 평균 일수입니다. 짧을수록 유동성이 높아 즉각적인 자금 회수가 가능함을 의미합니다.
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
