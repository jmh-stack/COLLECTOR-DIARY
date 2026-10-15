import React from 'react';
import { WishlistItem, CollectorTheme, VaultItem } from '../types';
import { formatKRW } from '../utils/formatters';

interface WishlistTabProps {
  theme: CollectorTheme;
  wishlist: WishlistItem[];
  vaultItems: VaultItem[];
  onOpenAddWishlist: () => void;
  onFulfillWishlist: (item: WishlistItem) => void;
  onDeleteWishlist: (id: string) => void;
}

export const WishlistTab: React.FC<WishlistTabProps> = ({
  theme,
  wishlist,
  vaultItems,
  onOpenAddWishlist,
  onFulfillWishlist,
  onDeleteWishlist,
}) => {
  const themeWishlist = wishlist.filter((w) => w.themeId === theme.id);
  const totalTargetPrice = themeWishlist.reduce((acc, item) => acc + item.price, 0);

  // Calculate available resale funds from vault items marked as 'selling'
  const sellingVaultItems = vaultItems.filter(
    (v) => v.themeId === theme.id && v.status === 'selling'
  );
  const totalSellingReserve = sellingVaultItems.reduce(
    (acc, v) => acc + v.estimatedResalePrice,
    0
  );

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Wishlist Circulation Strategy Card */}
      <div className="bg-[#121215] border border-[#27272a]/60 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#a1a1aa]">{theme.name} 위시리스트 & 순환 펀딩</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#7c3aed]/20 text-[#c4b5fd]">
            {themeWishlist.length}개 목표
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <p className="text-[11px] text-[#a1a1aa] mb-0.5">총 위시 목표 금액</p>
            <span className="text-2xl font-bold tracking-tight text-[#fafafa]">
              {totalTargetPrice.toLocaleString()}원
            </span>
          </div>
          <button
            onClick={onOpenAddWishlist}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#a78bfa] text-[#0a0012] text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>위시 추가</span>
          </button>
        </div>

        {/* Resale offset funding status */}
        <div className="bg-[#18181b] border border-[#27272a]/40 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#a1a1aa] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#34d399]">currency_exchange</span>
              방출 대기 환전 가능액
            </span>
            <span className="font-semibold text-[#34d399]">
              +{totalSellingReserve.toLocaleString()}원
            </span>
          </div>
          <p className="text-[10px] text-[#a1a1aa]">
            보관함 내 방출 예정 품목 매각 시 1순위 위시 예산의{' '}
            <span className="text-[#34d399] font-medium">
              {totalTargetPrice > 0 ? Math.min(100, Math.round((totalSellingReserve / totalTargetPrice) * 100)) : 0}%
            </span>
            를 자가 충당할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Wishlist List */}
      <div className="flex flex-col gap-2.5">
        {themeWishlist.length === 0 ? (
          <div className="bg-[#121215] rounded-xl p-8 text-center border border-[#27272a]/50 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-3xl text-[#52525b]">bookmark_heart</span>
            <p className="text-xs text-[#a1a1aa]">등록된 위시리스트 아이템이 없습니다.</p>
            <button
              onClick={onOpenAddWishlist}
              className="mt-2 text-xs text-[#a78bfa] hover:underline"
            >
              새 위시 등록하기
            </button>
          </div>
        ) : (
          themeWishlist.map((item) => {
            const priorityBadge =
              item.priority === 'high'
                ? { label: '1순위 영입', class: 'bg-[#7c3aed] text-white' }
                : item.priority === 'medium'
                ? { label: '2순위 영입', class: 'bg-[#27272a] text-[#a1a1aa]' }
                : { label: '관심 품목', class: 'bg-[#18181b] text-[#71717a]' };

            return (
              <div
                key={item.id}
                className="bg-[#121215] border border-[#27272a]/40 rounded-xl p-3.5 hover:bg-[#18181b] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg bg-[#1e1e22] overflow-hidden flex-shrink-0 border border-[#27272a]/60">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#a78bfa] font-medium uppercase tracking-wider block">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-[#fafafa] truncate">
                          {item.name}
                        </h4>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${priorityBadge.class}`}>
                        {priorityBadge.label}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-sm font-bold text-[#fafafa]">
                        {formatKRW(item.price)}
                      </span>
                      {item.targetMonth && (
                        <span className="text-[10px] text-[#a1a1aa]">
                          목표: {item.targetMonth}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-[#a1a1aa] bg-[#18181b] p-1.5 rounded mb-2">
                        💡 {item.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 pt-1 border-t border-[#27272a]/40">
                      <button
                        onClick={() => onFulfillWishlist(item)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#7c3aed] hover:bg-[#6d28d9] text-[#fafafa] text-[11px] font-medium transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        <span>영입 완료 (가계부 지출 등록)</span>
                      </button>
                      <button
                        onClick={() => onDeleteWishlist(item.id)}
                        className="px-2 py-1 rounded-md bg-[#18181b] hover:bg-[#ef4444]/20 hover:text-[#ef4444] text-[#71717a] text-[11px] transition-colors"
                        title="위시 삭제"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
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
