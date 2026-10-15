import React, { useState } from 'react';
import { CollectorTheme, WishlistItem, VaultItem } from '../../types';

interface AddWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: CollectorTheme;
  vaultItems: VaultItem[];
  onAddWishlist: (item: Omit<WishlistItem, 'id'>) => void;
}

export const AddWishlistModal: React.FC<AddWishlistModalProps> = ({
  isOpen,
  onClose,
  theme,
  vaultItems,
  onAddWishlist,
}) => {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [targetMonth, setTargetMonth] = useState('2026-11');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const defaultImg =
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=80';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    if (!name.trim() || isNaN(price) || price <= 0) return;

    onAddWishlist({
      themeId: theme.id,
      brand: brand.trim() || 'Designer',
      name: name.trim(),
      price,
      priority,
      targetMonth,
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || defaultImg,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121215] border border-[#27272a] rounded-xl p-4 shadow-xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]/50">
          <h3 className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a78bfa] text-[18px]">bookmark_heart</span>
            {theme.name} 위시리스트 추가
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">브랜드</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="예: Lemaire"
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-[#a1a1aa] font-medium">목표 영입월</label>
              <input
                type="text"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                placeholder="2026-11"
                className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">위시 품목명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 르메르 벨티드 맥코트"
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">목표 예산 (원)</label>
            <input
              type="text"
              value={priceStr}
              onChange={(e) => {
                const num = e.target.value.replace(/[^0-9]/g, '');
                setPriceStr(num ? Number(num).toLocaleString() : '');
              }}
              placeholder="예: 1,450,000"
              className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa] font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-[#a1a1aa] font-medium">영입 우선순위</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                    priority === p
                      ? 'bg-[#7c3aed] text-white font-semibold'
                      : 'bg-[#18181b] text-[#a1a1aa]'
                  }`}
                >
                  {p === 'high' ? '1순위' : p === 'medium' ? '2순위' : '관심'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-[#a1a1aa] font-medium">순환 펀딩 메모</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 아우터 1벌 방출 시 영입 예정"
              className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[#fafafa] text-xs focus:outline-none focus:border-[#a78bfa]"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#27272a]/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-[#18181b] text-xs text-[#a1a1aa]"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-[#a78bfa] text-xs text-[#0a0012] font-semibold hover:opacity-90 transition-all"
            >
              위시 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
