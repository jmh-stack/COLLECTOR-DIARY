import React, { useState } from 'react';

interface FilterSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
  onSortChange: (sort: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc') => void;
  selectedChannel: string;
  onChannelChange: (ch: string) => void;
}

export const FilterSearchModal: React.FC<FilterSearchModalProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedChannel,
  onChannelChange,
}) => {
  if (!isOpen) return null;

  const channels = ['전체', '번개장터', '중고나라', '당근마켓', 'KREAM', '구매대행/직구', '세탁/케어'];

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">tune</span>
            거래 검색 및 정렬 필터
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="space-y-1">
          <label className="text-[11px] text-[#a1a1aa] font-medium">검색어 (아이템명, 브랜드, 태그)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#a1a1aa] text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="예: 바버, 니콜슨, 택배거래, 크림..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs placeholder:text-[#52525b] focus:outline-none focus:border-[#a78bfa]"
            />
          </div>
        </div>

        {/* Sort options */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#a1a1aa] font-medium">정렬 기준</label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => onSortChange('date-desc')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                sortBy === 'date-desc' ? 'bg-[#7c3aed] text-white border-[#a78bfa]' : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]'
              }`}
            >
              최신 거래순
            </button>
            <button
              onClick={() => onSortChange('date-asc')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                sortBy === 'date-asc' ? 'bg-[#7c3aed] text-white border-[#a78bfa]' : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]'
              }`}
            >
              과거 거래순
            </button>
            <button
              onClick={() => onSortChange('amount-desc')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                sortBy === 'amount-desc' ? 'bg-[#7c3aed] text-white border-[#a78bfa]' : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]'
              }`}
            >
              금액 높은순
            </button>
            <button
              onClick={() => onSortChange('amount-asc')}
              className={`p-2 rounded-lg border text-left transition-colors ${
                sortBy === 'amount-asc' ? 'bg-[#7c3aed] text-white border-[#a78bfa]' : 'bg-[#18181b] text-[#a1a1aa] border-[#27272a]'
              }`}
            >
              금액 낮은순
            </button>
          </div>
        </div>

        {/* Channel Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#a1a1aa] font-medium">거래 채널 필터</label>
          <div className="flex flex-wrap gap-1.5">
            {channels.map((ch) => (
              <button
                key={ch}
                onClick={() => onChannelChange(ch === '전체' ? '' : ch)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  (ch === '전체' && !selectedChannel) || selectedChannel === ch
                    ? 'bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/40 font-medium'
                    : 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a] hover:text-[#fafafa]'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 mt-2 rounded-lg bg-[#a78bfa] text-xs text-[#0a0012] font-semibold hover:opacity-90 transition-all"
        >
          필터 적용하기
        </button>
      </div>
    </div>
  );
};
