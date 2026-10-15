import React, { useState } from 'react';
import { VaultItem, CollectorTheme } from '../types';
import { formatKRW } from '../utils/formatters';

interface VaultTabProps {
  theme: CollectorTheme;
  vaultItems: VaultItem[];
  onOpenAddItem: () => void;
  onIncrementWear: (itemId: string) => void;
  onInitiateResale: (item: VaultItem) => void;
  onSelectItem: (item: VaultItem) => void;
}

export const VaultTab: React.FC<VaultTabProps> = ({
  theme,
  vaultItems,
  onOpenAddItem,
  onIncrementWear,
  onInitiateResale,
  onSelectItem,
}) => {
  const [filter, setFilter] = useState<'all' | 'keeping' | 'selling' | 'permanent'>('all');

  const themeItems = vaultItems.filter((item) => item.themeId === theme.id);

  const filteredItems = themeItems.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const totalValue = themeItems.reduce((acc, item) => acc + item.purchasePrice, 0);
  const totalEstimatedResale = themeItems.reduce((acc, item) => acc + item.estimatedResalePrice, 0);
  const totalWears = themeItems.reduce((acc, item) => acc + item.wearCount, 0);
  const avgCostPerWear = totalWears > 0 ? Math.round(totalValue / totalWears) : 0;

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Vault Summary Card */}
      <div className="bg-[#121215] border border-[#27272a]/60 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#a1a1aa]">{theme.name} 보관함 자산 현황</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#27272a] text-[#a1a1aa]">
            총 {themeItems.length}개 소장
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3.5">
          <div>
            <p className="text-[11px] text-[#a1a1aa] mb-0.5">총 소장 가치 (취득 원가)</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-[#fafafa]">
                {totalValue.toLocaleString()}원
              </span>
            </div>
          </div>
          <button
            onClick={onOpenAddItem}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#a78bfa] text-[#0a0012] text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>아이템 등록</span>
          </button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#27272a]/50">
          <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5">
            <span className="text-[10px] text-[#a1a1aa] block mb-0.5">평균 착용 원가</span>
            <p className="text-sm font-semibold text-[#fafafa]">{avgCostPerWear.toLocaleString()}원/회</p>
            <p className="text-[10px] text-[#34d399] mt-0.5">누적 {totalWears}회 착용</p>
          </div>
          <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5">
            <span className="text-[10px] text-[#a1a1aa] block mb-0.5">예상 방출 회수금</span>
            <p className="text-sm font-semibold text-[#fafafa]">+{totalEstimatedResale.toLocaleString()}원</p>
            <p className="text-[10px] text-[#a1a1aa] mt-0.5">시세 감가 24.5% 반영</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-[#1e1e22] text-[#fafafa] font-medium border border-[#27272a]'
              : 'text-[#a1a1aa] bg-[#121215] hover:text-[#fafafa]'
          }`}
        >
          전체 ({themeItems.length})
        </button>
        <button
          onClick={() => setFilter('keeping')}
          className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
            filter === 'keeping'
              ? 'bg-[#1e1e22] text-[#fafafa] font-medium border border-[#27272a]'
              : 'text-[#a1a1aa] bg-[#121215] hover:text-[#fafafa]'
          }`}
        >
          실착/보유 ({themeItems.filter((i) => i.status === 'keeping').length})
        </button>
        <button
          onClick={() => setFilter('selling')}
          className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
            filter === 'selling'
              ? 'bg-[#1e1e22] text-[#fafafa] font-medium border border-[#27272a]'
              : 'text-[#a1a1aa] bg-[#121215] hover:text-[#fafafa]'
          }`}
        >
          방출 예정 ({themeItems.filter((i) => i.status === 'selling').length})
        </button>
        <button
          onClick={() => setFilter('permanent')}
          className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
            filter === 'permanent'
              ? 'bg-[#1e1e22] text-[#fafafa] font-medium border border-[#27272a]'
              : 'text-[#a1a1aa] bg-[#121215] hover:text-[#fafafa]'
          }`}
        >
          영구 소장 ({themeItems.filter((i) => i.status === 'permanent').length})
        </button>
      </div>

      {/* Item List */}
      <div className="flex flex-col gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-[#121215] rounded-xl p-8 text-center border border-[#27272a]/50 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#52525b]">checkroom</span>
            <p className="text-xs text-[#a1a1aa]">보관함에 등록된 아이템이 없습니다.</p>
            <button
              onClick={onOpenAddItem}
              className="mt-2 text-xs text-[#a78bfa] hover:underline"
            >
              새 컬렉션 등록하기
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const costPerWear = item.wearCount > 0 ? Math.round(item.purchasePrice / item.wearCount) : item.purchasePrice;
            const statusLabel =
              item.status === 'selling'
                ? '방출 예정'
                : item.status === 'permanent'
                ? '영구 소장'
                : '보유 중';
            const statusBadgeStyle =
              item.status === 'selling'
                ? 'bg-[#3b1111] text-[#fca5a5] border border-[#ef4444]/30'
                : item.status === 'permanent'
                ? 'bg-[#065f46] text-[#bbf7d0]'
                : 'bg-[#27272a] text-[#a1a1aa]';

            return (
              <div
                key={item.id}
                className="bg-[#121215] border border-[#27272a]/40 rounded-xl p-3.5 hover:bg-[#18181b] transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Photo */}
                  <div
                    onClick={() => onSelectItem(item)}
                    className="relative w-16 h-16 rounded-lg bg-[#1e1e22] overflow-hidden flex-shrink-0 border border-[#27272a]/60 cursor-pointer group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[9px] font-mono bg-black/70 text-[#34d399]">
                      {item.wearCount}회
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#a78bfa] font-medium uppercase tracking-wider block">
                          {item.brand}
                        </span>
                        <h4
                          onClick={() => onSelectItem(item)}
                          className="text-xs font-semibold text-[#fafafa] truncate cursor-pointer hover:text-[#a78bfa]"
                        >
                          {item.name}
                        </h4>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${statusBadgeStyle}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-[#a1a1aa]">
                        구입: <span className="text-[#fafafa] font-medium">{formatKRW(item.purchasePrice)}</span>
                      </span>
                      <span className="text-[11px] text-[#34d399]">
                        회당 {formatKRW(costPerWear)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#27272a]/40">
                      <button
                        onClick={() => onIncrementWear(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#1e1e22] hover:bg-[#27272a] text-[#fafafa] text-[11px] font-medium transition-colors"
                        title="오늘 착용/사용 카운트 +1"
                      >
                        <span className="material-symbols-outlined text-[13px] text-[#a78bfa]">add_circle</span>
                        <span>실착 +1</span>
                      </button>

                      {item.status === 'selling' ? (
                        <button
                          onClick={() => onInitiateResale(item)}
                          className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#065f46] hover:bg-[#047857] text-[#bbf7d0] text-[11px] font-medium transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px]">sell</span>
                          <span>가계부 매각 등록</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectItem(item)}
                          className="px-2.5 py-1 rounded-md bg-[#18181b] hover:bg-[#1e1e22] text-[#a1a1aa] hover:text-[#fafafa] text-[11px] transition-colors"
                        >
                          상세보기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
